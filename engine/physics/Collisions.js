import { Vector2 } from './Vector2.js';

/**
 * Pure functions for detecting and resolving physical collisions
 */
export class Collisions {

    /**
     * Dynamic Circle-to-Circle collision detection and resolution
     * Returns true if collision occurred and was resolved.
     */
    static resolveCircleCircle(entityA, entityB) {
        const distSq = entityA.position.distanceToSq(entityB.position);
        const radSum = entityA.radius + entityB.radius;

        if (distSq < radSum * radSum && distSq > 0) {
            const dist = Math.sqrt(distSq);
            // Normal vector pointing from A to B
            const nx = (entityB.position.x - entityA.position.x) / dist;
            const ny = (entityB.position.y - entityA.position.y) / dist;

            // Penetration depth
            const penetration = radSum - dist;
            
            // Separate entities based on mass (lighter entity moves more)
            const totalMass = entityA.mass + entityB.mass;
            const ratioA = entityB.mass / totalMass;
            const ratioB = entityA.mass / totalMass;

            entityA.position.x -= nx * penetration * ratioA;
            entityA.position.y -= ny * penetration * ratioA;
            entityB.position.x += nx * penetration * ratioB;
            entityB.position.y += ny * penetration * ratioB;

            // Relative velocity
            const rvx = entityB.velocity.x - entityA.velocity.x;
            const rvy = entityB.velocity.y - entityA.velocity.y;

            // Velocity along the normal
            const velAlongNormal = rvx * nx + rvy * ny;

            // Do not resolve if velocities are separating
            if (velAlongNormal > 0) return true;

            // Calculate restitution (bounciness) - use the minimum of both
            const e = Math.min(entityA.restitution, entityB.restitution);

            // Calculate impulse scalar
            let j = -(1 + e) * velAlongNormal;
            j /= (1 / entityA.mass + 1 / entityB.mass);

            // Apply impulse
            const impulseX = j * nx;
            const impulseY = j * ny;

            entityA.velocity.x -= impulseX / entityA.mass;
            entityA.velocity.y -= impulseY / entityA.mass;
            entityB.velocity.x += impulseX / entityB.mass;
            entityB.velocity.y += impulseY / entityB.mass;

            return true;
        }
        return false;
    }

    /**
     * Static Circle-to-Box (AABB) collision resolution
     * Box bounds defined by {minX, minY, maxX, maxY}
     */
    static resolveCircleBox(entity, boxBounds) {
        let testX = entity.position.x;
        let testY = entity.position.y;

        // Find closest edges
        if (entity.position.x < boxBounds.minX) testX = boxBounds.minX;
        else if (entity.position.x > boxBounds.maxX) testX = boxBounds.maxX;
        
        if (entity.position.y < boxBounds.minY) testY = boxBounds.minY;
        else if (entity.position.y > boxBounds.maxY) testY = boxBounds.maxY;

        const dx = entity.position.x - testX;
        const dy = entity.position.y - testY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < entity.radius * entity.radius) {
            const distance = Math.sqrt(distanceSq);
            
            // Separation
            if (distance > 0) {
                const penetration = entity.radius - distance;
                const nx = dx / distance;
                const ny = dy / distance;
                
                entity.position.x += nx * penetration;
                entity.position.y += ny * penetration;
                
                // Inverse velocity and apply restitution against static surface
                const velAlongNormal = entity.velocity.x * nx + entity.velocity.y * ny;
                if (velAlongNormal < 0) {
                    const e = entity.restitution;
                    const j = -(1 + e) * velAlongNormal;
                    entity.velocity.x += j * nx;
                    entity.velocity.y += j * ny;
                }
            } else {
                // Center exactly on edge case
                entity.position.x += entity.radius;
            }
            return true;
        }
        return false;
    }
}
