import { Vector2 } from '../physics/Vector2.js';
import { PhysicsEntity } from '../physics/PhysicsEntity.js';
import { PhysicsEngine } from '../physics/PhysicsEngine.js';

// --- SIMULATION EVENT EMITTER --- //
export class SimulationEventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }
}

// --- MAIN PLAY SIMULATION ENGINE --- //
export class PlaySimulation extends SimulationEventEmitter {
  constructor(offPlay, defPlay, offTeam, defTeam, startYardLine, coaches = {}, weather = "clear") {
    super();
    this.offPlay = offPlay || {}; // Active play object from plays.js
    this.defPlay = defPlay || {};
    this.play = this.offPlay; // Alias
    this.offTeam = offTeam;
    this.defTeam = defTeam;
    this.weather = weather;
    
    this.isPlayActive = true;
    this.timeElapsed = 0;
    this.time = 0;
    
    // Legacy compatibility for match.js/main.js
    this.playFinished = false;
    this.resultType = "tackle";
    this.finalYards = 0;
    this.history = [];
    this.penalty = null;
    this.preSnap = true; // Added for main.js checks

    // --- FIX FOR CANVAS FREEZE --- //
    // Legacy arrays required by main.js/canvas.js during render loops
    this.referees = [];
    this.activeBlocks = [];

    // Line of Scrimmage & Ball Setup
    this.los = startYardLine || 20; // Yards
    this.lineOfScrimmage = this.los;
    
    // --- PHYSICS ENGINE INITIALIZATION --- //
    this.physics = new PhysicsEngine();
    
    // Pitch Boundaries (0 to 120 yards long, 0 to 53.3 yards wide)
    this.physics.addStaticBox({ minX: -10, minY: -5, maxX: 130, maxY: 0 }); // Top sideline
    this.physics.addStaticBox({ minX: -10, minY: 53.3, maxX: 130, maxY: 58.3 }); // Bottom sideline
    this.physics.addStaticBox({ minX: -5, minY: 0, maxX: 0, maxY: 53.3 }); // Left endzone
    this.physics.addStaticBox({ minX: 120, minY: 0, maxX: 125, maxY: 53.3 }); // Right endzone

    // Ball as Physics Entity
    this.ball = new PhysicsEntity(this.lineOfScrimmage, 26.5, 0.4);
    this.ball.mass = 0.5;
    this.ball.friction = 0.5;
    this.ball.restitution = 0.6;
    // Z-axis decoration
    this.ball.z = 1.0;
    this.ball.vz = 0;
    this.ball.isAirborne = false;
    this.ball.state = "snapped";
    this.ball.carrier = null;
    this.physics.registerEntity(this.ball, true);

    // Initialize Officials for rendering
    this.initializeReferees();

    // Instantiate Roster Positions & Physics States
    this.players = this.initializePlayers(this.offPlay);
    this.assignInitialBallCarrier();
  }

  // --- REFEREE INITIALIZATION (Prevents Canvas Render Crash) --- //
  initializeReferees() {
    this.referees = [
      { type: 'R', x: this.lineOfScrimmage - 7, y: 15, facingAngle: 0 },
      { type: 'U', x: this.lineOfScrimmage - 5, y: 35, facingAngle: 0 },
      { type: 'HL', x: this.lineOfScrimmage, y: 2, facingAngle: Math.PI / 2 },
      { type: 'LJ', x: this.lineOfScrimmage, y: 51, facingAngle: -Math.PI / 2 }
    ];
  }

  // --- INITIALIZATION --- //
  initializePlayers(play) {
    const players = [];
    
    // FIELD CONSTANTS
    const CENTER_Y = 26.65;
    const LOS_X = this.lineOfScrimmage; // Line of Scrimmage

    // OFFENSE FORMATION (X moves left behind LOS, Y moves across field)
    const offensePositions = [
        { type: "C",   x: LOS_X - 0.5, y: CENTER_Y },
        { type: "LG",  x: LOS_X - 0.5, y: CENTER_Y - 2.5 },
        { type: "RG",  x: LOS_X - 0.5, y: CENTER_Y + 2.5 },
        { type: "LT",  x: LOS_X - 0.5, y: CENTER_Y - 5.0 },
        { type: "RT",  x: LOS_X - 0.5, y: CENTER_Y + 5.0 },
        { type: "TE",  x: LOS_X - 0.5, y: CENTER_Y + 8.0 },
        { type: "QB",  x: LOS_X - 4.0, y: CENTER_Y },
        { type: "RB",  x: LOS_X - 7.0, y: CENTER_Y },
        { type: "WR1", x: LOS_X - 1.0, y: 6.0 },
        { type: "WR2", x: LOS_X - 1.0, y: 47.0 },
        { type: "WR3", x: LOS_X - 2.0, y: CENTER_Y - 12.0 }
    ];

    offensePositions.forEach((pos) => {
        const player = new PhysicsEntity(pos.x, pos.y, 0.8);
        
        player.id = `OFF_${pos.type}`;
        player.type = pos.type;
        player.team = 'offense';
        player.facingAngle = 0;
        player.maxSpeed = pos.type.includes('WR') ? 9.5 : pos.type.includes('RB') ? 8.8 : 7.0;
        
        const isLineman = pos.type === 'C' || pos.type === 'LG' || pos.type === 'RG' || pos.type === 'LT' || pos.type === 'RT';
        player.mass = isLineman || pos.type === 'TE' ? 1.5 : 1.0;
        player.friction = 3.0;
        player.restitution = 0.1;
        player.assignment = isLineman ? 'PASS_BLOCK' : (pos.type === 'RB' && play && play.type === 'PASS' ? 'PASS_BLOCK' : 'ROUTE');
        player.number = Math.floor(Math.random() * 90 + 10);
        
        players.push(player);
        this.physics.registerEntity(player, false);
    });

    // DEFENSE FORMATION (X moves right past LOS, Y moves across field)
    const defensePositions = [
        { type: "DT1", x: LOS_X + 1.0, y: CENTER_Y - 2.0 },
        { type: "DT2", x: LOS_X + 1.0, y: CENTER_Y + 2.0 },
        { type: "DE1", x: LOS_X + 1.0, y: CENTER_Y - 6.0 },
        { type: "DE2", x: LOS_X + 1.0, y: CENTER_Y + 6.0 },
        { type: "MLB", x: LOS_X + 4.0, y: CENTER_Y },
        { type: "OLB1",x: LOS_X + 4.0, y: CENTER_Y - 7.0 },
        { type: "OLB2",x: LOS_X + 4.0, y: CENTER_Y + 7.0 },
        { type: "CB1", x: LOS_X + 3.0, y: 6.0 },
        { type: "CB2", x: LOS_X + 3.0, y: 47.0 },
        { type: "FS",  x: LOS_X + 12.0,y: CENTER_Y - 6.0 },
        { type: "SS",  x: LOS_X + 10.0,y: CENTER_Y + 6.0 }
    ];

    defensePositions.forEach((pos) => {
        const player = new PhysicsEntity(pos.x, pos.y, 0.8);
        
        player.id = `DEF_${pos.type}`;
        player.type = pos.type;
        player.team = 'defense';
        player.facingAngle = Math.PI; // Facing toward offense
        player.maxSpeed = pos.type.includes('CB') || pos.type.includes('S') ? 9.2 : 7.8;
        player.mass = pos.type.includes('DT') || pos.type.includes('DE') ? 1.5 : 1.0;
        player.friction = 3.0;
        player.restitution = 0.1;
        player.assignment = 'RUSH_OR_COVER';
        player.number = Math.floor(Math.random() * 90 + 10);
        
        players.push(player);
        this.physics.registerEntity(player, false);
    });

    return players;
  }

  assignInitialBallCarrier() {
    const qb = this.players.find(p => p.type === 'QB');
    if (qb) {
      this.ball.carrier = qb;
      this.ball.position.x = qb.position.x;
      this.ball.position.y = qb.position.y;
    }
  }

  step(dtMs = 16) {
    const dt = typeof dtMs === 'number' && dtMs > 1 ? dtMs / 1000 : (dtMs || 0.016);
    this.update(dt);
  }

  startPlay(players, playChoice) {
    if (Array.isArray(players) && players.length > 0) {
      players.forEach(p => {
        const existing = this.players ? this.players.find(ep => ep.id === p.id || ep.type === (p.role || p.type)) : null;
        if (existing) {
          if (p.routeWaypoints) existing.routeWaypoints = p.routeWaypoints;
          if (p.x !== undefined) existing.position.x = p.x;
          if (p.y !== undefined) existing.position.y = p.y;
        }
      });
    }
    this.preSnap = false;
    this.isPlayActive = true;
    this.playFinished = false;
    this.time = 0;
  }

  // --- TICK & PHYSICS LOOP --- //
  update(dt) {
    if (this.playFinished || !this.isPlayActive) return;
    this.preSnap = false; // Turn off pre-snap state once update is called

    this.time += dt;
    this.timeElapsed += dt;

    // Save frame for replay/film compatibility
    if (Math.floor(this.time * 30) > this.history.length) {
        this.history.push({
            time: this.time,
            ball: { x: this.ball.position.x, y: this.ball.position.y, z: this.ball.z, state: this.ball.state },
            // Legacy mapping for canvas.js compatibility: canvas_new.js expects p.x, p.y
            players: this.players.map(p => ({ x: p.position.x, y: p.position.y, type: p.type, team: p.team, facingAngle: p.facingAngle, number: p.number }))
        });
    }

    // 1. Run Play Handoff Check
    this.updateHandoffLogic();

    // 2. Update Player AI & Positioning (Force Application)
    this.players.forEach(player => {
      if (player.team === 'offense') {
        this.updateOffensivePlayer(player, dt);
      } else {
        this.updateDefensivePlayer(player, dt);
      }

      // Update Facing Direction Angle based on current velocity
      if (player.velocity.magSq() > 0.1) {
        player.facingAngle = Math.atan2(player.velocity.y, player.velocity.x);
      }
    });

    // 3. Physics Integration (Coordinator Handles dt via fixed ticks)
    this.physics.tick(dt);

    // 4. 3D Ball Physics & Z-Height
    this.updateBallPhysics(dt);

    // 5. Collision & Tackle Checks
    this.checkTacklesAndCollisions();
    
    // Auto end play if it drags on too long
    if (this.time > 15) {
        this.endPlay("tackle", this.ball.position.x);
    }
  }

  // --- RUN PLAY HANDOFF LOGIC --- //
  updateHandoffLogic() {
    const playType = (this.play && this.play.type) || (this.offPlay && this.offPlay.type);
    
    if (playType === 'RUN' || playType === 'run') {
      const qb = this.players.find(p => p.type === 'QB');
      const rb = this.players.find(p => p.type === 'RB');

      if (qb && rb && this.ball.carrier === qb) {
        const dx = qb.position.x - rb.position.x;
        const dy = qb.position.y - rb.position.y;
        const distToRB = Math.hypot(dx, dy);
        
        // Transfer ball when RB reaches QB mesh point
        if (distToRB < 1.2) {
          this.ball.carrier = rb;
          this.emit('HANDOFF_COMPLETE', { qb, rb });
        }
      }
    }
  }

  // --- 3D BALL TRAJECTORY MATH --- //
  throwPass(targetX, targetY, passType = 'BULLET') {
    if (!this.ball.carrier) return;

    const qb = this.ball.carrier;
    this.ball.carrier = null;
    this.ball.isAirborne = true;
    this.ball.state = "air";
    this.ball.z = 2.0; // Release height (meters)

    const dx = targetX - qb.position.x;
    const dy = targetY - qb.position.y;
    const distance = Math.hypot(dx, dy);

    // Speed & Flight Time Calculations
    const flightSpeed = passType === 'BULLET' ? 24.0 : 16.0; // Yards per sec
    const flightTime = distance / flightSpeed;

    this.ball.velocity.x = dx / flightTime;
    this.ball.velocity.y = dy / flightTime;

    // Vertical Velocity (vz) with Gravity: g = 9.81 m/s^2
    const g = 9.81;
    const peakHeight = passType === 'BULLET' ? 3.2 : 6.0; // Max height meters
    this.ball.vz = (peakHeight / (flightTime / 2)) + (0.5 * g * flightTime);

    this.emit('PASS_THROWN', { qb, targetX, targetY, passType });
  }

  updateBallPhysics(dt) {
    if (this.ball.carrier) {
      // Ball stays anchored to ball carrier
      this.ball.position.x = this.ball.carrier.position.x;
      this.ball.position.y = this.ball.carrier.position.y;
      this.ball.z = 1.2;
      this.ball.velocity.set(0, 0); // Stops drifting
      
      // QB throws after 3 seconds if pass play
      if (this.offPlay && (this.offPlay.type === "pass" || this.offPlay.type === "PASS") && this.time > 3.0 && this.ball.carrier.type === 'QB') {
          // Find a WR to throw to
          const wr = this.players.find(p => p.type === 'WR');
          if (wr) this.throwPass(wr.position.x, wr.position.y, 'BULLET');
      }
      return;
    }

    if (this.ball.isAirborne) {
      // (XY Movement is handled by physics engine via tick, but we handle Z here)

      // 3D Z-Axis Gravity Calculation
      const g = 9.81;
      this.ball.vz -= g * dt;
      this.ball.z += this.ball.vz * dt;

      // Check Pass Deflections / Trajectory Tipping
      this.checkPassDeflections();

      // Ball Incomplete or Ground Contact
      if (this.ball.z <= 0) {
        this.ball.z = 0;
        this.ball.isAirborne = false;
        this.ball.state = "incomplete";
        this.isPlayActive = false;
        this.endPlay("incomplete", this.ball.position.x);
        this.emit('PASS_INCOMPLETE', { x: this.ball.position.x, y: this.ball.position.y });
      }
    }
  }

  checkPassDeflections() {
    if (!this.ball.isAirborne) return;

    const maxReachHeight = 2.3; // Defenders can only reach up to 2.3 meters (~7.5 feet)

    this.players.forEach(player => {
      const distToBall = player.position.distanceTo(this.ball.position);

      // If defender is within 1.2 yards AND ball is below their reach height
      if (distToBall < 1.2 && this.ball.z <= maxReachHeight) {
        if (player.team === 'defense') {
          this.ball.isAirborne = false;
          this.ball.state = "incomplete";
          this.isPlayActive = false;
          this.endPlay("interception", this.ball.position.x);
          this.emit('PASS_DEFLECTED', { defender: player, zHeight: this.ball.z });
        } else if (player.team === 'offense' && player.type !== 'QB') {
          // Catch completed
          this.ball.isAirborne = false;
          this.ball.state = "carried";
          this.ball.carrier = player;
          this.emit('PASS_COMPLETE', { receiver: player });
        }
      }
    });
  }

  // --- PLAYER AI & MOVEMENT MECHANICS --- //
  updateOffensivePlayer(p, dt) {
    const playType = (this.play && this.play.type) || (this.offPlay && this.offPlay.type);
    const accelForce = 80;

    // 1. QB Pocket Dropback / Handoff Mesh Step
    if (p.type === 'QB') {
      if (playType === 'PASS' || playType === 'pass') {
        const pocketTargetX = this.lineOfScrimmage - 5;
        if (p.position.x > pocketTargetX && this.ball.carrier === p) {
          p.applyForce(new Vector2(-accelForce, 0)); // Smooth 5-yard dropback
        }
      } else if (playType === 'RUN' || playType === 'run') {
        p.applyForce(new Vector2(-accelForce * 0.3, 0)); // Slow backstep to receive snap & present handoff
      }
      return;
    }

    // 2. Running Back Execution
    if (p.type === 'RB') {
      if (playType === 'RUN' || playType === 'run') {
        const qb = this.players.find(pl => pl.type === 'QB');
        if (this.ball.carrier === qb) {
          // Move toward QB to take handoff
          const dx = qb.position.x - p.position.x;
          const dy = qb.position.y - p.position.y;
          const toQB = new Vector2(dx, dy);
          if (toQB.magSq() > 0.1) {
            toQB.normalize().multiplyScalar(accelForce * 0.8);
            p.applyForce(toQB);
          }
        } else {
          // Break upfield once carrying the ball
          p.applyForce(new Vector2(accelForce, 0));
        }
      } else if (p.assignment === 'PASS_BLOCK') {
        // Pass Protection Interception Lane
        const qb = this.players.find(pl => pl.type === 'QB');
        const nearestRusher = this.players
          .filter(pl => pl.team === 'defense' && pl.position.x < this.lineOfScrimmage + 3)
          .sort((a, b) => p.position.distanceToSq(a.position) - p.position.distanceToSq(b.position))[0];

        if (nearestRusher && qb) {
          const blockTargetX = (qb.position.x + nearestRusher.position.x) / 2;
          const blockTargetY = (qb.position.y + nearestRusher.position.y) / 2;

          const toBlock = new Vector2(blockTargetX - p.position.x, blockTargetY - p.position.y);
          if(toBlock.magSq() > 0.1) {
              toBlock.normalize().multiplyScalar(accelForce * 0.6);
              p.applyForce(toBlock);
          }
        }
      }
      return;
    }

    // 3. Receivers Running Routes
    if (p.assignment === 'ROUTE' || p.type === 'WR') {
      p.applyForce(new Vector2(accelForce, 0)); // Push vertically upfield
    }
  }

  updateDefensivePlayer(p, dt) {
    const accelForce = 85;

    if (this.ball.carrier) {
      const target = this.ball.carrier;
      const dx = target.position.x - p.position.x;
      const dy = target.position.y - p.position.y;
      const toCarrier = new Vector2(dx, dy);
      
      if (toCarrier.magSq() > 0.1) {
        toCarrier.normalize().multiplyScalar(accelForce);
        p.applyForce(toCarrier);
      }
    } else if (this.ball.isAirborne) {
      const dx = this.ball.position.x - p.position.x;
      const dy = this.ball.position.y - p.position.y;
      const toBall = new Vector2(dx, dy);
      
      if (toBall.magSq() > 0.1) {
        toBall.normalize().multiplyScalar(accelForce);
        p.applyForce(toBall);
      }
    }
  }

  // --- COLLISION & TACKLING --- //
  checkTacklesAndCollisions() {
    if (!this.ball.carrier) return;

    const carrier = this.ball.carrier;

    this.players.forEach(p => {
      if (p.team === 'defense') {
        const dist = p.position.distanceTo(carrier.position);
        
        // Tackle contact threshold (1.2 yard radius due to physics circle size)
        if (dist < 1.2) {
          this.isPlayActive = false;
          this.endPlay("tackle", carrier.position.x);
          this.emit('TACKLE', {
            tackler: p,
            ballCarrier: carrier,
            yardLine: carrier.position.x
          });
        }
      }
    });
  }
  
  // Custom helper for match.js state extraction
  endPlay(resultType, finalX) {
      if (this.playFinished) return;
      this.playFinished = true;
      this.resultType = resultType;
      this.finalYards = finalX - this.lineOfScrimmage;
      
      // Randomly inject a penalty every ~20 plays to keep it interesting for testing
      if (Math.random() < 0.05) {
          const isOffensePenalty = Math.random() < 0.5;
          this.penalty = {
              team: isOffensePenalty ? "OFFENSE" : "DEFENSE",
              name: isOffensePenalty ? "Offensive Holding" : "Defensive Holding",
              desc: isOffensePenalty ? "Holding on the offense. 10-yard penalty." : "Holding on the defense. 5-yard penalty and an automatic first down.",
              yards: isOffensePenalty ? -10 : 5
          };
      }
  }
}
