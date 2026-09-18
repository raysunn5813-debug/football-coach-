/**
 * gameday.js — Chalkboard Football Coach
 * Live Game Coverage: Three.js 3D Field + Play-Call Overlay
 *
 * Architecture:
 *  - Uses global THREE loaded via CDN <script> in gameday.html
 *  - Imports PLAYBOOK + FORMATIONS from engine/playbook3d.js (no THREE dependency)
 *  - Play grid draws canvas route diagrams, matching the original working UI
 *  - After snap, overlay hides and the 3D field is live
 */

import { PLAYBOOK, FORMATIONS, playbookReady } from './engine/playbook3d.js?v=5';
import {
    buildBroadcastEnvironment, createPlayerFigure, createFootball, CAMERA_PRESETS,
} from './renderers/ThreeRenderer.js?v=5';

// ══════════════════════════════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════════════════════════════
const match = {
    quarter: 1,
    clock: 900,      // 15:00 in seconds
    scoreHome: 0,
    scoreAway: 0,
    down: 1,
    yardsToGo: 10,
    yardLine: 25,    // Own 25
    possession: 'home',
    timeoutsHome: 3,
    playHistory: [],
    playActive: false,
};

let selectedPlay = null;
let currentFilter = 'ALL';

// ==========================================
// 1. DYNAMIC CAMERA SYSTEM (Tracks LOS)
// ==========================================
// Framing comes from the shared broadcast presets in ThreeRenderer.js so both
// pages share one camera language (long lens, low elevation, ball-tracking).
const CAMERA_MODES = [
    { name: 'SkyCam',    key: 'sky' },
    { name: 'Broadcast', key: 'broadcast' },
    { name: 'Close-Up',  key: 'closeup' },
    { name: 'Endzone',   key: 'endzone' },
].map(m => {
    const p = CAMERA_PRESETS[m.key];
    return {
        name: m.name,
        fov: p.fov,
        pos:  (los) => p.pos(los, new THREE.Vector3()),
        look: (los) => p.look(los, new THREE.Vector3()),
    };
});

let currentCamIndex = 0;
let activeLOS = match.yardLine + 10;
let currentLookAt = new THREE.Vector3(activeLOS + 5, 0, 26.65);

// ══════════════════════════════════════════════════════════════════════
// THREE.JS SCENE (uses global THREE from CDN)
// ══════════════════════════════════════════════════════════════════════
const container = document.getElementById('game-container') || document.getElementById('game-coverage-container');
const existingCanvas = document.getElementById('game-canvas');

// Replace static canvas with WebGL renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue

// far plane must clear the sky dome (radius 900) the environment adds
const camera = new THREE.PerspectiveCamera(
    CAMERA_MODES[currentCamIndex].fov,
    container.clientWidth / container.clientHeight, 0.5, 2000);
camera.position.copy(CAMERA_MODES[currentCamIndex].pos(activeLOS));
camera.lookAt(CAMERA_MODES[currentCamIndex].look(activeLOS));

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

// Swap canvas
if (existingCanvas) existingCanvas.style.display = 'none';
container.appendChild(renderer.domElement);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.inset = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';

// ── Stadium, lighting and painted turf ───────────────────────────────
// One call replaces the old flat plane + 10 yard-line quads: painted turf
// (numbers, hashes, end zones, midfield logo), grandstands, crowd, goalposts,
// pylons and sideline crew, plus the sun whose shadow frustum we retarget
// each frame in animate().
const environment = buildBroadcastEnvironment(scene, renderer);

// LOS marker — television blue, sitting just above the paint
const losMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 53.3),
    new THREE.MeshBasicMaterial({
        color: 0x2f6fe8, opacity: 0.9, transparent: true,
        side: THREE.DoubleSide, depthWrite: false,
    })
);
losMesh.rotation.x = -Math.PI / 2;
losMesh.position.set(match.yardLine + 10, 0.035, 26.65);
scene.add(losMesh);

// Football
const footballMesh = createFootball();
footballMesh.position.set(match.yardLine + 10, 0.42, 26.65);
scene.add(footballMesh);

// ── Players ───────────────────────────────────────────────────────────
const players = [];

let figureSalt = 0;
function buildPlayerFigure(isDefense, role) {
    return createPlayerFigure({
        jersey:  isDefense ? '#d92b2b' : '#2f6fe8',
        helmet:  isDefense ? '#4a0f0f' : '#0e2148',
        pants:   isDefense ? '#e2e3e8' : '#eceef2',
        trim:    isDefense ? '#ffd9d9' : '#ffffff',
        skin:    ['#8a5a3b', '#a86f49', '#c98d63', '#e0aa7f'][figureSalt % 4],
        role,
        number:  (figureSalt++ * 7) % 89 + 10,
    });
}

function generatePlayers() {
    players.forEach(p => {
        if (p.group) scene.remove(p.group);
    });
    players.length = 0;

    const offRoles = ['C', 'OG1', 'OG2', 'OT1', 'OT2', 'QB', 'RB', 'TE', 'WR1', 'WR2', 'WR3'];
    const defRoles = ['DT1', 'DT2', 'DE1', 'DE2', 'MLB', 'WLB', 'SLB', 'CB1', 'CB2', 'FS', 'SS'];

    const los = match.yardLine + 10;

    const OFFENSE_SHOTGUN = {
        'C':   { dx: 0.0,   dz: -0.5 },
        'OG1': { dx: -1.5,  dz: -0.5 },
        'OG2': { dx: 1.5,   dz: -0.5 },
        'OT1': { dx: -3.5,  dz: -0.5 },
        'OT2': { dx: 3.5,   dz: -0.5 },
        'QB':  { dx: 0.0,   dz: -5.0 },
        'RB':  { dx: -2.0,  dz: -5.0 },
        'TE':  { dx: 5.5,   dz: -0.5 },
        'WR1': { dx: -18.0, dz: -0.5 },
        'WR2': { dx: 18.0,  dz: -0.5 },
        'WR3': { dx: -12.0, dz: -1.5 },
    };

    const DEFENSE_43 = {
        'DT1': { dx: -1.5,  dz: 1.5 },
        'DT2': { dx: 1.5,   dz: 1.5 },
        'DE1': { dx: -4.5,  dz: 1.5 },
        'DE2': { dx: 4.5,   dz: 1.5 },
        'MLB': { dx: 0.0,   dz: 5.5 },
        'WLB': { dx: -4.0,  dz: 5.0 },
        'SLB': { dx: 4.0,   dz: 5.0 },
        'CB1': { dx: -18.0, dz: 6.0 },
        'CB2': { dx: 18.0,  dz: 6.0 },
        'FS':  { dx: -6.0,  dz: 12.0 },
        'SS':  { dx: 6.0,   dz: 10.0 },
    };

    offRoles.forEach((role) => {
        const pos = OFFENSE_SHOTGUN[role] || { dx: 0, dz: 0 };
        const group = buildPlayerFigure(false, role);
        const x = los + pos.dz;
        const z = 26.65 + pos.dx;
        group.position.set(x, 0, z);
        scene.add(group);
        players.push({ id: `OFF_${role}`, role, team: 'off', group, x, z, startX: x, startZ: z, route: [], routeIdx: 0, active: false });
    });

    defRoles.forEach((role) => {
        const pos = DEFENSE_43[role] || { dx: 0, dz: 0 };
        const group = buildPlayerFigure(true, role);
        const x = los + pos.dz;
        const z = 26.65 + pos.dx;
        group.position.set(x, 0, z);
        scene.add(group);
        players.push({ id: `DEF_${role}`, role, team: 'def', group, x, z, startX: x, startZ: z, route: [], routeIdx: 0, active: false });
    });
}

const OL_ROLES = ['LT', 'LG', 'C', 'RG', 'RT'];

function alignPlayersPreSnap(playKey) {
    const play = PLAYBOOK[playKey];
    if (!play) return;

    const los = match.yardLine + 10;
    const alignments = play.alignments || {};

    // This play's own alignment keys (OL + whichever of QB/HB/FB/X/Y/Z/H/F it
    // uses) are the only source of truth for real formations/routes — the
    // generic FORMATIONS templates use different role names (LG/RG/W1-3) and
    // don't match, so offense is rebuilt fresh for every play instead.
    players.filter(p => p.team === 'off').forEach(p => { if (p.group) scene.remove(p.group); });
    for (let i = players.length - 1; i >= 0; i--) {
        if (players[i].team === 'off') players.splice(i, 1);
    }

    function addOffPlayer(role, lateral, depth) {
        const x = los + depth;
        const z = 26.65 + lateral;
        const group = buildPlayerFigure(false, role);
        group.position.set(x, 0, z);
        scene.add(group);
        players.push({
            id: `OFF_${role}`, role, team: 'off', group, x, z,
            startX: x, startZ: z, baseLateral: lateral, baseDepth: depth,
            route: [], routeIdx: 0, active: false,
        });
    }

    if (Array.isArray(alignments.OL)) {
        alignments.OL.forEach((pt, i) => addOffPlayer(OL_ROLES[i] || `OL${i + 1}`, pt[0], pt[1]));
    }
    Object.entries(alignments).forEach(([role, pt]) => {
        if (role === 'OL') return;
        if (Array.isArray(pt) && pt.length === 2 && typeof pt[0] === 'number') {
            addOffPlayer(role, pt[0], pt[1]);
        }
    });

    // play.routes is an array of {player, waypoints: [[lateral, depth], ...]}
    // with absolute [lateral, depth] coordinates (same space as alignments),
    // converted here into the {dx, dz} offset-from-start pairs simulationTick
    // expects (dx = depth delta, dz = lateral delta).
    if (Array.isArray(play.routes)) {
        play.routes.forEach(r => {
            const p = players.find(pl => pl.team === 'off' && pl.role === r.player);
            if (p && Array.isArray(r.waypoints) && r.waypoints.length) {
                p.route = r.waypoints.map(wp => ({ dx: wp[1] - p.baseDepth, dz: wp[0] - p.baseLateral }));
                p.routeIdx = 0;
                p.active = true;
            }
        });
    }

    footballMesh.position.set(los, 0.42, 26.65);
    losMesh.position.set(los, 0.03, 26.65);
}

// ══════════════════════════════════════════════════════════════════════
// PLAY GRID — Canvas Route Diagrams
// ══════════════════════════════════════════════════════════════════════
function drawRouteOnCanvas(canvas, play) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Field Background (Dark Chalkboard Slate)
    ctx.fillStyle = '#0f172a'; 
    ctx.fillRect(0, 0, w, h);

    // 2. Field Hash / Yard lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for(let y = 0; y < h; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // 3. Line of Scrimmage (LOS)
    const losY = h * 0.65;
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, losY);
    ctx.lineTo(w, losY);
    ctx.stroke();
    ctx.setLineDash([]);

    const xScale = w / 40; 
    const yScale = h / 30;
    const xCenter = w / 2;

    function toCanvasX(x) { return xCenter + x * xScale; }
    function toCanvasY(y) { return losY - y * yScale; }

    const colorMap = {
        "GREEN": "#00FF7F",
        "YELLOW": "#FFD700",
        "ORANGE": "#FF8C00",
        "WHITE": "#FFFFFF"
    };

    function drawArrowhead(ctx, fromX, fromY, toX, toY, color) {
        if (fromX === toX && fromY === toY) return;
        const headlen = 6;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(toX, toY);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawBlockBar(ctx, fromX, fromY, toX, toY, color) {
        if (fromX === toX && fromY === toY) return;
        const barLen = 5;
        const angle = Math.atan2(toY - fromY, toX - fromX) + Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(toX - barLen * Math.cos(angle), toY - barLen * Math.sin(angle));
        ctx.lineTo(toX + barLen * Math.cos(angle), toY + barLen * Math.sin(angle));
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.stroke();
    }

    // Direct Vector Specification (25 Madden Plays dataset)
    if (play.alignments && Array.isArray(play.routes)) {
        play.routes.forEach(r => {
            const waypoints = r.waypoints || [];
            if (waypoints.length < 2) return;

            const strokeColor = colorMap[r.color] || r.color || "#FFD700";
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2.2;

            if (r.type === "MOTION") {
                ctx.setLineDash([3, 3]);
            } else {
                ctx.setLineDash([]);
            }

            ctx.beginPath();
            let startX = toCanvasX(waypoints[0][0]);
            let startY = toCanvasY(waypoints[0][1]);
            ctx.moveTo(startX, startY);

            for (let i = 1; i < waypoints.length; i++) {
                let nextX = toCanvasX(waypoints[i][0]);
                let nextY = toCanvasY(waypoints[i][1]);
                ctx.lineTo(nextX, nextY);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            const lastWp = waypoints[waypoints.length - 1];
            const prevWp = waypoints[waypoints.length - 2];
            const endX = toCanvasX(lastWp[0]);
            const endY = toCanvasY(lastWp[1]);
            const prevX = toCanvasX(prevWp[0]);
            const prevY = toCanvasY(prevWp[1]);

            if (r.arrow) {
                drawArrowhead(ctx, prevX, prevY, endX, endY, strokeColor);
            } else if (r.type === "BLOCK") {
                drawBlockBar(ctx, prevX, prevY, endX, endY, strokeColor);
            }
        });

        // Draw Player Alignment Nodes
        Object.entries(play.alignments).forEach(([posKey, posVal]) => {
            if (posKey === "OL" && Array.isArray(posVal)) {
                posVal.forEach(pt => {
                    const cx = toCanvasX(pt[0]);
                    const cy = toCanvasY(pt[1]);
                    ctx.beginPath();
                    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = '#94a3b8';
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            } else if (Array.isArray(posVal) && posVal.length === 2 && typeof posVal[0] === 'number') {
                const cx = toCanvasX(posVal[0]);
                const cy = toCanvasY(posVal[1]);
                ctx.beginPath();
                ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = posKey === 'QB' ? '#ef4444' : '#3b82f6';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
        return;
    }

    // Legacy delta routes fallback
    const routes = play.routes || {};
    const formation = FORMATIONS[play.formation] || FORMATIONS.SHOTGUN_SPREAD;

    Object.entries(routes).forEach(([role, waypoints]) => {
        const startPos = formation[role] || { x: 0, z: 0 };
        const isDef = ['DT1','DT2','DE1','DE2','MLB','WLB','SLB','CB1','CB2','FS','SS'].includes(role);
        
        if (!isDef && waypoints && waypoints.length > 0) {
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
                    drawArrowhead(ctx, curCanvasX, curCanvasY, nextX, nextY, routeColor);
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
        }
    });

    Object.entries(formation).forEach(([role, pos]) => {
        const isDef = ['DT1','DT2','DE1','DE2','MLB','WLB','SLB','CB1','CB2','FS','SS'].includes(role);
        if (isDef) return; 

        const sx = toCanvasX(pos.z);
        const sy = toCanvasY(pos.x);

        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    });
}

function formatFormationName(formStr) {
    if (!formStr) return 'SHOTGUN';
    if (formStr.includes('SHOTGUN')) return 'SHOTGUN';
    if (formStr.includes('I-FORM') || formStr.includes('IFORM')) return 'I-FORM';
    if (formStr.includes('PISTOL')) return 'PISTOL';
    if (formStr.includes('EMPTY')) return 'EMPTY';
    if (formStr.includes('GOAL')) return 'GOAL LINE';
    return formStr.replace(/_/g, ' ');
}

async function buildPlayGrid(filter) {
    const grid = document.getElementById('play-grid-container') || document.getElementById('play-grid');
    if (!grid) {
        console.error('[gameday] Play grid container element not found!');
        return;
    }
    grid.innerHTML = '';
    grid.scrollTop = 0;
    currentFilter = filter || 'ALL';

    let playbookObj = PLAYBOOK;
    if (!playbookObj || Object.keys(playbookObj).length === 0) {
        console.warn('[gameday] PLAYBOOK binding empty, attempting direct fetch of /shared/playbook.json...');
        try {
            const res = await fetch('/shared/playbook.json');
            if (res.ok) {
                playbookObj = await res.json();
            }
        } catch (err) {
            console.error('[gameday] Direct playbook fetch failed:', err);
        }
    }

    const playEntries = Object.entries(playbookObj || {});
    if (playEntries.length === 0) {
        console.error('[gameday] CRITICAL: No plays available to render in playbook grid!');
        grid.innerHTML = '<div style="grid-column: 1/-1; color: #ef4444; text-align: center; padding: 20px; font-weight: 700;">❌ Unable to load playbook. Please refresh.</div>';
        return;
    }

    let renderedCount = 0;
    for (const [key, play] of playEntries) {
        if (!play) continue;
        const playCategory = play.category || play.play_type || 'RUN';
        if (currentFilter !== 'ALL' && playCategory !== currentFilter) continue;

        try {
            const card = document.createElement('div');
            card.className = 'play-card';
            card.dataset.playKey = key;

            const canvas = document.createElement('canvas');
            canvas.width = 240;
            canvas.height = 135;
            canvas.style.width = '100%';
            canvas.style.height = '105px';
            canvas.style.minHeight = '105px';
            canvas.style.display = 'block';
            drawRouteOnCanvas(canvas, play);
            card.appendChild(canvas);

            const catColor = { RUN: '#4ade80', SHORT: '#fbbf24', DEEP: '#c084fc', SPECIAL: '#f87171' }[playCategory] || '#94a3b8';
            const formLabel = formatFormationName(play.formation);
            const playName = play.name || play.play_name || `Play ${key}`;

            const footer = document.createElement('div');
            footer.className = 'play-card-footer';
            footer.innerHTML = `
                <div class="play-card-name">${playName}</div>
                <div style="display:flex; gap:4px; align-items:center;">
                    <span class="play-type-badge" style="background:${catColor}22;color:${catColor};border:1px solid ${catColor}44;font-size:8px;padding:2px 5px;border-radius:3px;font-weight:800;">${playCategory}</span>
                    <span class="play-form-badge" style="background:rgba(59,130,246,0.15);color:#93c5fd;border:1px solid rgba(59,130,246,0.3);font-size:8px;padding:2px 5px;border-radius:3px;font-weight:800;">${formLabel}</span>
                </div>
            `;
            card.appendChild(footer);

            const selectPlayHandler = async () => {
                document.querySelectorAll('.play-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedPlay = key;
                alignPlayersPreSnap(key);

                const evalBox = document.getElementById('matchup-eval-box');
                if (evalBox) {
                    evalBox.innerHTML = `⏳ Evaluating matchup...`;
                    try {
                        const res = await fetch(`/api/playbook/evaluate-matchup?play_id=${key}`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.primary_mismatch) {
                                const pm = data.primary_mismatch;
                                const scoutIntel = data.chief_scout_intel ? `<div style="color:#38bdf8;font-size:10px;margin-top:3px;font-weight:600;">🔍 ${data.chief_scout_intel}</div>` : '';
                                evalBox.innerHTML = `
                                    <div style="color:${pm.highlight_color};font-weight:700;font-size:12px;">⚡ Matchup Win Odds: ${pm.success_probability_pct}% (${pm.success_rating})</div>
                                    <div style="color:#e2e8f0;margin-top:2px;">Primary Target: ${pm.target_name} (${pm.distance_category})</div>
                                    <div style="color:#94a3b8;font-size:10px;">QB Acc: ${pm.qb_accuracy_used} | Mismatch: ${pm.matchup_delta >= 0 ? '+' : ''}${pm.matchup_delta} OVR</div>
                                    ${scoutIntel}
                                `;
                            } else {
                                evalBox.innerHTML = `📊 Play Ready (${playCategory})`;
                            }
                        }
                    } catch (e) {
                        evalBox.innerHTML = `📊 Play Ready (${playCategory})`;
                    }
                }

                if (BACKEND_TELEMETRY_ENABLED && window.gamedayWS && window.gamedayWS.readyState === WebSocket.OPEN) {
                    window.gamedayWS.send(JSON.stringify({ command: 'PRE_SNAP', play_id: key }));
                }
            };

            card.addEventListener('click', selectPlayHandler);

            // Double click: Confirm play selection, close overlay, show 3D field with floating bottom-right SNAP button
            card.addEventListener('dblclick', () => {
                selectPlayHandler();
                confirmPlaySelection(key);
            });

            grid.appendChild(card);
            renderedCount++;
        } catch (err) {
            console.error('[gameday] Error rendering play card:', key, err);
        }
    }
    console.log(`[gameday] Rendered ${renderedCount} play cards for filter: ${currentFilter}`);
}

// ══════════════════════════════════════════════════════════════════════
// SCOREBUG & GAME STATE UI
// ══════════════════════════════════════════════════════════════════════
function getDownString() {
    const downs = ['', '1st', '2nd', '3rd', '4th'];
    const yard = Math.round(match.yardLine);
    const loc = yard < 50
        ? `OWN ${yard}`
        : yard === 50 ? '50 YD LINE'
        : `OPP ${100 - yard}`;
    return { down: `${downs[match.down]} & ${match.yardsToGo}`, loc };
}

function updateScorebug() {
    const { down, loc } = getDownString();
    const clockMins = Math.floor(match.clock / 60);
    const clockSecs = String(match.clock % 60).padStart(2, '0');

    const sbDown = document.getElementById('sb-down');
    const sbClock = document.getElementById('sb-clock');
    const pcoDown = document.getElementById('pco-down');
    const pcoLoc = document.getElementById('pco-location');
    const pcoGameClock = document.getElementById('pco-game-clock');
    const pcoPlayClock = document.getElementById('pco-play-clock');
    const sbScoreHome = document.getElementById('sb-score-home');
    const sbScoreAway = document.getElementById('sb-score-away');

    if (sbDown) sbDown.textContent = `${down} | ${loc}`;
    if (sbClock) sbClock.textContent = `Q${match.quarter} | ${clockMins}:${clockSecs}`;
    if (pcoDown) pcoDown.textContent = down;
    if (pcoLoc) pcoLoc.textContent = loc;
    if (pcoGameClock) pcoGameClock.textContent = `${clockMins}:${clockSecs}`;
    if (pcoPlayClock) pcoPlayClock.textContent = `${Math.round(match.playClock ?? 25)}s`;
    if (sbScoreHome) sbScoreHome.textContent = match.scoreHome;
    if (sbScoreAway) sbScoreAway.textContent = match.scoreAway;
}

function updateTimeoutDots() {
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`to-${i}`);
        if (dot) dot.classList.toggle('used', i > match.timeoutsHome);
    }
}

// ══════════════════════════════════════════════════════════════════════
// PLAY SIMULATION (client-side when backend is offline)
// ══════════════════════════════════════════════════════════════════════
let simTime = 0;
const SIM_SPEED = 0.07;

const DL_ROLES = ['DE1', 'DE2', 'DT1', 'DT2'];
const LB_ROLES = ['MLB', 'WLB', 'SLB'];
const DB_ROLES = ['CB1', 'CB2', 'FS', 'SS'];
const DEF_SPEED = 0.09;

// The backend engine assigns defenders a state (ZONE_DROP/ENGAGED) but never
// gives them a destination, so they never move there either — this gives the
// local sim its own lightweight reaction: DL close on the QB, LBs flow to the
// ball, DBs mirror the nearest eligible receiver.
function updateDefenseAI() {
    const qb = players.find(p => p.team === 'off' && p.role === 'QB');
    const offSkill = players.filter(p => p.team === 'off' && !['LT', 'LG', 'C', 'RG', 'RT', 'QB'].includes(p.role));

    players.forEach(p => {
        if (p.team !== 'def') return;

        let targetX = p.x, targetZ = p.z;
        const nearest = offSkill.reduce((best, o) => (!best || Math.abs(o.z - p.startZ) < Math.abs(best.z - p.startZ)) ? o : best, null);

        if (DL_ROLES.includes(p.role) && qb) {
            const engageX = p.startX + 2.5; // held up by the O-line
            targetX = Math.min(qb.x, engageX);
            targetZ = qb.z + (p.startZ - qb.z) * 0.6;
        } else if (LB_ROLES.includes(p.role)) {
            const flowing = simTime > 1.2 && nearest;
            targetX = flowing ? nearest.x + 4 : p.startX + 3;
            targetZ = flowing ? nearest.z : p.startZ;
        } else if (DB_ROLES.includes(p.role) && nearest) {
            targetX = nearest.x + 3;
            targetZ = nearest.z;
        }

        const dx = targetX - p.x;
        const dz = targetZ - p.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 0.05) {
            p.x += (dx / dist) * DEF_SPEED;
            p.z += (dz / dist) * DEF_SPEED;
            p.group.position.set(p.x, 0, p.z);
        }
    });
}

function simulationTick() {
    if (!match.playActive) return;
    simTime += SIM_SPEED;

    players.forEach(p => {
        if (!p.active || p.routeIdx >= p.route.length) return;

        const wp = p.route[p.routeIdx];
        const targetX = p.startX + wp.dx;
        const targetZ = p.startZ + (wp.dz || 0);

        const dx = targetX - p.x;
        const dz = targetZ - p.z;
        const dist = Math.hypot(dx, dz);

        const speed = 0.12;
        if (dist < 0.25) {
            p.routeIdx++;
        } else {
            p.x += (dx / dist) * speed;
            p.z += (dz / dist) * speed;
        }

        p.group.position.set(p.x, 0, p.z);
    });

    updateDefenseAI();

    // Ball bounce
    footballMesh.position.y = 0.42 + Math.abs(Math.sin(simTime * 3)) * 0.15;

    // Check play over
    if (simTime > 4.5) {
        endPlay();
    }
}

function endPlay() {
    match.playActive = false;
    simTime = 0;

    const hudSnapBtn = document.getElementById('hud-snap-btn');
    if (hudSnapBtn) hudSnapBtn.style.display = 'none';

    updateScorebug();

    // Re-show play overlay
    setTimeout(() => {
        const overlay = document.getElementById('playcall-overlay');
        if (overlay) overlay.classList.remove('hidden');
        selectedPlay = null;
        generatePlayers();
        buildPlayGrid(currentFilter);
    }, 1200);
}

// ══════════════════════════════════════════════════════════════════════
// CAMERA
// ══════════════════════════════════════════════════════════════════════
function updateCamera() {
    const camBtn = document.getElementById('camera-toggle-btn') || 
                   document.querySelector('.skycam-btn') || 
                   Array.from(document.querySelectorAll('button')).find(b => b && b.textContent && (b.textContent.includes('SkyCam') || b.textContent.includes('Broadcast') || b.textContent.includes('Cam')));

    if (camBtn) {
        const mode = CAMERA_MODES[currentCamIndex];
        const icons = { 'Broadcast': '📺', 'SkyCam': '🎥', 'Close-Up': '📹', 'Endzone': '🏟️' };
        camBtn.innerHTML = `${icons[mode.name] || '📺'} ${mode.name}`;
    }
}

// ══════════════════════════════════════════════════════════════════════
// RENDER LOOP WITH CAMERA SMOOTHING & LOS TRACKING
// ══════════════════════════════════════════════════════════════════════
let lastFrameTime = performance.now() / 1000;

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now() / 1000;
    const dt = Math.min(Math.max(now - lastFrameTime, 0.0005), 0.05);
    lastFrameTime = now;

    // LERP server positions for broadcast-smooth motion
    players.forEach(p => {
        if (p.targetPosition) {
            const px = p.x, pz = p.z;
            p.x = THREE.MathUtils.lerp(p.x, p.targetPosition.x, 0.2);
            p.z = THREE.MathUtils.lerp(p.z, p.targetPosition.z, 0.2);
            p.group.position.set(p.x, 0, p.z);
            if (p.targetRotation !== undefined) {
                p.group.rotation.y = THREE.MathUtils.lerp(p.group.rotation.y, p.targetRotation, 0.2);
            }
            // Speed from actual travel this frame drives the stride cycle
            p.speed = Math.hypot(p.x - px, p.z - pz) / dt;
        }
        if (p.group.userData.animate) p.group.userData.animate(dt, p.speed || 0);
    });

    simulationTick();

    // Interpolate Camera Position & Target LookAt relative to active LOS
    activeLOS = match.yardLine + 10;
    const mode = CAMERA_MODES[currentCamIndex];
    const targetCamPos = mode.pos(activeLOS);
    const targetLookAt = mode.look(activeLOS);

    camera.position.lerp(targetCamPos, 0.05);
    currentLookAt.lerp(targetLookAt, 0.05);
    if (Math.abs(camera.fov - mode.fov) > 0.05) {
        camera.fov += (mode.fov - camera.fov) * 0.08;
        camera.updateProjectionMatrix();
    }
    camera.lookAt(currentLookAt);

    // Keep the sun's shadow frustum over the action so shadows stay sharp
    if (environment.sun) {
        environment.sun.position.set(activeLOS + 45, 85, -35);
        environment.sun.target.position.set(activeLOS, 0, 26.65);
        environment.sun.target.updateMatrixWorld();
    }

    renderer.render(scene, camera);
}

// ══════════════════════════════════════════════════════════════════════
// EVENT LISTENERS & WEBSOCKET STREAM
// ══════════════════════════════════════════════════════════════════════

// Category pills
document.querySelectorAll('.cat-pill, .sub-tab-btn').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill, .sub-tab-btn').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        buildPlayGrid(pill.dataset.cat || pill.dataset.category || 'ALL');
    });
});

function confirmPlaySelection(key) {
    if (!key) return;
    selectedPlay = key;
    alignPlayersPreSnap(key);

    // Hide play call overlay
    const overlay = document.getElementById('playcall-overlay');
    if (overlay) overlay.classList.add('hidden');

    // Show floating SNAP button in bottom-right corner of field
    const hudSnapBtn = document.getElementById('hud-snap-btn');
    if (hudSnapBtn) {
        hudSnapBtn.style.display = 'flex';
        const playObj = PLAYBOOK[key];
        const pName = playObj ? (playObj.name || playObj.play_name || `PLAY ${key}`) : `PLAY ${key}`;
        hudSnapBtn.innerHTML = `<span style="font-size:20px;">🏈</span> SNAP: ${pName.toUpperCase()}`;
    }

    // Send PRE_SNAP command to WebSocket
    if (window.gamedayWS?.readyState === WebSocket.OPEN) {
        window.gamedayWS.send(JSON.stringify({ command: 'PRE_SNAP', play_id: key }));
    }
}

// Floating Bottom-Right Corner Snap button
const hudSnapBtn = document.getElementById('hud-snap-btn');
if (hudSnapBtn) {
    hudSnapBtn.addEventListener('click', () => {
        if (!selectedPlay) return;
        hudSnapBtn.style.display = 'none';
        match.playActive = true;
        simTime = 0;

        if (window.gamedayWS?.readyState === WebSocket.OPEN) {
            window.gamedayWS.send(JSON.stringify({ command: 'SNAP', action: 'SNAP', play_name: selectedPlay }));
        }
    });
}

// No-huddle
const noHuddleBtn = document.getElementById('no-huddle-btn');
if (noHuddleBtn) {
    noHuddleBtn.addEventListener('click', () => {
        const keys = Object.keys(PLAYBOOK);
        selectedPlay = keys[Math.floor(Math.random() * keys.length)];
        alignPlayersPreSnap(selectedPlay);
        const overlay = document.getElementById('playcall-overlay');
        if (overlay) overlay.classList.add('hidden');
        match.playActive = true;
        simTime = 0;

        if (window.gamedayWS?.readyState === WebSocket.OPEN) {
            window.gamedayWS.send(JSON.stringify({ command: 'SNAP', action: 'SNAP', play_name: selectedPlay }));
        }
    });
}

// Camera toggle
const camBtn = document.getElementById('camera-toggle-btn') || 
               document.querySelector('.skycam-btn') || 
               Array.from(document.querySelectorAll('button')).find(b => b && b.textContent && (b.textContent.includes('SkyCam') || b.textContent.includes('Broadcast') || b.textContent.includes('Cam')));

if (camBtn) {
    camBtn.addEventListener('click', () => {
        currentCamIndex = (currentCamIndex + 1) % CAMERA_MODES.length;
        updateCamera();
    });
}

// Telemetry Inspector Toggle & Fetch Replays
const telemToggleBtn = document.getElementById('telemetry-toggle-btn');
const telemOverlay = document.getElementById('telemetry-inspector-overlay');
const telemFetchBtn = document.getElementById('telemetry-fetch-replays-btn');
const telemWarningsList = document.getElementById('telemetry-warnings-list');

if (telemToggleBtn && telemOverlay) {
    telemToggleBtn.addEventListener('click', () => {
        const isHidden = telemOverlay.style.display === 'none' || !telemOverlay.style.display;
        telemOverlay.style.display = isHidden ? 'flex' : 'none';
        telemToggleBtn.style.background = isHidden ? '#0284c7' : '#1e3a5f';
        if (isHidden && telemFetchBtn) {
            telemFetchBtn.click();
        }
    });
}

if (telemFetchBtn && telemWarningsList) {
    telemFetchBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/telemetry/replays');
            const data = await res.json();
            telemWarningsList.innerHTML = '';
            if (data.replays && data.replays.length > 0) {
                data.replays.forEach(r => {
                    const item = document.createElement('div');
                    item.style.cssText = 'background:rgba(30,41,59,0.85); border:1px solid rgba(59,130,246,0.3); border-radius:6px; padding:8px 10px; color:#e2e8f0; font-size:11px; display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;';
                    const playTitle = r.metadata.play_name || (r.metadata.play_id ? `Play #${r.metadata.play_id}` : r.filename);
                    const playType = r.metadata.play_type ? ` [${r.metadata.play_type}]` : '';
                    item.innerHTML = `<div><strong style="color:#38bdf8; font-size:12px;">🏈 ${playTitle}${playType}</strong><br><span style="color:#94a3b8; font-size:10px;">${r.filename} | Ticks: ${r.metadata.total_ticks || 0} | Anomalies: ${r.metadata.anomaly_count || 0}</span></div><a href="/api/telemetry/replay/${r.filename}" download="${r.filename}" target="_blank" style="background:#0284c7; color:#fff; padding:4px 8px; border-radius:4px; text-decoration:none; font-weight:700; font-size:10px;">⬇ JSON</a>`;
                    telemWarningsList.appendChild(item);
                });
            } else {
                telemWarningsList.innerHTML = '<div style="color:#64748b; font-size:11px; text-align:center; padding:12px 0;">No replay files found.</div>';
            }
        } catch (err) {
            console.error('Error fetching replays:', err);
        }
    });
}

// Timeout
const timeoutBtn = document.getElementById('timeout-btn');
if (timeoutBtn) {
    timeoutBtn.addEventListener('click', () => {
        if (match.timeoutsHome <= 0) return;
        match.timeoutsHome--;
        updateTimeoutDots();
        const modal = document.getElementById('timeout-modal');
        if (modal) {
            modal.classList.add('show');
            const countEl = document.getElementById('to-remaining-count');
            if (countEl) countEl.textContent = match.timeoutsHome;
        }
    });
}
const toDismiss = document.getElementById('to-dismiss-btn');
if (toDismiss) {
    toDismiss.addEventListener('click', () => {
        const modal = document.getElementById('timeout-modal');
        if (modal) modal.classList.remove('show');
    });
}

// Window resize
window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// NOTE: The frontend PLAYBOOK and the backend PLAY_DATABASE both now load
// from the same shared/playbook.json catalog (see server/routes/playbook.py
// and engine/playbook3d.js), so play ids/names/alignment roles match and the
// PRE_SNAP handshake (sent on play-card click, see buildPlayGrid) resolves
// to the correct play on the backend.
const BACKEND_TELEMETRY_ENABLED = true;

if (BACKEND_TELEMETRY_ENABLED) {
    try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.host || 'localhost:3000';
        // DB team codes are real NFL abbreviations (e.g. "NO" for Saints);
        // "SAINTS" doesn't exist so the server closed the socket every time.
        const ws = new WebSocket(`${wsProtocol}//${wsHost}/ws/match/NO`);
        ws.binaryType = 'arraybuffer';
        window.gamedayWS = ws;

        const playClockEl = document.getElementById('play-clock-display');
        const penaltyToast = document.getElementById('penalty-toast');
        const penaltyText = document.getElementById('penalty-text');

        const OFF_ROLES = ['C', 'OG1', 'OG2', 'OT1', 'OT2', 'QB', 'RB', 'TE', 'WR1', 'WR2', 'WR3'];
        const DEF_ROLES = ['DT1', 'DT2', 'DE1', 'DE2', 'MLB', 'WLB', 'SLB', 'CB1', 'CB2', 'FS', 'SS'];
        const rosterManifest = {};

        ws.onopen = () => console.log('🏈 Backend 60Hz match stream connected.');
        ws.onerror = () => console.warn('Backend offline — running local standalone simulation.');

        ws.onmessage = (event) => {
            try {
                // A. BINARY TELEMETRY FRAME (60Hz server coordinates)
                if (event.data instanceof ArrayBuffer) {
                    const view = new DataView(event.data);

                    // 1. 16-Byte Header: Game Clock (f32), Play Clock (f32), LOS (f32), Down (u8), Distance (u8)
                    const gameClock = view.getFloat32(0, true);
                    const playClock = view.getFloat32(4, true);
                    const los = view.getFloat32(8, true);
                    const down = view.getUint8(12);
                    const distance = view.getUint8(13);

                    if (playClockEl) {
                        playClockEl.textContent = Math.ceil(playClock);
                        playClockEl.style.color = playClock <= 5 ? '#ef4444' : '#ffffff';
                    }
                    match.down = down;
                    match.yardsToGo = distance;
                    match.yardLine = los;
                    match.clock = Math.max(0, Math.floor(gameClock));
                    updateScorebug();

                    // 2. 12-Byte Football Vector: bx, by, bz (offset 16)
                    const bx = view.getFloat32(16, true);
                    const by = view.getFloat32(20, true);
                    const bz = view.getFloat32(24, true);

                    // Add +10 End Zone offset to convert raw yardline to 3D field X coordinate
                    const bx3d = bx + 10.0;
                    if (footballMesh) {
                        footballMesh.position.set(bx3d, Math.max(0.42, by), bz);
                    }

                    // 3. 20-Byte Player Vectors: id (u16), px/py/pz (f32), pyaw (f32), state (u8) (offset 28)
                    let offset = 28;
                    let idx = 0;
                    while (offset + 20 <= event.data.byteLength) {
                        const p_id = view.getUint16(offset, true);
                        const px = view.getFloat32(offset + 2, true);
                        const pz = view.getFloat32(offset + 10, true);
                        const pyaw = view.getFloat32(offset + 14, true);
                        const state = view.getUint8(offset + 18);

                        // Convert raw yardline to 3D field X coordinate (+10 End Zone offset)
                        const px3d = px + 10.0;

                        // Prefer the roster manifest's role/team mapping; fall back to
                        // positional OFF/DEF role order, then raw array index.
                        const manifestEntry = rosterManifest[p_id];
                        let localPlayer = manifestEntry
                            ? players.find(p => p.role === manifestEntry.role && p.team === manifestEntry.team)
                            : null;
                        if (!localPlayer) {
                            const targetRole = idx < 11 ? OFF_ROLES[idx] : (idx < 22 ? DEF_ROLES[idx - 11] : null);
                            const targetTeam = idx < 11 ? 'off' : 'def';
                            localPlayer = players.find(p => p.role === targetRole && p.team === targetTeam) || players[idx];
                        }

                        if (localPlayer) {
                            localPlayer.targetPosition = { x: px3d, z: pz };
                            localPlayer.targetRotation = pyaw;
                            localPlayer.state = state;
                        }
                        offset += 20;
                        idx++;
                    }
                    return;
                }

                // B. JSON EVENT/CONTROL FRAMES
                const payload = JSON.parse(event.data);

                if (payload.type === 'ROSTER_MANIFEST' && Array.isArray(payload.players)) {
                    payload.players.forEach(p => {
                        rosterManifest[p.id] = { role: p.role, team: p.team, str_id: p.str_id };
                    });
                    return;
                }

                if (payload.type === 'PENALTY') {
                    console.warn(payload.description);
                    if (penaltyToast && penaltyText) {
                        penaltyText.textContent = `⚠️ PENALTY: ${payload.description}`;
                        penaltyToast.style.display = 'block';
                        setTimeout(() => { penaltyToast.style.display = 'none'; }, 3500);
                    }
                    if (payload.los !== undefined) {
                        match.yardLine = payload.los;
                        losMesh.position.x = match.yardLine + 10;
                        updateScorebug();
                    }
                } else if (payload.type === 'TELEMETRY_DIAGNOSTICS' && payload.warning) {
                    console.warn('⚠️ Telemetry Anomaly:', payload.warning);
                    const warningsList = document.getElementById('telemetry-warnings-list');
                    if (warningsList) {
                        const item = document.createElement('div');
                        item.style.cssText = 'background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4); border-radius:4px; padding:6px 8px; color:#fca5a5; font-size:10px; line-height:1.4;';
                        item.innerHTML = `<strong>[Tick ${payload.warning.tick}] ${payload.warning.type}:</strong> ${payload.warning.message}`;
                        warningsList.prepend(item);
                    }
                } else if (payload.type === 'PLAY_COMPLETE') {
                    console.log('💾 Play Telemetry Exported:', payload.replay_file);
                    if (penaltyToast && penaltyText) {
                        penaltyText.textContent = `💾 Telemetry saved: ${payload.replay_file}`;
                        penaltyToast.style.display = 'block';
                        setTimeout(() => { penaltyToast.style.display = 'none'; }, 3000);
                    }
                } else if (payload.type === 'PRE_SNAP_READY') {
                    console.log('✅ Backend engine aligned and ready for snap.');
                } else if (payload.type === 'DRIVE_UPDATE') {
                    // Backend is the authority on down/distance/los/score once a play resolves
                    match.scoreHome = payload.offense_score ?? match.scoreHome;
                    match.scoreAway = payload.defense_score ?? match.scoreAway;
                    match.down = payload.down ?? match.down;
                    match.yardsToGo = payload.distance ?? match.yardsToGo;
                    match.yardLine = payload.los ?? match.yardLine;
                    updateScorebug();

                    // Update Play History with REAL yards gained from engine physics
                    const historyList = document.getElementById('play-history-list');
                    if (historyList) {
                        const yg = payload.yards_gained ?? 0;
                        const ygStr = yg >= 0 ? `+${yg} YDS` : `${yg} YDS`;
                        const playObj = PLAYBOOK[selectedPlay] || {};
                        const playName = playObj.name || payload.play_name || 'Play';
                        const playType = playObj.type || 'RUN';

                        const entry = document.createElement('div');
                        entry.style.cssText = 'font-size:11px;padding:5px 8px;background:rgba(255,255,255,0.04);border-radius:5px;border-left:3px solid ' + (yg >= 0 ? '#4ade80' : '#f87171');
                        entry.innerHTML = `<div style="color:#fff;font-weight:700;">${playName}</div><div style="color:${yg >= 0 ? '#4ade80' : '#f87171'};font-size:10px;">${ygStr} · ${playType}</div>`;
                        historyList.insertBefore(entry, historyList.firstChild);
                        const noPlays = historyList.querySelector('div[style*="color:#334155"]');
                        if (noPlays) noPlays.remove();
                    }

                    const EVENT_LABELS = {
                        TOUCHDOWN: '🏈 TOUCHDOWN!',
                        SAFETY: '🛡️ SAFETY!',
                        INTERCEPTION: '🔄 INTERCEPTED!',
                        FIRST_DOWN: '✅ FIRST DOWN',
                        TURNOVER_ON_DOWNS: '🔄 TURNOVER ON DOWNS',
                        INCOMPLETE: 'INCOMPLETE PASS',
                        TACKLED: null, // routine tackle -- not worth a toast
                    };
                    const label = EVENT_LABELS[payload.event];
                    if (label && penaltyToast && penaltyText) {
                        penaltyText.textContent = label;
                        penaltyToast.style.display = 'block';
                        setTimeout(() => { penaltyToast.style.display = 'none'; }, 2500);
                    }
                } else if (payload.type === 'PLAY_END') {
                    endPlay();
                }
            } catch (e) {
                console.error('Error processing websocket frame:', e);
            }
        };
    } catch (e) {
        console.warn('WebSocket init error:', e);
    }
}

// ══════════════════════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════════════════════
generatePlayers();
updateScorebug();
updateTimeoutDots();
updateCamera();
animate();

// Build play grid immediately with embedded catalog
buildPlayGrid('ALL');

// Re-build play grid if catalog updates asynchronously
if (playbookReady && typeof playbookReady.then === 'function') {
    playbookReady.then(() => {
        buildPlayGrid('ALL');
    }).catch(err => {
        console.error('[gameday] Playbook load failed:', err);
    });
}
