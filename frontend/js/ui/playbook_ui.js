/**
 * playbook_ui.js — 3D Play Card Preview System
 * Replaces flat SVG diagrams with WebGL mini Three.js renders per play card.
 * Uses global THREE (loaded via CDN).
 */

// ── Mini-2D Field renderer for each play card ────────────────────────────────
function renderPlayCard2D(canvas, play, isFlipped) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 220;
    const h = canvas.height = 140;
    
    ctx.clearRect(0, 0, w, h);

    // 1. Field Background (Dark Slate Blue)
    ctx.fillStyle = '#1e293b'; 
    ctx.fillRect(0, 0, w, h);

    // 2. Field Hash / Yard lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for(let y = 0; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // 3. Line of Scrimmage (LOS)
    const losY = h * 0.75;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, losY);
    ctx.lineTo(w, losY);
    ctx.stroke();
    ctx.setLineDash([]);

    const xScale = w / 34; 
    const yScale = h / 24;
    const xCenter = w / 2;
    const flip = isFlipped ? -1 : 1;

    function toCanvasX(z) { return xCenter + (z * flip) * xScale; }
    function toCanvasY(x) { return losY - x * yScale; }

    const POSITIONS = {
        QB:  { x: -2.5,  z: 0 },
        RB:  { x: -4.5,  z: 0 },
        C:   { x:  0,    z: 0 },
        LG:  { x:  0,    z:-1.5 },
        RG:  { x:  0,    z: 1.5 },
        LT:  { x:  0,    z:-3.5 },
        RT:  { x:  0,    z: 3.5 },
        TE:  { x:  0,    z: 5.5 },
        W1:  { x:  0,    z:-10  },
        W2:  { x:  0,    z: 10  },
        W3:  { x:  0,    z:-7   },
        WR:  { x:  0,    z:-8   },
        WR1: { x:  0,    z:-10  },
        WR2: { x:  0,    z: 10  },
    };

    function drawArrow(ctx, fromX, fromY, toX, toY, color) {
        if (fromX === toX && fromY === toY) return;
        const headlen = 5;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(toX, toY);
        ctx.fillStyle = color;
        ctx.fill();
    }

    if (play && play.routes) {
        Object.entries(play.routes).forEach(([role, waypoints]) => {
            const startPos = POSITIONS[role];
            if (!startPos || !Array.isArray(waypoints) || waypoints.length === 0) return;

            const isBlocker = ['C','LG','RG','LT','RT'].includes(role);
            const routeColor = isBlocker ? '#3b82f6' : '#facc15';
            
            let curCanvasX = toCanvasX(startPos.z);
            let curCanvasY = toCanvasY(startPos.x);
            
            let simX = startPos.x;
            let simZ = startPos.z;

            for (let i = 0; i < waypoints.length; i++) {
                const wp = waypoints[i];
                simX += wp.dx;
                simZ += (wp.dz || 0);
                const nextX = toCanvasX(simZ);
                const nextY = toCanvasY(simX);
                
                if (i === waypoints.length - 1) {
                    drawArrow(ctx, curCanvasX, curCanvasY, nextX, nextY, routeColor);
                } else {
                    ctx.beginPath();
                    ctx.moveTo(curCanvasX, curCanvasY);
                    ctx.lineTo(nextX, nextY);
                    ctx.strokeStyle = routeColor;
                    ctx.lineWidth = 2.0;
                    ctx.stroke();
                }
                curCanvasX = nextX;
                curCanvasY = nextY;
            }
        });
    }

    Object.entries(POSITIONS).forEach(([role, pos]) => {
        const sx = toCanvasX(pos.z);
        const sy = toCanvasY(pos.x);

        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    });
}

export class PlaybookUI {
    constructor(playsDatabase, onPlaySelected) {
        this.plays = playsDatabase;
        this.onPlaySelected = onPlaySelected;
        this.currentCategory = 'RUN';
        this.isFlipped = false;

        this.gridElement = document.getElementById('play-grid');
        this._setupTabListeners();
    }

    _setupTabListeners() {
        document.querySelectorAll('.pb-tab').forEach(tab => {
            tab.addEventListener('click', e => {
                document.querySelectorAll('.pb-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.render();
            });
        });

        const flipBtn = document.getElementById('btn-flip-play');
        if (flipBtn) {
            flipBtn.addEventListener('click', () => {
                this.isFlipped = !this.isFlipped;
                this.render();
            });
        }
    }

    _getPlaysByCategory(category) {
        const allPlays = [];

        if (this.plays && typeof this.plays === 'object') {
            Object.values(this.plays).forEach(playbook => {
                if (playbook.plays && Array.isArray(playbook.plays)) {
                    allPlays.push(...playbook.plays);
                } else if (Array.isArray(playbook)) {
                    allPlays.push(...playbook);
                }
            });
        }

        let mappedCategory = category;
        if (['SHORT_PASS', 'DEEP_PASS', 'PA_PASS'].includes(category)) mappedCategory = 'pass';
        else if (category === 'RUN') mappedCategory = 'run';
        else if (['SPECIAL TEAMS', 'SPECIAL_TEAMS'].includes(category)) mappedCategory = 'special';

        let filtered = allPlays.filter(p => p.type === mappedCategory || p.type === mappedCategory.toUpperCase());
        return filtered.length > 0 ? filtered : allPlays;
    }

    render() {
        if (!this.gridElement) return;
        this.gridElement.innerHTML = '';

        const plays = this._getPlaysByCategory(this.currentCategory);

        plays.slice(0, 6).forEach(play => {
            const card = document.createElement('div');
            card.className = 'play-card';
            card.style.cssText = 'cursor:pointer; background:#0b1629; border:1px solid #1f2937; border-radius:8px; overflow:hidden; transition:all 0.2s;';

            const playName = play.name || 'Custom Play';
            const playType = play.type || this.currentCategory;
            const catColor = { RUN: '#4ade80', pass: '#3b82f6', PASS: '#3b82f6', special: '#f97316' }[playType] || '#94a3b8';

            // 3D canvas preview
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'display:block;width:100%;border-bottom:1px solid #1f2937;';
            card.appendChild(canvas);

            // Defer render to ensure canvas is in DOM
            requestAnimationFrame(() => renderPlayCard2D(canvas, play, this.isFlipped));

            // Footer info
            const footer = document.createElement('div');
            footer.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:7px 10px;';
            footer.innerHTML = `
                <span style="font-size:12px;font-weight:700;color:#fff;">${playName}</span>
                <span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:3px;border:1px solid ${catColor}44;color:${catColor};background:${catColor}18;">${playType.toUpperCase()}</span>
            `;
            card.appendChild(footer);

            // Hover glow
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = '#3b82f6';
                card.style.boxShadow = '0 0 14px rgba(59,130,246,0.3)';
                card.style.transform = 'translateY(-2px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '#1f2937';
                card.style.boxShadow = 'none';
                card.style.transform = 'none';
            });

            card.addEventListener('click', () => {
                document.querySelectorAll('.play-card').forEach(c => {
                    c.style.borderColor = '#1f2937';
                    c.style.boxShadow = 'none';
                });
                card.style.borderColor = '#2563eb';
                card.style.boxShadow = '0 0 18px rgba(37,99,235,0.5)';
                if (this.onPlaySelected) this.onPlaySelected(play, this.isFlipped);
            });

            this.gridElement.appendChild(card);
        });
    }

    // Keep legacy method name for compatibility
    setupTabListeners() { this._setupTabListeners(); }
    getPlaysByCategory(cat) { return this._getPlaysByCategory(cat); }
}
