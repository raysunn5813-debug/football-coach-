import { PlaySimulation } from '../../engine/simulation/simulation.js';
import { PhysicsEngine } from '../../engine/physics/PhysicsEngine.js';
import { getPlayList, OFFENSIVE_PLAYBOOKS, DEFENSIVE_PLAYBOOKS } from '../../engine/simulation/plays.js';
import { ThreeRenderer } from './renderers/ThreeRenderer.js';
import { FilmRoom } from './ui/film.js';
import { PlaybookUI } from './ui/playbook_ui.js';
import { renderTeamRoster } from './ui/roster.js';
import { renderStandings } from './ui/standings.js';
import { renderStatLeaders } from './ui/stats.js';
import { renderFreeAgents } from './ui/free_agents.js';
import { renderPlaybookPreview } from './dashboard.js';
import { renderFatigueGrowth } from './practice.js';
import { renderStaffMarketplace } from './staff.js';

/**
 * main_new.js
 * Upgraded Game Engine Bootstrap
 * Features: High-DPI Canvas, Fixed-Delta Accumulator, Input Handling, Debug HUD, Dashboard Integration
 */

// --- Global Engine State ---
const ENGINE = {
    canvas: null,
    ctx: null,
    simulation: null,
    isRunning: false,
    isPaused: false,
    showDebugHUD: false, // Default hidden on dashboard
    lastTime: 0,
    accumulator: 0,
    physicsTick: 0.03, // 30ms targeting ~33.3Hz
    
    // Debug Stats
    fps: 0,
    frames: 0,
    lastFpsTime: 0,
    
    // Input State
    keys: {},
    touch: { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 },
    
    // Playbooks
    offPlaybook: 'seahawks_2000',
    defPlaybook: 'std_43'
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
    initCanvas();
    initInput();
    initDebugHUD();
    initUIModules();
    
    // Start Engine
    resetPlay();
    resume();
});

function initUIModules() {
    if (document.getElementById('film-canvas')) {
        try {
            ENGINE.filmRoom = new FilmRoom();
        } catch (e) {
            console.warn("FilmRoom init skipped:", e);
        }
    }
    if (document.getElementById('play-grid')) {
        try {
            ENGINE.playbookUI = new PlaybookUI(OFFENSIVE_PLAYBOOKS, (selectedPlay) => {
                console.log("Play selected from UI:", selectedPlay);
            });
        } catch (e) {
            console.warn("PlaybookUI init skipped:", e);
        }
    }
}

// --- Dashboard & Playbook UI Integration ---
function initDashboard() {
    // 0. Render Dynamic Data
    renderTeamRoster();
    renderStandings();
    renderStatLeaders();
    renderFreeAgents();
    renderPlaybookPreview();
    renderFatigueGrowth();
    renderStaffMarketplace();

    // 1. Populate Playbook Dropdowns
    const offSelect = document.getElementById('offense-scheme-select') || document.getElementById('off-playbook-select');
    const defSelect = document.getElementById('defense-scheme-select') || document.getElementById('def-playbook-select');
    
    if (offSelect) {
        offSelect.addEventListener('change', (e) => {
            ENGINE.offPlaybook = e.target.value;
        });
    }
    
    if (defSelect) {
        defSelect.addEventListener('change', (e) => {
            ENGINE.defPlaybook = e.target.value;
        });
    }

    // 2. Bind Navigation Sidebar
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show target screen
            const target = btn.getAttribute('data-target');
            screens.forEach(s => s.classList.remove('active'));
            const targetScreen = document.getElementById(`screen-${target}`);
            if (targetScreen) targetScreen.classList.add('active');

            // Redirect to dedicated gameday.html for live broadcast view
            if (target === 'gameday') {
                saveActiveMatchData();
                window.location.href = 'gameday.html';
                return;
            } else {
                document.body.classList.remove('in-game-mode');
            }

            if (typeof resizeCanvas === 'function') {
                resizeCanvas();
            }
        });
    });

    // 3. Main Dashboard Buttons
    const startGamedayBtn = document.getElementById('go-to-gameday-btn');
    if (startGamedayBtn) {
        startGamedayBtn.style.display = 'block'; // Make it visible
        startGamedayBtn.addEventListener('click', () => {
            saveActiveMatchData();
            window.location.href = 'gameday.html';
        });
    }

    // Kickoff button in gameday overlay
    const kickoffBtn = document.getElementById('kickoff-match-btn');
    if (kickoffBtn) {
        kickoffBtn.addEventListener('click', () => {
            saveActiveMatchData();
            window.location.href = 'gameday.html';
        });
    }
}

function saveActiveMatchData() {
    const matchData = {
        myTeam: { name: "Saints" },
        oppTeam: { name: "Patriots" },
        myOffBook: ENGINE.offPlaybook || 'seahawks_2000',
        myDefBook: ENGINE.defPlaybook || 'std_43',
        oppOffBook: 'patriots_2000',
        oppDefBook: 'std_34',
        week: 1,
        myRecord: "1-1",
        oppRecord: "0-2"
    };
    try {
        localStorage.setItem('activeMatchData', JSON.stringify(matchData));
    } catch (e) {
        console.warn("Could not save activeMatchData to localStorage", e);
    }
}

function initCanvas() {
    ENGINE.canvas = document.getElementById('game-canvas');
    if (!ENGINE.canvas) {
        // Fallback if not found in DOM
        ENGINE.canvas = document.createElement('canvas');
        ENGINE.canvas.id = 'game-canvas';
        ENGINE.canvas.style.display = 'none'; // Hide legacy 2D canvas on dashboard
        document.body.appendChild(ENGINE.canvas);
    }
    
    ENGINE.ctx = ENGINE.canvas.getContext('2d');
    
    window.addEventListener('resize', debounce(resizeCanvas, 100));
    resizeCanvas();
}

function resizeCanvas() {
    const container = ENGINE.canvas.parentElement || document.body;
    
    // Auto-resize to match container
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    
    // Handle High-DPI Displays (Retina, 4k)
    const dpr = window.devicePixelRatio || 1;
    
    ENGINE.canvas.width = width * dpr;
    ENGINE.canvas.height = height * dpr;
    
    ENGINE.canvas.style.width = `${width}px`;
    ENGINE.canvas.style.height = `${height}px`;
    
    ENGINE.ctx.scale(dpr, dpr);
}

// --- Input Handling ---
function initInput() {
    window.addEventListener('keydown', (e) => {
        ENGINE.keys[e.code] = true;
        if (e.code === 'KeyD') {
            ENGINE.showDebugHUD = !ENGINE.showDebugHUD; // Toggle HUD
        }
        if (e.code === 'KeyP') {
            if (ENGINE.isPaused) resume(); else pause();
        }
        if (e.code === 'Space') {
            // Trigger snap / action
            if (ENGINE.simulation && ENGINE.simulation.preSnap) {
                ENGINE.simulation.update(0.01); // trigger initial update
                console.log("Ball Snapped!");
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        ENGINE.keys[e.code] = false;
    });

    // Touch Support
    ENGINE.canvas.addEventListener('touchstart', (e) => {
        ENGINE.touch.active = true;
        ENGINE.touch.startX = e.touches[0].clientX;
        ENGINE.touch.startY = e.touches[0].clientY;
    }, { passive: true });

    ENGINE.canvas.addEventListener('touchmove', (e) => {
        if (!ENGINE.touch.active) return;
        ENGINE.touch.currentX = e.touches[0].clientX;
        ENGINE.touch.currentY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        ENGINE.touch.active = false;
    });
}

// --- Engine Diagnostics (Debug HUD) ---
function initDebugHUD() {
    const hud = document.createElement('div');
    hud.id = 'debug-hud';
    hud.style.position = 'absolute';
    hud.style.top = '10px';
    hud.style.left = '10px';
    hud.style.color = '#00ff00';
    hud.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    hud.style.padding = '10px';
    hud.style.fontFamily = 'monospace';
    hud.style.fontSize = '12px';
    hud.style.zIndex = '9999';
    hud.style.pointerEvents = 'none';
    document.body.appendChild(hud);
}

function updateHUD() {
    if (!ENGINE.showDebugHUD) {
        document.getElementById('debug-hud').style.display = 'none';
        return;
    }
    
    const hud = document.getElementById('debug-hud');
    hud.style.display = 'block';
    
    let stats = `FPS: ${ENGINE.fps}\n`;
    stats += `Physics Tick: ${ENGINE.physicsTick * 1000}ms\n`;
    
    if (ENGINE.simulation) {
        stats += `Phase: ${ENGINE.simulation.isPlayActive ? 'LIVE' : 'FINISHED'}\n`;
        stats += `Time: ${ENGINE.simulation.time.toFixed(1)}s\n`;
        
        if (ENGINE.simulation.physics) {
            stats += `Entities: ${ENGINE.simulation.physics.entities.length}\n`;
        }
        
        if (ENGINE.simulation.ball) {
            stats += `Ball Airborne: ${ENGINE.simulation.ball.isAirborne}\n`;
            stats += `Ball Z-Height: ${ENGINE.simulation.ball.z.toFixed(2)}m\n`;
        }
    }
    
    hud.innerText = stats;
}

// --- Lifecycle State Controllers ---
export function pause() {
    ENGINE.isPaused = true;
    console.log("Engine Paused.");
}

export function resume() {
    if (ENGINE.isPaused) {
        ENGINE.isPaused = false;
        ENGINE.lastTime = performance.now(); // Prevent large delta on resume
        requestAnimationFrame(gameLoop);
        console.log("Engine Resumed.");
    } else if (!ENGINE.isRunning) {
        ENGINE.isRunning = true;
        ENGINE.lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

export function resetPlay() {
    console.log("Initializing Play Simulation...");
    
    // Load playbooks based on UI selection
    const offPlays = getPlayList(ENGINE.offPlaybook, 'offense');
    const defPlays = getPlayList(ENGINE.defPlaybook, 'defense');
    
    const activeOffPlay = offPlays ? offPlays[0] : { type: 'PASS', name: 'Hail Mary', formation: { QB: {x:-5, y:0}, WR: {x:0, y:-15}, RB: {x:-5, y:5} } };
    const activeDefPlay = defPlays ? defPlays[0] : { type: 'COVER_3', name: 'Prevent' };
    
    ENGINE.simulation = new PlaySimulation(
        activeOffPlay, 
        activeDefPlay, 
        { name: "My Team" }, 
        { name: "Opp Team" }, 
        20 // Start at 20 yard line
    );
}

// --- Main Game Loop (Fixed Delta Accumulator) ---
function gameLoop(now) {
    if (!ENGINE.isRunning || ENGINE.isPaused) return;

    // Calculate elapsed time (cap at 0.25s to avoid spiral of death)
    let frameTime = (now - ENGINE.lastTime) / 1000;
    if (frameTime > 0.25) frameTime = 0.25;
    ENGINE.lastTime = now;

    ENGINE.accumulator += frameTime;

    // Physics / Logic Update (Fixed Tick)
    while (ENGINE.accumulator >= ENGINE.physicsTick) {
        if (ENGINE.simulation) {
            ENGINE.simulation.update(ENGINE.physicsTick);
        }
        ENGINE.accumulator -= ENGINE.physicsTick;
    }

    // FPS Counter
    ENGINE.frames++;
    if (now - ENGINE.lastFpsTime >= 1000) {
        ENGINE.fps = ENGINE.frames;
        ENGINE.frames = 0;
        ENGINE.lastFpsTime = now;
    }

    // Render Update (Interpolation could be added here)
    render();
    
    // Diagnostics update
    updateHUD();

    requestAnimationFrame(gameLoop);
}

// --- Minimal Rendering (Standalone Test Fallback) ---
// We now use CanvasRenderer

function render() {
    if (!ENGINE.simulation) return;
    
    // Initialize renderer if not exists
    if (!ENGINE.renderer) {
        // 3D Three.js renderer — uses global THREE from CDN
        ENGINE.renderer = new ThreeRenderer('game-container');
    }
    
    // Determine camera X based on ball or LOS
    let camX = ENGINE.simulation.lineOfScrimmage || 20;
    if (ENGINE.simulation.ball && ENGINE.simulation.ball.position) {
        camX = ENGINE.simulation.ball.position.x - 40; // Follow ball, keep it near center-left
    }
    
    const matchState = {
        yardLine: ENGINE.simulation.lineOfScrimmage || 20,
        firstDownYardLine: (ENGINE.simulation.lineOfScrimmage || 20) + 10
    };

    ENGINE.renderer.drawField(matchState, camX);
    
    // Pre-snap overlay (routes)
    if (ENGINE.simulation.preSnap && ENGINE.simulation.offPlay) {
        ENGINE.renderer.drawPreSnapOverlay(ENGINE.simulation.offPlay, false, ENGINE.simulation.lineOfScrimmage, camX);
    }
    
    // Format players for renderer
    const renderPlayers = ENGINE.simulation.players.map(p => ({
        x: p.position.x,
        y: p.position.y,
        type: p.type,
        team: p.team,
        state: p.state || (ENGINE.simulation.ball && ENGINE.simulation.ball.carrier === p ? "ball_carrier" : "idle"),
        vx: p.velocity.x,
        vy: p.velocity.y,
        blockTimer: p.blockTimer || 0
    }));
    
    let ballCarrierPlayer = null;
    if (ENGINE.simulation.ball && ENGINE.simulation.ball.carrier) {
        ballCarrierPlayer = renderPlayers.find(rp => rp.type === ENGINE.simulation.ball.carrier.type && rp.team === ENGINE.simulation.ball.carrier.team);
    }

    if (ENGINE.simulation.referees) {
        ENGINE.simulation.referees.forEach(ref => ENGINE.renderer.drawReferee(ref, camX));
    }
    
    ENGINE.renderer.drawPlayers(renderPlayers, camX, "#3b82f6", "#ef4444", ballCarrierPlayer);
    
    if (ENGINE.simulation.ball) {
        const renderBall = {
            x: ENGINE.simulation.ball.position.x,
            y: ENGINE.simulation.ball.position.y,
            z: ENGINE.simulation.ball.z,
            vx: ENGINE.simulation.ball.velocity.x,
            vy: ENGINE.simulation.ball.velocity.y,
            state: ENGINE.simulation.ball.state
        };
        ENGINE.renderer.drawBall(renderBall, camX);
    }
    
    ENGINE.renderer.updateParticles(ENGINE.physicsTick);
    ENGINE.renderer.drawParticles(camX);
}

// Utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
