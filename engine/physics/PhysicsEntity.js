import { Vector2 } from './Vector2.js';

/**
 * Base dynamic object class for physics kinematics
 */
export class PhysicsEntity {
    constructor(x = 0, y = 0, radius = 1) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        
        // Z-axis parabolic height & vertical velocity
        this.z = 0;
        this.vz = 0;
        
        this.radius = radius;
        this.mass = 1;
        this.friction = 0.05; // Ground friction / dampening
        this.restitution = 0.5; // Bounciness (0 = dead, 1 = perfectly elastic)
        
        this.maxSpeed = 15;
    }

    /**
     * Apply a continuous or instantaneous force
     * F = ma => a = F/m
     */
    applyForce(force) {
        const a = Vector2.multiplyScalar(force, 1 / this.mass);
        this.acceleration.add(a);
    }

    /**
     * Updates kinematics via Euler Integration
     * @param {number} dt Delta time in seconds (e.g., 0.03 for 30ms)
     */
    updateKinematics(dt) {
        // v_{t+1} = v_t + a * dt
        const accelDelta = Vector2.multiplyScalar(this.acceleration, dt);
        this.velocity.add(accelDelta);
        
        // Apply friction/dampening
        const speedSq = this.velocity.magSq();
        if (speedSq > 0.0001) {
            this.velocity.multiplyScalar(1 - this.friction * dt);
        } else {
            this.velocity.set(0, 0);
        }
        
        // Cap speed
        if (this.velocity.magSq() > this.maxSpeed * this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        // p_{t+1} = p_t + v * dt
        const velDelta = Vector2.multiplyScalar(this.velocity, dt);
        this.position.add(velDelta);

        // Apply Z-axis gravity (g = 32.2 ft/s^2)
        if (this.z > 0 || this.vz !== 0) {
            const gravity = 32.2;
            this.vz -= gravity * dt;
            this.z = Math.max(0, this.z + this.vz * dt);
            if (this.z === 0 && Math.abs(this.vz) > 1) {
                this.vz = -this.vz * this.restitution;
            } else if (this.z === 0) {
                this.vz = 0;
            }
        }
        
        // Reset acceleration for the next frame
        this.acceleration.set(0, 0);
    }
}
