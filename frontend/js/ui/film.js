/* ==========================================
   CHALKBOARD FOOTBALL COACH - FILM ROOM & REPLAY
   ========================================== */

export class FilmRoom {
    constructor() {
        this.canvas = document.getElementById("film-canvas");
        this.ctx = this.canvas.getContext("2d");
        
        // Whiteboard drawing canvas (offscreen overlay to separate notes from animation)
        this.notesCanvas = document.createElement("canvas");
        this.notesCanvas.width = this.canvas.width;
        this.notesCanvas.height = this.canvas.height;
        this.notesCtx = this.notesCanvas.getContext("2d");
        
        // Replay State
        this.history = null; // play frames list
        this.currentFrameIndex = 0;
        this.isPlaying = false;
        this.timer = null;
        
        // Drawing State
        this.isDrawing = false;
        this.brushColor = "#f59e0b"; // default yellow
        this.brushSize = 3;
        this.lastX = 0;
        this.lastY = 0;
        
        this.initializeDrawingListeners();
        this.clearBoard();
    }

    initializeDrawingListeners() {
        const getMousePos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
                y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
            };
        };

        const startDraw = (e) => {
            this.isDrawing = true;
            const pos = getMousePos(e);
            this.lastX = pos.x;
            this.lastY = pos.y;
        };

        const draw = (e) => {
            if (!this.isDrawing) return;
            const pos = getMousePos(e);
            
            const nctx = this.notesCtx;
            nctx.save();
            nctx.strokeStyle = this.brushColor;
            nctx.lineWidth = this.brushSize;
            nctx.lineCap = "round";
            nctx.lineJoin = "round";
            
            // Draw slightly chalk-like texture by using lower opacity or slight shadows
            nctx.shadowColor = this.brushColor;
            nctx.shadowBlur = 1;
            
            nctx.beginPath();
            nctx.moveTo(this.lastX, this.lastY);
            nctx.lineTo(pos.x, pos.y);
            nctx.stroke();
            nctx.restore();
            
            this.lastX = pos.x;
            this.lastY = pos.y;
            
            this.render(); // Redraw
        };

        const stopDraw = () => {
            this.isDrawing = false;
        };

        // Mouse listeners
        this.canvas.addEventListener("mousedown", startDraw);
        this.canvas.addEventListener("mousemove", draw);
        this.canvas.addEventListener("mouseup", stopDraw);
        this.canvas.addEventListener("mouseleave", stopDraw);

        // Touch listeners for mobile support
        this.canvas.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) {
                startDraw(e.touches[0]);
                e.preventDefault();
            }
        });
        this.canvas.addEventListener("touchmove", (e) => {
            if (e.touches.length === 1) {
                draw(e.touches[0]);
                e.preventDefault();
            }
        });
        this.canvas.addEventListener("touchend", stopDraw);
    }

    loadPlay(replayHistory) {
        this.history = replayHistory;
        this.currentFrameIndex = 0;
        this.isPlaying = false;
        
        // Update controls
        const playBtn = document.getElementById("film-play-btn");
        const resetBtn = document.getElementById("film-reset-btn");
        const scrubber = document.getElementById("film-scrubber");
        
        if (playBtn) playBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = false;
        
        if (scrubber) {
            scrubber.disabled = false;
            scrubber.max = this.history.length - 1;
            scrubber.value = 0;
        }

        // Generate analytics summary in card
        this.generateAnalyticsSummary();
        
        this.render();
    }

    generateAnalyticsSummary() {
        const container = document.getElementById("film-analytics-details");
        if (!container || !this.history) return;

        // Calculate some basic stats from history
        const frames = this.history;
        const lastFrame = frames[frames.length - 1];
        const initialFrame = frames[0];
        
        const qbInit = initialFrame.players.find(p => p.type === "QB");
        const carrierLast = lastFrame.players.find(p => p.state === "ball_carrier" || p.state === "tackled");
        const netGain = lastFrame.ball.x - initialFrame.ball.x;

        // Count blockers/rushers engaged
        const totalFrames = frames.length;
        let blocksLogged = 0;
        frames.forEach(f => {
            const blocks = f.players.filter(p => p.state === "blocking" && p.type === "OL");
            blocksLogged += blocks.length;
        });
        const avgBlocks = (blocksLogged / totalFrames).toFixed(1);

        container.innerHTML = `
            <div class="stat-row"><span>Net Gain</span><span style="color:var(--accent); font-weight:700;">${netGain.toFixed(1)} yards</span></div>
            <div class="stat-row"><span>Pass Air Time</span><span>${(totalFrames * 0.033).toFixed(1)} seconds</span></div>
            <div class="stat-row"><span>Avg Linemen Blocked</span><span>${avgBlocks} players</span></div>
            <p class="text-muted margin-top" style="font-size:11px; line-height:1.4;">
                <strong>Coach's Breakdown:</strong> Observe the pocket containment. The guards held their rush blocks well, allowing the receivers to clear the secondary and break open downfield.
            </p>
        `;
    }

    clearBoard() {
        // Clear notes
        this.notesCtx.clearRect(0, 0, this.notesCanvas.width, this.notesCanvas.height);
        this.render();
    }

    play() {
        if (!this.history || this.isPlaying) return;
        this.isPlaying = true;
        
        document.getElementById("film-play-btn").style.display = "none";
        document.getElementById("film-pause-btn").style.display = "inline-flex";

        this.timer = setInterval(() => {
            this.currentFrameIndex++;
            if (this.currentFrameIndex >= this.history.length) {
                this.pause();
                this.currentFrameIndex = this.history.length - 1;
            }
            
            // Sync scrubber
            const scrubber = document.getElementById("film-scrubber");
            if (scrubber) scrubber.value = this.currentFrameIndex;
            
            this.render();
        }, 33); // 30 fps
    }

    pause() {
        this.isPlaying = false;
        clearInterval(this.timer);
        
        const playBtn = document.getElementById("film-play-btn");
        const pauseBtn = document.getElementById("film-pause-btn");
        if (playBtn) playBtn.style.display = "inline-flex";
        if (pauseBtn) pauseBtn.style.display = "none";
    }

    reset() {
        this.pause();
        this.currentFrameIndex = 0;
        
        const scrubber = document.getElementById("film-scrubber");
        if (scrubber) scrubber.value = 0;
        
        this.render();
    }

    scrubTo(index) {
        this.currentFrameIndex = parseInt(index);
        this.render();
    }

    render() {
        const ctx = this.ctx;
        
        // 1. Draw Chalkboard Background
        ctx.fillStyle = "#0c2511"; // deep chalkboard green
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add chalk dust texture
        ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, Math.random() * 200 + 50, 0, Math.PI*2);
            ctx.fill();
        }

        // Draw whiteboard lines (yards)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.5;
        
        // Sidelines
        ctx.beginPath();
        ctx.moveTo(30, 20); ctx.lineTo(this.canvas.width - 30, 20);
        ctx.moveTo(30, this.canvas.height - 20); ctx.lineTo(this.canvas.width - 30, this.canvas.height - 20);
        ctx.stroke();

        // 2. Draw Replay Frame
        if (this.history && this.history[this.currentFrameIndex]) {
            const frame = this.history[this.currentFrameIndex];
            
            // Sync time display
            const curTime = (this.currentFrameIndex * 0.033).toFixed(1);
            const totalTime = (this.history.length * 0.033).toFixed(1);
            const display = document.getElementById("film-time-display");
            if (display) display.textContent = `${curTime}s / ${totalTime}s`;

            // Draw LOS and first down lines in chalk
            const losYard = this.history[0].ball.x; // starting ball pos
            // Map: we center around the starting LOS
            const mapX = (fx) => {
                const center = losYard;
                return (fx - center) * 10 + 350; // 350px represents LOS center
            };

            const mapY = (fy) => {
                return fy * 7.0 + 35; // scale Y
            };

            // Draw line of scrimmage
            ctx.strokeStyle = "rgba(239, 68, 68, 0.4)"; // faint chalk red
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(mapX(losYard), 20);
            ctx.lineTo(mapX(losYard), this.canvas.height - 20);
            ctx.stroke();

            // Draw players as X (defense) and O (offense)
            frame.players.forEach(p => {
                const px = mapX(p.x);
                const py = mapY(p.y);
                
                ctx.save();
                ctx.lineWidth = 2;
                ctx.shadowColor = "rgba(0,0,0,0.3)";
                ctx.shadowBlur = 2;
                
                if (p.team === "offense") {
                    ctx.strokeStyle = "#93c5fd"; // Chalk blue
                    // Draw "O"
                    ctx.beginPath();
                    ctx.arc(px, py, 7, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    ctx.strokeStyle = "#fca5a5"; // Chalk red
                    // Draw "X"
                    ctx.beginPath();
                    ctx.moveTo(px - 5, py - 5); ctx.lineTo(px + 5, py + 5);
                    ctx.moveTo(px + 5, py - 5); ctx.lineTo(px - 5, py + 5);
                    ctx.stroke();
                }

                // Small pos labels next to icon
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.font = "8px sans-serif";
                ctx.fillText(p.type, px + 9, py + 3);
                ctx.restore();
            });

            // Draw Ball as small solid brown circle with a chalk circle outline
            if (frame.ball.state !== "dead" && frame.ball.state !== "incomplete") {
                const bx = mapX(frame.ball.x);
                const by = mapY(frame.ball.y);
                
                ctx.save();
                ctx.fillStyle = "#fbbf24"; // bright yellow
                ctx.beginPath();
                ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        } else {
            // Draw generic whiteboard placeholder text
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "16px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("CHALKBOARD ACTIVE: DRAW PLAYS OR LOAD FILM REPLAYS", this.canvas.width/2, this.canvas.height/2);
        }

        // 3. Draw Chalk Notes overlay
        ctx.drawImage(this.notesCanvas, 0, 0);
    }
}
export function getFilmAnalyticsLog(playName, resultText) {
    return `Coach comments: Loaded play "${playName}". Play resolved with: ${resultText}`;
}
export default FilmRoom;
