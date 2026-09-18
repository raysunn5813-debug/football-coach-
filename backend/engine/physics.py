"""
backend/engine/physics.py
Gridiron Simulation Physics Engine.

Combines:
  - Parabolic pass trajectory calculation (PassTrajectory class & helpers)
  - Two-pass collision resolution
  - Tackle & catch outcome resolution
  - Reynolds Steering with Kinematic Arrive behavior
  - Plant-and-Cut modifier for sharp direction changes
  - Soft Separation to prevent player stacking

Player objects may be plain dicts OR class instances; all access is routed
through the get_prop / set_prop / get_pos / set_pos adapter helpers.
"""
import math
import random

try:
    from backend.engine.utils import get_prop, set_prop, get_pos, set_pos
except ImportError:
    from engine.utils import get_prop, set_prop, get_pos, set_pos

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

GRAVITY = 10.724  # yd/s²

# States where steering physics should drive movement (replaces simple route-step)
_STEERABLE_STATES = frozenset([
    "RUNNING_ROUTE",
    "FREE",
    "BALL_PURSUIT",
    "ZONE_DROP",
    "SCRAMBLE_OUT",
    "DROPBACK",
    "ENGAGED",
    "BALL_CARRIER",
    "POCKET",
    "HANDOFF_PRESENT",
])

# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------

def calculate_step_velocity(speed_rating: int) -> float:
    """Legacy per-tick step size from a 0-100 speed rating."""
    return 0.08 + ((speed_rating / 100.0) * 0.10)


# ---------------------------------------------------------------------------
# Pass / Ball trajectory
# ---------------------------------------------------------------------------

def calculate_pass_trajectory(qb_pos, target_pos, pass_speed=22.0, g=GRAVITY, *args, **kwargs):
    """
    Back-calculates initial vertical velocity (vy0) and velocity components.
    Guarantees the ball lands accurately at the target height (1.8 yds).
    Supports both tuple/list & dict formats for qb_pos / target_pos.
    Also handles the 4-arg legacy signature:
        (start_pos, target_pos, flight_duration, elapsed_time) -> (x, y, z)
    """
    if isinstance(pass_speed, (int, float)) and len(args) >= 1:
        # Handle 4-arg signature: (start_pos, target_pos, flight_duration, elapsed_time)
        flight_duration = pass_speed
        elapsed_time = args[0]
        start_pos = qb_pos
        x0 = start_pos.get("x", 0.0) if isinstance(start_pos, dict) else start_pos[0]
        y0 = start_pos.get("y", 0.8) if isinstance(start_pos, dict) else start_pos[1]
        z0 = start_pos.get("z", 26.65) if isinstance(start_pos, dict) else start_pos[2]

        xt = target_pos.get("x", 0.0) if isinstance(target_pos, dict) else target_pos[0]
        yt = target_pos.get("y", 1.8) if isinstance(target_pos, dict) else target_pos[1]
        zt = target_pos.get("z", 26.65) if isinstance(target_pos, dict) else target_pos[2]

        if elapsed_time >= flight_duration:
            return xt, yt, zt

        t = elapsed_time / flight_duration if flight_duration > 0 else 1.0
        cur_x = x0 + (xt - x0) * t
        cur_z = z0 + (zt - z0) * t
        vy0 = (yt - y0 + (0.5 * g * (flight_duration ** 2))) / flight_duration if flight_duration > 0 else 0.0
        cur_y = y0 + (vy0 * elapsed_time) - (0.5 * g * (elapsed_time ** 2))
        return cur_x, max(0.0, cur_y), cur_z

    x0, y0, z0 = qb_pos if isinstance(qb_pos, (tuple, list)) else get_pos(qb_pos)
    x1, y1, z1 = target_pos if isinstance(target_pos, (tuple, list)) else get_pos(target_pos)

    dx = x1 - x0
    dz = z1 - z0
    dist = math.hypot(dx, dz)

    if dist < 0.1:
        return 0.0, 0.0, 0.0, 0.1

    flight_time = dist / pass_speed if pass_speed > 0 else 1.0
    vx = dx / flight_time
    vz = dz / flight_time
    target_y = y1 if y1 > 0 else 1.8  # Catch height
    vy0 = (target_y - y0 + 0.5 * g * (flight_time ** 2)) / flight_time

    return vx, vy0, vz, flight_time


class PassTrajectory:
    """
    Calculates and tracks the 3D kinematic arc of a football in flight.
    Coordinates: (X, Z) = ground plane, Y = height.
    """

    def __init__(
        self,
        start_x, start_z,
        target_x, target_z,
        horizontal_speed,
        start_y=2.0,
        target_y=2.0,
        g=GRAVITY,
    ):
        self.start_x = start_x
        self.start_z = start_z
        self.target_x = target_x
        self.target_z = target_z
        self.start_y = start_y
        self.target_y = target_y
        self.g = g
        self.horizontal_speed = horizontal_speed

        self.ground_dist = math.hypot(target_x - start_x, target_z - start_z)
        self.total_time = (
            self.ground_dist / self.horizontal_speed if self.horizontal_speed > 0 else 0.1
        )
        # Initial vertical velocity to hit target_y exactly at total_time
        self.vy_initial = (
            (self.target_y - self.start_y + 0.5 * self.g * (self.total_time ** 2))
            / self.total_time
        )
        self.current_time = 0.0
        self.active = True

    def get_position_at_tick(self, delta_time: float):
        """Advance the clock and return the 3D coordinate tuple (x, y, z)."""
        if not self.active:
            return self.target_x, self.target_y, self.target_z

        self.current_time += delta_time

        if self.current_time >= self.total_time:
            self.active = False
            return self.target_x, self.target_y, self.target_z

        progress = self.current_time / self.total_time
        current_x = self.start_x + (self.target_x - self.start_x) * progress
        current_z = self.start_z + (self.target_z - self.start_z) * progress

        # Kinematic parabola
        current_y = (
            self.start_y
            + (self.vy_initial * self.current_time)
            - (0.5 * self.g * (self.current_time ** 2))
        )

        return current_x, max(0.1, current_y), current_z


# ---------------------------------------------------------------------------
# Steering Physics (Reynolds / Kinematic Arrive + Plant-and-Cut + Soft Sep)
# ---------------------------------------------------------------------------

def apply_soft_separation(player, all_players, personal_space: float = 0.8):
    """
    Returns a repulsion impulse (vx, vz) that pushes *player* away from any
    neighbour inside its personal-space bubble.  Works with both dict players
    (keyed by 'id', 'x', 'z') and class instances.
    """
    sep_vx = 0.0
    sep_vz = 0.0

    p_id = get_prop(player, "id", None)
    px, _, pz = get_pos(player)

    for other in all_players:
        if get_prop(other, "id", None) == p_id:
            continue

        ox, _, oz = get_pos(other)
        dx = px - ox
        dz = pz - oz
        dist = math.hypot(dx, dz)

        if 0.0 < dist < personal_space:
            # Stronger push the closer they are
            push_strength = (personal_space - dist) / personal_space
            sep_vx += (dx / dist) * push_strength * 10.0
            sep_vz += (dz / dist) * push_strength * 10.0

    return sep_vx, sep_vz


def calculate_steering_force(
    player,
    target_x: float,
    target_z: float,
    max_speed: float,
    max_force: float,
    arrive_radius: float = 2.0,
):
    """
    Reynolds Steering with Arrive and a dynamic 'Plant-and-Cut' modifier.

    Returns (force_x, force_z) impulse to apply this tick.
    Works with both dict players and class instances via get_prop / get_pos.
    """
    px, _, pz = get_pos(player)
    vx = get_prop(player, "vx", 0.0)
    vz = get_prop(player, "vz", 0.0)

    dx = target_x - px
    dz = target_z - pz
    distance = math.hypot(dx, dz)

    # Hard-brake when essentially on target
    if distance < 0.05:
        return -vx * 10.0, -vz * 10.0

    # --- Arrive: smoothly scale desired speed down inside the arrive radius ---
    desired_speed = max_speed
    if arrive_radius > 0 and distance < arrive_radius:
        desired_speed = max_speed * (distance / arrive_radius)

    desired_vx = (dx / distance) * desired_speed
    desired_vz = (dz / distance) * desired_speed

    # --- Plant-and-Cut modifier ---
    current_speed = math.hypot(vx, vz)
    if current_speed > 1.0:
        current_heading = math.atan2(vz, vx)
        desired_heading = math.atan2(desired_vz, desired_vx)
        angle_diff = abs(
            math.atan2(
                math.sin(desired_heading - current_heading),
                math.cos(desired_heading - current_heading),
            )
        )
        # > ~45° cut → triple the turn force (cleats-in-the-turf)
        if angle_diff > 0.785:
            max_force *= 3.0

    # --- Reynolds steering: Force = Desired − Current ---
    steer_fx = desired_vx - vx
    steer_fz = desired_vz - vz

    # Clamp to max_force
    steer_mag = math.hypot(steer_fx, steer_fz)
    if steer_mag > max_force:
        steer_fx = (steer_fx / steer_mag) * max_force
        steer_fz = (steer_fz / steer_mag) * max_force

    return steer_fx, steer_fz


def update_player_physics(
    player,
    target_x: float,
    target_z: float,
    all_players: list,
    dt: float = 1 / 60,
):
    """
    Single-frame physics tick for one player using Reynolds steering.
    Replaces the simple route-step for states in _STEERABLE_STATES.

    Compatible with both dict players and class instances.
    Attributes consulted:
        speed_attr / speed_rating  (0-100) → max lateral speed
        agility / agility_rating   (0-100) → steering force
        vx, vz                     → velocity (initialised to 0 if absent)
        x, y, z / position         → position (via get_pos / set_pos)
        facing                     → yaw angle updated from trajectory
    """
    speed_rating = get_prop(player, "speed_attr",
                   get_prop(player, "speed_rating", 85))
    agility_rating = get_prop(player, "agility",
                    get_prop(player, "agility_rating", 80))

    max_speed = speed_rating * 0.1   # 85 speed → 8.5 yds/s
    max_force = agility_rating * 0.2  # 80 agility → 16.0 steering force

    # Initialise velocity if this player has never been steered before
    if get_prop(player, "vx", None) is None:
        set_prop(player, "vx", 0.0)
    if get_prop(player, "vz", None) is None:
        set_prop(player, "vz", 0.0)

    # 1. Primary steering force (Seek + Arrive + Cut)
    fx, fz = calculate_steering_force(
        player, target_x, target_z,
        max_speed=max_speed,
        max_force=max_force,
        arrive_radius=2.5,
    )

    # 2. Soft-separation repulsion from nearby players
    sep_fx, sep_fz = apply_soft_separation(player, all_players, personal_space=0.8)

    # 3. Integrate: V += F * dt
    vx = get_prop(player, "vx", 0.0) + (fx + sep_fx) * dt
    vz = get_prop(player, "vz", 0.0) + (fz + sep_fz) * dt

    # Hard speed clamp (separation shouldn't burst through max_speed)
    current_speed = math.hypot(vx, vz)
    if current_speed > max_speed:
        vx = (vx / current_speed) * max_speed
        vz = (vz / current_speed) * max_speed

    set_prop(player, "vx", vx)
    set_prop(player, "vz", vz)

    # 4. Integrate: P += V * dt
    px, py, pz = get_pos(player)
    set_pos(player, x=px + vx * dt, y=py, z=pz + vz * dt)

    # 5. Update facing angle from actual trajectory
    if current_speed > 0.1:
        set_prop(player, "facing", math.atan2(vz, vx))


# ---------------------------------------------------------------------------
# Legacy route-following (used when steering physics are not applicable)
# ---------------------------------------------------------------------------

def update_player_along_route(player):
    """
    Simple waypoint following; used for states not handled by Reynolds steering,
    or as a fallback when no all_players list is available.
    """
    waypoints = get_prop(player, "route_waypoints", get_prop(player, "route", []))
    if not waypoints:
        return

    target = waypoints[0]
    tx = target.get("x", 0.0) if isinstance(target, dict) else getattr(target, "x", 0.0)
    tz = (
        target.get("z", target.get("y", 26.65))
        if isinstance(target, dict)
        else getattr(target, "z", getattr(target, "y", 26.65))
    )

    px, py, pz = get_pos(player)
    dx, dz = tx - px, tz - pz
    dist = math.hypot(dx, dz)

    if dist < 0.4:
        if len(waypoints) > 1:
            waypoints.pop(0)
    else:
        speed_rating = get_prop(player, "speed_attr", 75)
        speed = calculate_step_velocity(speed_rating)
        step_vx = (dx / dist) * speed
        step_vz = (dz / dist) * speed
        set_prop(player, "vx", step_vx)
        set_prop(player, "vz", step_vz)
        set_pos(player, x=px + step_vx, y=py, z=pz + step_vz)


# ---------------------------------------------------------------------------
# Collision resolution
# ---------------------------------------------------------------------------

def resolve_collisions(players, collision_radius: float = 0.8):
    """Two-pass fast collision & pushback resolution."""
    radius_sq = collision_radius * collision_radius
    num_players = len(players)

    for i in range(num_players):
        p1 = players[i]
        x1, y1, z1 = get_pos(p1)

        for j in range(i + 1, num_players):
            p2 = players[j]
            x2, y2, z2 = get_pos(p2)

            dx = x2 - x1
            dz = z2 - z1
            dist_sq = dx * dx + dz * dz

            if 0.0001 < dist_sq < radius_sq:
                dist = math.sqrt(dist_sq)
                overlap = (collision_radius - dist) * 0.5
                nx, nz = dx / dist, dz / dist

                set_pos(p1, x=x1 - nx * overlap, y=y1, z=z1 - nz * overlap)
                set_pos(p2, x=x2 + nx * overlap, y=y2, z=z2 + nz * overlap)


# ---------------------------------------------------------------------------
# Pursuit & interception helpers
# ---------------------------------------------------------------------------

def get_pursuit_vector(current_x, current_z, target_x, target_z, speed):
    """Returns the absolute 2D step delta toward a variable target point."""
    dx = target_x - current_x
    dz = target_z - current_z
    distance = math.hypot(dx, dz)

    if distance < speed:
        return dx, dz, True

    move_x = (dx / distance) * speed
    move_z = (dz / distance) * speed
    return move_x, move_z, False


def check_tackle_radius(defender_pos, carrier_pos, tackle_radius: float = 1.2) -> bool:
    """Returns True if the defender is within physical reach for a tackle attempt."""
    dist = math.hypot(
        carrier_pos[0] - defender_pos[0],
        carrier_pos[1] - defender_pos[1],
    )
    return dist <= tackle_radius


def resolve_tackle_attempt(defender, ball_carrier) -> str:
    """
    Calculates tackle success based on player attributes and momentum vectors.
    Returns 'TACKLED' or 'BROKEN_TACKLE'.
    """
    tackle_skill = getattr(
        defender, "tackle_attribute",
        get_prop(defender, "tackle_attribute", 75),
    )
    break_tackle_skill = getattr(
        ball_carrier, "break_tackle_attribute",
        get_prop(ball_carrier, "break_tackle_attribute", 70),
    )

    dx_def = getattr(defender, "vx", get_prop(defender, "vx", 0.0))
    dx_car = getattr(ball_carrier, "vx", get_prop(ball_carrier, "vx", 0.0))
    # Head-on collision boosts tackle; same-direction reduces it
    angle_modifier = 0.10 if (dx_def * dx_car < 0) else -0.15

    base_success_rate = 0.50 + ((tackle_skill - break_tackle_skill) * 0.01) + angle_modifier
    clamped_rate = max(0.10, min(0.90, base_success_rate))

    return "TACKLED" if random.random() < clamped_rate else "BROKEN_TACKLE"


def calculate_interception_path(defender_pos, ball_start, ball_target, ball_speed, defender_speed):
    """
    Determines if a defender can reach the pass landing spot in time,
    and returns the step vector towards the optimal interception point.
    Returns: (move_x, move_z, at_target, can_intercept)
    """
    def_x, def_z = defender_pos
    b_start_x, b_start_z = ball_start
    b_target_x, b_target_z = ball_target

    ball_dist = math.hypot(b_target_x - b_start_x, b_target_z - b_start_z)
    flight_ticks = ball_dist / max(ball_speed, 0.1)

    def_dist = math.hypot(b_target_x - def_x, b_target_z - def_z)
    ticks_needed = def_dist / max(defender_speed, 0.1)

    can_intercept = ticks_needed <= flight_ticks

    dx = b_target_x - def_x
    dz = b_target_z - def_z
    dist = math.hypot(dx, dz)

    if dist < defender_speed:
        return dx, dz, True, can_intercept

    move_x = (dx / dist) * defender_speed
    move_z = (dz / dist) * defender_speed
    return move_x, move_z, False, can_intercept


# ---------------------------------------------------------------------------
# Catch resolution
# ---------------------------------------------------------------------------

def resolve_catch_attempt(receiver, defenders, ball_target_x, ball_target_z, pass_accuracy=1.0) -> str:
    """
    Evaluates the physics radius at the pass landing spot to determine the outcome.
    Returns: 'CAUGHT', 'DROPPED', 'DEFLECTED', 'INTERCEPTED', or 'INCOMPLETE'.
    Supports both dict and class-instance player representations.
    """
    rec_x = get_prop(receiver, "x", getattr(receiver, "x", 0.0))
    rec_z = get_prop(receiver, "z", getattr(receiver, "z", 0.0))

    rec_dist = math.hypot(rec_x - ball_target_x, rec_z - ball_target_z)
    if rec_dist > 2.0:
        return "INCOMPLETE"  # Ball overthrown or receiver ran wrong route

    catch_skill = get_prop(
        receiver, "catch_skill",
        getattr(receiver, "catch_skill",
        get_prop(receiver, "overall_attr", 75)),
    )

    base_catch_chance = (catch_skill * 0.01) * pass_accuracy

    # Scan for contesting defenders within 1.8 yds
    contesting_defenders = []
    for defender in defenders:
        def_x = get_prop(defender, "x", getattr(defender, "x", 0.0))
        def_z = get_prop(defender, "z", getattr(defender, "z", 0.0))
        if math.hypot(def_x - rec_x, def_z - rec_z) <= 1.8:
            contesting_defenders.append(defender)

    if not contesting_defenders:
        return "CAUGHT" if random.random() < base_catch_chance else "DROPPED"

    # Contested catch: find best defending skill
    best_defender = max(
        contesting_defenders,
        key=lambda d: get_prop(
            d, "coverage_skill",
            getattr(d, "coverage_skill",
            get_prop(d, "overall_attr", 70)),
        ),
    )
    def_skill = get_prop(
        best_defender, "coverage_skill",
        getattr(best_defender, "coverage_skill",
        get_prop(best_defender, "overall_attr", 70)),
    )

    skill_delta = catch_skill - def_skill
    catch_chance = max(0.05, min(0.95, 0.40 + (skill_delta * 0.01)))
    int_chance = max(0.01, 0.12 - (skill_delta * 0.005))

    roll = random.random()
    if roll < int_chance:
        return "INTERCEPTED"
    elif roll < (int_chance + catch_chance):
        return "CAUGHT"
    return "DEFLECTED"


# ---------------------------------------------------------------------------
# Main step_physics loop  (60 Hz tick)
# ---------------------------------------------------------------------------

def step_physics(players, ball=None, dt: float = 0.01667, g: float = GRAVITY):
    """
    Master per-frame physics update.

    For players in steerable states that have a 'route_waypoints' target:
        → Reynolds steering (update_player_physics) is used.
    For ball carriers without waypoints:
        → Steers downfield toward opponent end zone (+X).
    For all active moving states:
        → Velocity integration is applied.

    Ball in-flight kinematics are always applied.
    """
    for p in players:
        state = get_prop(p, "state", "IDLE")

        if state in _STEERABLE_STATES:
            waypoints = get_prop(p, "route_waypoints", get_prop(p, "route", []))
            if waypoints:
                target = waypoints[0]
                tx = (
                    target.get("x", 0.0)
                    if isinstance(target, dict)
                    else getattr(target, "x", 0.0)
                )
                tz = (
                    target.get("z", target.get("y", 26.65))
                    if isinstance(target, dict)
                    else getattr(target, "z", getattr(target, "y", 26.65))
                )

                # Advance to next waypoint if within snap radius
                px, _, pz = get_pos(p)
                if math.hypot(tx - px, tz - pz) < 0.4 and len(waypoints) > 1:
                    waypoints.pop(0)
                    target = waypoints[0]
                    tx = (
                        target.get("x", 0.0)
                        if isinstance(target, dict)
                        else getattr(target, "x", 0.0)
                    )
                    tz = (
                        target.get("z", target.get("y", 26.65))
                        if isinstance(target, dict)
                        else getattr(target, "z", getattr(target, "y", 26.65))
                    )

                update_player_physics(p, tx, tz, all_players=players, dt=dt)
                continue
            elif state == "BALL_CARRIER":
                # Ball carrier without route waypoints runs straight downfield (+X toward opponent end zone)
                px, py, pz = get_pos(p)
                tx = px + 10.0
                tz = pz
                update_player_physics(p, tx, tz, all_players=players, dt=dt)
                continue
            elif state in ("DROPBACK", "POCKET", "SCRAMBLE_OUT"):
                # QB in pocket/dropback without waypoints
                px, py, pz = get_pos(p)
                tx = px - 0.5
                tz = pz
                update_player_physics(p, tx, tz, all_players=players, dt=dt)
                continue

        # Fallback: integrate stored velocity directly for any moving state
        if state not in ("IDLE", "TACKLE_SUCCESS", "TACKLED", "INJURED", "PRE_SNAP"):
            vx = get_prop(p, "vx", 0.0)
            vz = get_prop(p, "vz", 0.0)
            px, py, pz = get_pos(p)
            if abs(vx) > 0.001 or abs(vz) > 0.001:
                set_pos(p, x=px + vx * dt, y=py, z=pz + vz * dt)

    # Synchronise ball position to carrier immediately after player movement
    if ball and get_prop(ball, "state") == "HELD":
        carrier_id = get_prop(ball, "carrier_id")
        carrier = None
        if carrier_id:
            carrier = next((p for p in players if get_prop(p, "id") == carrier_id), None)
        if not carrier:
            carrier = next((p for p in players if get_prop(p, "state") == "BALL_CARRIER"), None)
        if carrier:
            cx, cy, cz = get_pos(carrier)
            set_pos(ball, x=cx, y=cy + 1.0, z=cz)

    # Ball in-flight kinematics
    if ball and get_prop(ball, "in_flight", False):
        bx, by, bz = get_pos(ball)
        bvx = get_prop(ball, "vx", 0.0)
        bvy = get_prop(ball, "vy", 0.0)
        bvz = get_prop(ball, "vz", 0.0)

        bvy_next = bvy - g * dt
        set_prop(ball, "vy", bvy_next)

        next_y = by + bvy_next * dt
        if next_y <= 0.0:
            set_pos(ball, x=bx + bvx * dt, y=0.0, z=bz + bvz * dt)
            set_prop(ball, "in_flight", False)
            set_prop(ball, "is_grounded", True)
        else:
            set_pos(ball, x=bx + bvx * dt, y=next_y, z=bz + bvz * dt)

    resolve_collisions(players)
