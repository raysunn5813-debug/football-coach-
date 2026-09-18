import { Vector2 } from './Vector2.js';
import { Collisions } from './Collisions.js';

/**
 * Core Physics Coordinator
 * Handles fixed timesteps, entity registry, micro-stepping, and ball-control logic.
 */
export class PhysicsEngine {
    constructor() {
        this.entities = [];
        this.staticBoxes = []; // e.g., boundaries, goal nets
        this.ball = null;      // Special reference to the ball entity
        
        // Settings based on GAME_SPEC
        this.fixedTick = 0.03; // 30ms target
        this.accumulator = 0.0;
        this.maxSubsteps = 4;
        this.microStepSpeedThresholdSq = 400; // If velocity^2 > this, trigger micro-steps
    }

    registerEntity(entity, isBall = false) {
        this.entities.push(entity);
        if (isBall) {
            this.ball = entity;
        }
    }

    addStaticBox(boxBounds) {
        this.staticBoxes.push(boxBounds);
    }

    /**
     * Main loop entry point. Should be called by requestAnimationFrame.
     * @param {number} frameTime Elapsed time since last frame in seconds
     */
    tick(frameTime) {
        // Cap frameTime to avoid spiral of death (e.g. user tabs away)
        if (frameTime > 0.25) frameTime = 0.25;
        
        this.accumulator += frameTime;
        
        // Consume accumulator in fixed ticks
        while (this.accumulator >= this.fixedTick) {
            this.simulateFixedStep(this.fixedTick);
            this.accumulator -= this.fixedTick;
        }
    }

    /**
     * Internal simulation step. Checks threshold for micro-stepping.
     */
    simulateFixedStep(dt) {
        // Determine if micro-stepping is needed based on max velocity
        let needsMicroSteps = false;
        for (const ent of this.entities) {
            if (ent.velocity.magSq() > this.microStepSpeedThresholdSq) {
                needsMicroSteps = true;
                break;
            }
        }

        const substeps = needsMicroSteps ? this.maxSubsteps : 1;
        const subDt = dt / substeps;

        for (let i = 0; i < substeps; i++) {
            this.stepPhysics(subDt);
        }
    }

    stepPhysics(dt) {
        // 1. Update Kinematics (integrate forces into velocity and position)
        for (const ent of this.entities) {
            ent.updateKinematics(dt);
        }

        // 2. Resolve Static Collisions
        for (const ent of this.entities) {
            for (const box of this.staticBoxes) {
                Collisions.resolveCircleBox(ent, box);
            }
        }

        // 3. Resolve Dynamic Collisions (Circle-Circle)
        // Simple O(N^2) loop, fine for ~23 entities on the pitch
        for (let i = 0; i < this.entities.length; i++) {
            for (let j = i + 1; j < this.entities.length; j++) {
                Collisions.resolveCircleCircle(this.entities[i], this.entities[j]);
            }
        }
    }

    /**
     * Evaluates the Ball Control Cone
     * If the ball is inside a player's directional facing cone, pull it.
     */
    applyBallControlCone(playerEntity, facingVector, controlAttribute) {
        if (!this.ball) return;
        
        // Vector from player to ball
        const toBall = Vector2.sub(this.ball.position, playerEntity.position);
        const distToBallSq = toBall.magSq();
        
        // Assume control range of 30 units
        const controlRange = 30;
        
        if (distToBallSq > 0 && distToBallSq < controlRange * controlRange) {
            const toBallNormalized = toBall.clone().normalize();
            
            // Dot product evaluates alignment with facing direction
            // 0.707 ~ 45 degrees half-angle (90 degree cone)
            if (facingVector.dot(toBallNormalized) > 0.707) {
                // Apply a stabilization force pulling ball towards player
                const pullForceMagnitude = (controlAttribute / 99) * 200;
                const pullVector = Vector2.multiplyScalar(toBallNormalized, -pullForceMagnitude);
                this.ball.applyForce(pullVector);
            }
        }
    }
}
