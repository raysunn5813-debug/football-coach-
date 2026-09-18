"""
backend/engine/defensive_ai.py
State-driven defensive tracking, spatial vector physics, and trench warfare engagement.
"""
import math
import random

class Player:
    def __init__(self, role, base_rel_x, base_rel_z, strength=50, block_skill=50, shed_skill=50):
        self.name = role             
        self.role = role             
        self.base_rel_x = base_rel_x 
        self.base_rel_z = base_rel_z # Z is the lateral axis in our 3D field
        self.x = 0.0
        self.z = 0.0
        self.route = []              
        self.current_step = 0
        self.speed = 1.5
        
        # Trench Warfare Attributes
        self.strength = strength
        self.block_skill = block_skill
        self.shed_skill = shed_skill
        self.state = "LINE_UP"       # States: LINE_UP, SEARCHING, ENGAGED, SHED, PANCAKED
        self.engaged_with = None
        self.ticks_engaged = 0

    def line_up(self, line_of_scrimmage):
        """Locks entity to physical pre-snap formation coordinates."""
        self.x = float(line_of_scrimmage + self.base_rel_x)
        self.z = float(self.base_rel_z)
        self.route = []
        self.current_step = 0
        self.state = "SEARCHING"
        self.engaged_with = None
        self.ticks_engaged = 0


class DefensivePlayer(Player):
    def __init__(self, role, base_rel_x, base_rel_z, coverage_type='zone', strength=50, block_skill=50, shed_skill=50):
        super().__init__(role, base_rel_x, base_rel_z, strength, block_skill, shed_skill)
        self.coverage_type = coverage_type  
        self.man_target = None              
        self.zone_anchor = (0.0, 0.0)       
        self.zone_radius = 8.0              

    def set_zone_anchor(self, line_of_scrimmage, depth_x, lateral_z):
        """Sets absolute zone coordinates based on LOS and defensive call."""
        self.zone_anchor = (float(line_of_scrimmage + depth_x), float(lateral_z))

    def update_defensive_ai(self, offensive_players, ball_carrier=None, ball_in_air_pos=None):
        """
        Evaluates field conditions and sets the dynamic active waypoint target.
        """
        # If locked in a block or knocked down, bypass standard route logic
        if self.state in ["ENGAGED", "PANCAKED"]:
            return

        # Global Override: Chase the ball if thrown or crossed LOS
        if ball_in_air_pos:
            self.state = "PURSUING_BALL"
            self.route = [ball_in_air_pos]
            self.current_step = 0
            return

        if ball_carrier and ball_carrier.x > self.zone_anchor[0] - 2.0:
            self.state = "PURSUING_BALL"
            self.route = [(ball_carrier.x, ball_carrier.z)]
            self.current_step = 0
            return

        # State Execution: Man Coverage
        if self.coverage_type == 'man' and self.man_target:
            self.state = "COVERING_MAN"
            self.route = [(self.man_target.x, self.man_target.z)]
            self.current_step = 0

        # State Execution: Zone Coverage
        elif self.coverage_type == 'zone':
            nearest_threat = None
            closest_dist = float('inf')

            for off_player in offensive_players:
                dist_to_zone = math.hypot(off_player.x - self.zone_anchor[0], off_player.z - self.zone_anchor[1])
                if dist_to_zone <= self.zone_radius and dist_to_zone < closest_dist:
                    closest_dist = dist_to_zone
                    nearest_threat = off_player

            if nearest_threat:
                self.state = "MATCHING_ZONE"
                self.route = [(nearest_threat.x, nearest_threat.z)]
            else:
                self.state = "HOLDING_ZONE"
                self.route = [self.zone_anchor]

            self.current_step = 0


def move_toward_target(player):
    """
    Computes normalized vector movement towards the active route waypoint.
    """
    # Halt independent movement if engaged in a block or knocked down
    if player.state in ["ENGAGED", "PANCAKED"]:
        return

    if player.current_step >= len(player.route):
        return  

    target_x, target_z = player.route[player.current_step]
    dx = target_x - player.x
    dz = target_z - player.z
    distance = math.hypot(dx, dz)

    if distance <= player.speed:
        player.x = target_x
        player.z = target_z
        player.current_step += 1
    else:
        player.x += (dx / distance) * player.speed
        player.z += (dz / distance) * player.speed


def check_collisions_and_engage(offensive_linemen, defensive_linemen, engage_radius=1.2):
    """Detects proximity between unengaged OL and DL to trigger ENGAGED state."""
    for ol in offensive_linemen:
        if ol.state == "ENGAGED":
            continue
        for dl in defensive_linemen:
            if dl.state == "ENGAGED":
                continue
            
            # Using hypot to calculate absolute distance
            dist = math.hypot(ol.x - dl.x, ol.z - dl.z)
            if dist <= engage_radius:
                # Lock both players into dynamic interaction
                ol.state = "ENGAGED"
                dl.state = "ENGAGED"
                ol.engaged_with = dl
                dl.engaged_with = ol
                ol.ticks_engaged = 0
                dl.ticks_engaged = 0


def resolve_trench_contest(ol, dl):
    """
    Evaluates dynamic rolls between OL and DL on frame ticks.
    Returns the resolution state if a break occurs, otherwise updates positioning.
    """
    ol.ticks_engaged += 1
    dl.ticks_engaged += 1
    
    # Base Skill Delta
    skill_delta = dl.shed_skill - ol.block_skill
    strength_delta = dl.strength - ol.strength
    
    # Pocket Decay Factor: Defender gains shed chance over time
    time_decay = ol.ticks_engaged * 0.015 
    
    # Calculate Defender Shed Chance (clamped between 5% and 85%)
    raw_shed_chance = 0.20 + (skill_delta * 0.005) + (strength_delta * 0.003) + time_decay
    shed_chance = max(0.05, min(0.85, raw_shed_chance))
    
    # Calculate Blocker Pancake/Dominance Chance
    pancake_chance = max(0.01, 0.05 + (ol.strength - dl.strength) * 0.004 - time_decay)

    roll = random.random()
    
    if roll < shed_chance:
        # Defender wins the rep: Sheds block and pursues target
        ol.state = "SEARCHING"
        dl.state = "PURSUING_BALL"
        ol.engaged_with = None
        dl.engaged_with = None
        return f"{dl.name} SHED the block of {ol.name}!"

    elif roll > (1.0 - pancake_chance):
        # Blocker wins dominantly: Pancakes defender
        ol.state = "SEARCHING"
        dl.state = "PANCAKED"
        ol.engaged_with = None
        dl.engaged_with = None
        return f"{ol.name} PANCAKED {dl.name}!"

    else:
        # Stalemate / Pocket Displacement
        # DL pushes OL back based on strength advantage
        push_power = max(-0.1, min(0.3, (dl.strength - ol.strength) * 0.01))
        
        ol.x += push_power
        dl.x += push_power
        return "STALEMATE (Pocket Collapsing)"
