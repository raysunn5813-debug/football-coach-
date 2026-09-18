/* ==========================================
   CHALKBOARD FOOTBALL COACH - CANVAS RENDERER
   Precision Field Projection & Broadcast View
   ========================================== */

// --- Smooth Camera LERP State ---
export const camera = { x: 60, y: 26.65, zoom: 1.0 };

export function updateCamera(targetX, targetY) {
  const alpha = 0.08; // Smoothness factor
  camera.x += (targetX - camera.x) * alpha;
  camera.y += (targetY - camera.y) * alpha;
}

/**
 * Maps field coordinates (0-120 yards X, 0-53.3 yards Y) to Canvas Screen Pixels
 * @param {number} x - Field position in yards (0 = Left Endzone, 120 = Right Endzone)
 * @param {number} y - Field position in yards (0 = Top Sideline, 53.3 = Bottom Sideline)
 * @param {number} canvasWidth - Canvas pixel width
 * @param {number} canvasHeight - Canvas pixel height
 */
export function worldToScreen(x, y, canvasWidth, canvasHeight) {
  // Reserve padding for scorebug and field borders
  const paddingX = canvasWidth * 0.05;  // 5% left/right margin
  const paddingY = canvasHeight * 0.12; // 12% top/bottom margin

  const drawableWidth = canvasWidth - (paddingX * 2);
  const drawableHeight = canvasHeight - (paddingY * 2);

  // Normalize world position (0.0 to 1.0)
  const normX = Math.max(0, Math.min(120, x)) / 120.0;
  const normY = Math.max(0, Math.min(53.3, y)) / 53.3;

  // Linear mapping to screen canvas
  const screenX = paddingX + (normX * drawableWidth);
  const screenY = paddingY + (normY * drawableHeight);

  return { x: screenX, y: screenY, scale: 1.0 };
}

export class CanvasRenderer {
    constructor(canvasId) {
        this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
        if (!this.canvas) {
            this.canvas = document.getElementById('game-canvas') || document.createElement('canvas');
        }
        this.ctx = this.canvas.getContext("2d");
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Particle arrays
        this.particles = [];
    }

    // Helper wrapper for field projection
    toScreen(x, y) {
        return worldToScreen(x, y, this.canvas.width, this.canvas.height);
    }

    // Legacy fallback methods
    toCanvasX(fieldX) {
        return this.toScreen(fieldX, 26.65).x;
    }

    toCanvasY(fieldY) {
        return this.toScreen(60, fieldY).y;
    }

    drawField(matchState) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Fill Canvas Dark Stadium Surroundings
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, w, h);

        // 2. Draw Main Field Turf Area (0 to 120 yards X, 0 to 53.3 yards Y)
        const pTL = this.toScreen(0, 0);
        const pTR = this.toScreen(120, 0);
        const pBR = this.toScreen(120, 53.3);
        const pBL = this.toScreen(0, 53.3);

        const turfGradient = ctx.createLinearGradient(0, pTL.y, 0, pBL.y);
        turfGradient.addColorStop(0, "#163518"); // Darker top turf
        turfGradient.addColorStop(1, "#225426"); // Richer bottom turf

        ctx.fillStyle = turfGradient;
        ctx.fillRect(pTL.x, pTL.y, pTR.x - pTL.x, pBL.y - pTL.y);

        // 3. Draw Alternating 5-Yard Stripes
        for (let x = 10; x < 110; x += 5) {
            if (Math.floor(x / 5) % 2 === 0) {
                const sTL = this.toScreen(x, 0);
                const sTR = this.toScreen(x + 5, 0);
                const sBL = this.toScreen(x, 53.3);

                ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
                ctx.fillRect(sTL.x, sTL.y, sTR.x - sTL.x, sBL.y - sTL.y);
            }
        }

        // 4. Endzones
        // Left Endzone (0 to 10 yards) - Patriots Red
        const ezLeftTL = this.toScreen(0, 0);
        const ezLeftTR = this.toScreen(10, 0);
        const ezLeftBL = this.toScreen(0, 53.3);

        ctx.fillStyle = "#7f1d1d";
        ctx.fillRect(ezLeftTL.x, ezLeftTL.y, ezLeftTR.x - ezLeftTL.x, ezLeftBL.y - ezLeftTL.y);

        const ezLeftCenter = this.toScreen(5, 26.65);
        ctx.save();
        ctx.font = "bold 22px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.translate(ezLeftCenter.x, ezLeftCenter.y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("PATRIOTS", 0, 0);
        ctx.restore();

        // Right Endzone (110 to 120 yards) - Saints Blue
        const ezRightTL = this.toScreen(110, 0);
        const ezRightTR = this.toScreen(120, 0);
        const ezRightBL = this.toScreen(110, 53.3);

        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(ezRightTL.x, ezRightTL.y, ezRightTR.x - ezRightTL.x, ezRightBL.y - ezRightTL.y);

        const ezRightCenter = this.toScreen(115, 26.65);
        ctx.save();
        ctx.font = "bold 22px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.translate(ezRightCenter.x, ezRightCenter.y);
        ctx.rotate(Math.PI / 2);
        ctx.fillText("SAINTS", 0, 0);
        ctx.restore();

        // 5. Sidelines & Endlines Boundary Box
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.strokeRect(pTL.x, pTL.y, pTR.x - pTL.x, pBL.y - pTL.y);

        // 6. Yard Lines & Yard Numbers (10-yard increments)
        for (let x = 10; x <= 110; x += 10) {
            const pTop = this.toScreen(x, 0);
            const pBot = this.toScreen(x, 53.3);

            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = x === 10 || x === 110 ? 3 : 1.5;
            ctx.beginPath();
            ctx.moveTo(pTop.x, pTop.y);
            ctx.lineTo(pBot.x, pBot.y);
            ctx.stroke();

            // Skip drawing numbers directly on goal lines
            if (x > 10 && x < 110) {
                const absoluteYard = x - 10;
                let displayNum = absoluteYard > 50 ? 100 - absoluteYard : absoluteYard;

                const numTop = this.toScreen(x, 7);
                const numBot = this.toScreen(x, 46.3);

                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.font = "bold 12px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(displayNum, numTop.x, numTop.y);
                ctx.fillText(displayNum, numBot.x, numBot.y);
            }
        }

        // 7. Line of Scrimmage (LOS - Solid Dark Red Line)
        if (matchState && matchState.yardLine !== undefined) {
            const losTop = this.toScreen(matchState.yardLine, 0);
            const losBot = this.toScreen(matchState.yardLine, 53.3);

            ctx.strokeStyle = "#b91c1c"; // Solid Dark Red Line
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(losTop.x, losTop.y);
            ctx.lineTo(losBot.x, losBot.y);
            ctx.stroke();
        }

        // 8. First Down Line (Bright Neon Yellow Line)
        if (matchState && matchState.firstDownYardLine !== undefined) {
            const fdTop = this.toScreen(matchState.firstDownYardLine, 0);
            const fdBot = this.toScreen(matchState.firstDownYardLine, 53.3);

            ctx.strokeStyle = "#facc15"; // Bright Neon Yellow Line
            ctx.lineWidth = 3.5;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(fdTop.x, fdTop.y);
            ctx.lineTo(fdBot.x, fdBot.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 9. Draw Bottom Broadcast Scorebug
        this.drawBroadcastScorebug(ctx, matchState);
    }

    /**
     * Draw sleek dark translucent broadcast TV scorebug banner across bottom 60px
     */
    drawBroadcastScorebug(ctx, gameState) {
        if (!ctx) ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const state = gameState || {};

        const bannerH = 60;
        const bannerY = h - bannerH;

        ctx.save();

        // 1. Banner Background across bottom 60px
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(0, bannerY, w, bannerH);

        // Top accent border line
        ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, bannerY);
        ctx.lineTo(w, bannerY);
        ctx.stroke();

        // Extract scorebug values
        const awayName = (state.oppTeam ? state.oppTeam.name : "PATRIOTS").toUpperCase();
        const awayRecord = state.oppRecord || "0-2";
        const awayScore = state.scoreOpp !== undefined ? state.scoreOpp : 0;

        const homeName = (state.myTeam ? state.myTeam.name : "SAINTS").toUpperCase();
        const homeRecord = state.myRecord || "1-1";
        const homeScore = state.scoreMy !== undefined ? state.scoreMy : 0;

        const downDist = state.downDistString || (state.down ? `${state.down}ND & ${state.ytg || 6}` : "2ND & 6");
        const clockStr = state.clockString || (state.clock ? `${Math.floor(state.clock/60)}:${(state.clock%60).toString().padStart(2,'0')}` : "8:48");
        const quarterStr = state.quarter ? `Q${state.quarter}` : "3RD";

        const centerY = bannerY + bannerH / 2;

        // 2. Team Cards (Left & Center)
        // Away Team Card
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(20, bannerY + 10, 6, bannerH - 20);

        ctx.font = "900 13px 'Orbitron', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(awayName, 34, centerY - 6);

        ctx.font = "600 10px 'Inter', sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(awayRecord, 34, centerY + 10);

        ctx.font = "900 20px 'Orbitron', sans-serif";
        ctx.fillStyle = "#f87171";
        ctx.textAlign = "right";
        ctx.fillText(`${awayScore}`, 200, centerY);

        // Divider
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(220, bannerY + 12, 1, bannerH - 24);

        // Home Team Card
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(240, bannerY + 10, 6, bannerH - 20);

        ctx.font = "900 13px 'Orbitron', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(homeName, 254, centerY - 6);

        ctx.font = "600 10px 'Inter', sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(homeRecord, 254, centerY + 10);

        ctx.font = "900 20px 'Orbitron', sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.textAlign = "right";
        ctx.fillText(`${homeScore}`, 420, centerY);

        // 3. Game Clock / Quarter Pill
        const pill1X = Math.max(450, w * 0.60);
        const pillW1 = 110;
        const pillH = 32;
        const pillY = centerY - pillH / 2;

        ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(pill1X, pillY, pillW1, pillH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = "700 12px 'Orbitron', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(`${quarterStr} | ${clockStr}`, pill1X + pillW1 / 2, centerY);

        // 4. Down & Distance Indicator Pill
        const pill2X = Math.max(580, w * 0.78);
        const pillW2 = 110;

        ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(pill2X, pillY, pillW2, pillH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = "900 13px 'Orbitron', sans-serif";
        ctx.fillStyle = "#fbbf24";
        ctx.textAlign = "center";
        ctx.fillText(downDist, pill2X + pillW2 / 2, centerY);

        ctx.restore();
    }

    drawScorebug(matchState) {
        this.drawBroadcastScorebug(this.ctx, matchState);
    }

    drawPlayers(players, camX = 0, offColor = "#3b82f6", defColor = "#ef4444", ballCarrier = null) {
        const ctx = this.ctx;
        ctx.save();

        // Depth sorting by Y
        const sortedPlayers = [...players].sort((a, b) => a.y - b.y);

        sortedPlayers.forEach(p => {
            const pt = this.toScreen(p.x, p.y);
            const radius = 9;

            // Player Ground Shadow
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.ellipse(pt.x, pt.y + 4, radius, radius * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Player Circle Body
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = p.team === "offense" ? offColor : defColor;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.8;
            ctx.fill();
            ctx.stroke();

            // Ball Carrier Halo
            if (ballCarrier === p || p.state === "ball_carrier") {
                ctx.save();
                ctx.strokeStyle = "#00ffcc";
                ctx.lineWidth = 2.5;
                ctx.shadowColor = "#00ffcc";
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, radius + 4, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            // Directional Wedge
            const speed = Math.sqrt((p.vx || 0) * (p.vx || 0) + (p.vy || 0) * (p.vy || 0));
            if (speed > 0.5) {
                const angle = Math.atan2(p.vy || 0, p.vx || 0);
                ctx.save();
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.translate(pt.x, pt.y);
                ctx.rotate(angle);
                ctx.moveTo(radius + 2, 0);
                ctx.lineTo(radius - 2, -3);
                ctx.lineTo(radius - 2, 3);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            // Position Label
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 8px 'Orbitron', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let label = p.type || "P";
            if (label.includes("WR")) label = label.replace("WR", "W");
            ctx.fillText(label, pt.x, pt.y);
        });

        ctx.restore();
    }

    drawPreSnapOverlay(play, isFlipped, lineOfScrimmage) {
        if (!play || !play.routes) return;
        const ctx = this.ctx;
        ctx.save();

        const ROUTE_COLORS = {
            GREEN: '#22c55e',
            WHITE: '#ffffff',
            YELLOW: '#facc15',
            ORANGE: '#f97316',
            RED: '#ef4444'
        };

        // play.routes is an array of { player, type, color, waypoints, arrow },
        // where each waypoint is a [lateral, depth] pair relative to field center
        // and the line of scrimmage (matching the alignments/routes shape in
        // playbook3d.js), not a keyed object of {x, y} points.
        play.routes.forEach((routeData) => {
            const waypoints = routeData.waypoints;
            if (!waypoints || waypoints.length === 0) return;

            const routeColor = ROUTE_COLORS[routeData.color] || "rgba(254, 240, 138, 0.6)";
            ctx.beginPath();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = routeColor;
            ctx.fillStyle = routeColor;

            let lastPt = null;
            waypoints.forEach(([lateral, depth], i) => {
                const worldLateral = 26.65 + (isFlipped ? -lateral : lateral);
                const worldDepth = lineOfScrimmage + depth;
                const screenPt = this.toScreen(worldDepth, worldLateral);
                if (i === 0) {
                    ctx.moveTo(screenPt.x, screenPt.y);
                } else {
                    ctx.lineTo(screenPt.x, screenPt.y);
                }
                lastPt = screenPt;
            });
            ctx.stroke();

            // Arrowhead at end of route, only when the play data marks it
            if (routeData.arrow && lastPt) {
                ctx.beginPath();
                ctx.arc(lastPt.x, lastPt.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.restore();
    }

    drawBall(ball) {
        if (!ball || ball.state === "dead" || ball.state === "incomplete") return;
        const ctx = this.ctx;
        ctx.save();

        // 1. Calculate shadow ground position
        const groundPt = this.toScreen(ball.x, ball.y);
        const zScale = groundPt.scale || 1.0;
        const zOffset = (ball.z || 0) * zScale * 8; // Screen Y offset from height

        // 2. Elevated ball position
        const elevatedX = groundPt.x;
        const elevatedY = groundPt.y - zOffset;

        const sizeX = 8 * zScale;
        const sizeY = 5 * zScale;

        // 3. Draw translucent dark oval for the shadow on the grass
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(groundPt.x + (zOffset * 0.3), groundPt.y, sizeX * 1.1, sizeY * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Render the football sprite directly above it
        ctx.fillStyle = "#78350f";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;

        const angle = Math.atan2(ball.vy || 0, ball.vx || 0) || 0;
        ctx.translate(elevatedX, elevatedY);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.ellipse(0, 0, sizeX, sizeY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Laces
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-sizeX * 0.4, 0);
        ctx.lineTo(sizeX * 0.4, 0);
        ctx.stroke();

        ctx.restore();
    }

    drawReferee(ref) {
        if (!ref) return;
        const ctx = this.ctx;
        const pt = this.toScreen(ref.x, ref.y);
        const radius = 6;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }

    addTackleBurst(x, y) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: Math.random() < 0.6 ? "#166534" : "#78350f",
                size: Math.random() * 3 + 1.5,
                alpha: 1.0,
                decay: Math.random() * 0.05 + 0.03
            });
        }
    }

    addTouchdownFireworks(x, y) {
        const colors = ["#ef4444", "#3b82f6", "#10b981", "#fbbf24", "#a855f7", "#ffffff"];
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12 - 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 2,
                alpha: 1.0,
                decay: Math.random() * 0.03 + 0.015
            });
        }
    }

    updateParticles(dt) {
        this.particles.forEach((p, idx) => {
            p.x += p.vx * dt * 10;
            p.y += p.vy * dt * 10;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(idx, 1);
            }
        });
    }

    drawParticles() {
        const ctx = this.ctx;
        ctx.save();
        this.particles.forEach(p => {
            const pt = this.toScreen(p.x, p.y);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}
