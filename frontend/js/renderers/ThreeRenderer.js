/**
 * ThreeRenderer.js — Broadcast-quality 3D Game Field Renderer
 *
 * Target look: a real TV broadcast frame — telephoto sideline camera, painted
 * turf (mow stripes, yard numbers, hash marks, endzone lettering, midfield
 * logo), stepped grandstands with a crowd, real goalposts on the end line, and
 * animated human player figures with jersey numbers.
 *
 * Uses the global THREE loaded via CDN (three r128) in index.html / gameday.html.
 * The public API is unchanged from the previous version so app.js can keep
 * calling it as-is:
 *
 *   new ThreeRenderer(mountElementId)
 *   drawField(matchState, camX) · drawPlayers(list, camX, offColor, defColor, carrier)
 *   drawBall(ball) · drawReferee(ref, camX) · drawPreSnapOverlay(play, flip, los, camX)
 *   addTackleBurst(x, y) · addTouchdownFireworks(x, y) · updateParticles(dt)
 *   drawParticles() · render() · setCameraMode(mode)
 *
 * The scene-building pieces are also exported on their own so other pages
 * (gameday.js) can drop the same visuals into an existing THREE.Scene:
 *
 *   buildBroadcastEnvironment(scene, renderer, opts)
 *   createPlayerFigure(cfg) · createFootball() · CAMERA_PRESETS
 *
 * World units are yards. The field runs along +x (0 = back of the left end
 * zone, 120 = back of the right end zone); width runs along z (0 → 53.3).
 */

const TAU = Math.PI * 2;

export const FIELD = {
    LEN: 120, WID: 53.3, EZ: 10,
    CX: 60, CZ: 26.65,
    HASH_NEAR: 20, HASH_FAR: 33.3,   // NCAA hashes: 20 yd in from each sideline
};

// Painted surface (playing field + green apron) covered by one turf texture.
// W / D is kept at exactly 2:1 so the power-of-two texture has square pixels.
const TURF = { W: 136, D: 68, X0: -8, Z0: -7.35 };

const DEFAULT_TEAMS = {
    home: { name: 'HOME',    primary: '#14306e', secondary: '#f5c518' },
    away: { name: 'VISITOR', primary: '#7a1524', secondary: '#e8e8ea' },
};

// ═════════════════════════════════════════════════════════════════════════
// SMALL HELPERS
// ═════════════════════════════════════════════════════════════════════════

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** Deterministic PRNG so the turf/crowd look identical on every load. */
function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Shift a hex colour toward black (f<1) or white (f>1). */
function shade(hex, f) {
    const c = new THREE.Color(hex);
    if (f <= 1) c.multiplyScalar(f);
    else c.lerp(new THREE.Color(0xffffff), Math.min(1, f - 1));
    return '#' + c.getHexString();
}

function srgb(tex) {
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}

/** Shortest-path angle lerp (avoids the ±π spin the old renderer had). */
function lerpAngle(a, b, t) {
    let d = (b - a) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return a + d * t;
}

// ═════════════════════════════════════════════════════════════════════════
// TURF TEXTURE — the single biggest visual win: every painted marking is
// baked into one anisotropically-filtered texture instead of dozens of
// coplanar quads, so lines stay crisp and never z-fight.
// ═════════════════════════════════════════════════════════════════════════

function makeTurfTexture(teams, resolution) {
    const W = resolution;
    const H = resolution / 2;
    const S = W / TURF.W;                    // px per yard (uniform in x and z)

    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');

    const px = wx => (wx - TURF.X0) * S;
    const pz = wz => (wz - TURF.Z0) * S;
    const box = (x, z, w, d, fill) => {
        g.fillStyle = fill;
        g.fillRect(px(x), pz(z), w * S, d * S);
    };

    const GRASS_A = '#46853a';   // mown "with the grain"
    const GRASS_B = '#3a7030';   // mown against it
    const APRON   = '#316328';
    const PAINT   = '#eef2ee';

    // ── base grass + 5-yard mow stripes ─────────────────────────────────
    g.fillStyle = APRON;
    g.fillRect(0, 0, W, H);
    for (let x = -10; x < 130; x += 5) {
        box(x, TURF.Z0, 5, TURF.D, (Math.round(x / 5) % 2) ? GRASS_A : GRASS_B);
    }
    // Faint cross-mow so the turf reads as a checker at distance, like a
    // freshly cut college field.
    for (let z = -10; z < 62; z += 6.65) {
        g.fillStyle = (Math.round(z / 6.65) % 2) ? 'rgba(255,255,255,0.035)'
                                                 : 'rgba(0,0,0,0.035)';
        g.fillRect(0, pz(z), W, 6.65 * S);
    }

    // ── mottling / wear ─────────────────────────────────────────────────
    const rand = rng(20260728);
    for (let i = 0; i < 5200; i++) {
        const x = rand() * W, y = rand() * H;
        const r = (2 + rand() * 12) * (S / 30);
        g.fillStyle = rand() < 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.05)';
        g.beginPath();
        g.ellipse(x, y, r * (1.4 + rand()), r, rand() * Math.PI, 0, TAU);
        g.fill();
    }
    // Scuffed lane between the hashes where the ball actually gets played.
    for (let i = 0; i < 700; i++) {
        const x = 12 + rand() * 96;
        const z = FIELD.HASH_NEAR - 3 + rand() * (FIELD.HASH_FAR - FIELD.HASH_NEAR + 6);
        g.fillStyle = `rgba(96,74,42,${0.015 + rand() * 0.025})`;
        g.beginPath();
        g.ellipse(px(x), pz(z), (2 + rand() * 5) * (S / 30), (1.5 + rand() * 3) * (S / 30),
                  rand() * Math.PI, 0, TAU);
        g.fill();
    }

    // ── text helper (draws flat-on-the-ground lettering) ────────────────
    // capYd  = cap height in yards
    // rot    = rotation of the glyph baseline in texture space
    // maxYd  = optional span limit; the string is squeezed to fit
    const drawText = (text, wx, wz, capYd, rot, fill, opts = {}) => {
        const size = (capYd * S) / 0.72;         // Arial Black cap-height ratio
        g.save();
        g.translate(px(wx), pz(wz));
        g.rotate(rot);
        g.font = `900 ${size}px "Arial Black", Impact, "Arial Bold", sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'alphabetic';
        let sx = opts.squeeze !== undefined ? opts.squeeze : 0.8;
        if (opts.maxYd) {
            const w = g.measureText(text).width * sx;
            if (w > opts.maxYd * S) sx *= (opts.maxYd * S) / w;
        }
        g.scale(sx, 1);
        if (opts.outline) {
            g.lineWidth = size * 0.09;
            g.strokeStyle = opts.outline;
            g.lineJoin = 'round';
            g.strokeText(text, 0, capYd * S * 0.5);
        }
        g.fillStyle = fill;
        g.fillText(text, 0, capYd * S * 0.5);
        g.restore();
    };

    // ── end zones ───────────────────────────────────────────────────────
    // Painted at 0.88 alpha so the mow pattern still shows through the paint.
    [
        { x0: 0,   team: teams.home, rot:  Math.PI / 2 },
        { x0: 110, team: teams.away, rot: -Math.PI / 2 },
    ].forEach(({ x0, team, rot }) => {
        g.globalAlpha = 0.88;
        box(x0, 0, FIELD.EZ, FIELD.WID, team.primary);
        g.globalAlpha = 1;
        // Darker inner shading top and bottom for a little depth
        g.globalAlpha = 0.18;
        box(x0, 0, FIELD.EZ, 4, '#000000');
        box(x0, FIELD.WID - 4, FIELD.EZ, 4, '#000000');
        g.globalAlpha = 1;
        drawText(team.name.toUpperCase(), x0 + FIELD.EZ / 2, FIELD.CZ, 6, rot,
                 PAINT, { outline: shade(team.secondary, 0.9), maxYd: 44, squeeze: 0.86 });
    });

    // ── white 4-foot border + boundary lines ────────────────────────────
    const B = 1.35;
    g.globalAlpha = 0.85;
    box(-B, -B, FIELD.LEN + B * 2, B, PAINT);             // near border
    box(-B, FIELD.WID, FIELD.LEN + B * 2, B, PAINT);      // far border
    box(-B, -B, B, FIELD.WID + B * 2, PAINT);             // left border
    box(FIELD.LEN, -B, B, FIELD.WID + B * 2, PAINT);      // right border
    g.globalAlpha = 1;

    const LW = 0.111;                                     // 4 inch paint
    box(0, -LW / 2, FIELD.LEN, LW, PAINT);                // sidelines
    box(0, FIELD.WID - LW / 2, FIELD.LEN, LW, PAINT);
    box(-LW / 2, 0, LW, FIELD.WID, PAINT);                // end lines
    box(FIELD.LEN - LW / 2, 0, LW, FIELD.WID, PAINT);

    // ── yard lines every 5, thicker goal lines ──────────────────────────
    for (let x = 15; x <= 105; x += 5) box(x - LW / 2, 0, LW, FIELD.WID, PAINT);
    [10, 110].forEach(x => box(x - 0.11, 0, 0.22, FIELD.WID, PAINT));

    // ── single-yard hash marks + sideline ticks ─────────────────────────
    for (let x = 11; x <= 109; x++) {
        if (x % 5 === 0) continue;
        [FIELD.HASH_NEAR, FIELD.HASH_FAR].forEach(z =>
            box(x - LW / 2, z - 0.33, LW, 0.67, PAINT));
        box(x - LW / 2, 0, LW, 0.7, PAINT);
        box(x - LW / 2, FIELD.WID - 0.7, LW, 0.7, PAINT);
    }

    // ── yard numbers + direction arrows ─────────────────────────────────
    // Convention: the tops of the numbers point in toward midfield, so each
    // set reads right side up from its own sideline (and the far set reads
    // upside down to the broadcast camera, exactly like on TV).
    const NEAR_Z = 8.6, FAR_Z = FIELD.WID - 8.6;
    const DIG = 1.35;                                  // digit offset from the line
    for (let x = 20; x <= 100; x += 10) {
        const val = x <= 60 ? (x - 10) : (110 - x);
        const label = String(val);
        const digits = [label[0], label[1]];
        const toGoal = x < 60 ? -1 : (x > 60 ? 1 : 0);   // arrow direction

        // near side (reads from z = 0 sideline → rotated 180° in texture space)
        drawText(digits[0], x + DIG, NEAR_Z, 2, Math.PI, PAINT, { squeeze: 0.72 });
        drawText(digits[1], x - DIG, NEAR_Z, 2, Math.PI, PAINT, { squeeze: 0.72 });
        // far side (reads from z = 53.3 sideline → upright in texture space)
        drawText(digits[0], x - DIG, FAR_Z, 2, 0, PAINT, { squeeze: 0.72 });
        drawText(digits[1], x + DIG, FAR_Z, 2, 0, PAINT, { squeeze: 0.72 });

        if (toGoal !== 0) {
            const tri = (ax, az, dir, flip) => {
                const h = 0.55, len = 0.95;
                g.fillStyle = PAINT;
                g.beginPath();
                g.moveTo(px(ax + dir * len), pz(az));
                g.lineTo(px(ax), pz(az - h * flip));
                g.lineTo(px(ax), pz(az + h * flip));
                g.closePath();
                g.fill();
            };
            tri(x + toGoal * 3.6, NEAR_Z, toGoal, 1);
            tri(x + toGoal * 3.6, FAR_Z, toGoal, 1);
        }
    }

    // ── midfield logo ───────────────────────────────────────────────────
    (() => {
        const cx = px(FIELD.CX), cz = pz(FIELD.CZ), r = 5.6 * S;
        g.save();
        g.globalAlpha = 0.8;
        g.fillStyle = teams.home.primary;
        g.beginPath(); g.arc(cx, cz, r, 0, TAU); g.fill();
        g.globalAlpha = 1;
        g.lineWidth = 0.5 * S; g.strokeStyle = PAINT;
        g.beginPath(); g.arc(cx, cz, r, 0, TAU); g.stroke();
        g.lineWidth = 0.18 * S;
        g.beginPath(); g.arc(cx, cz, r * 0.82, 0, TAU); g.stroke();
        g.restore();
        // Stylised football + chevrons so it reads as a crest from the air
        g.save();
        g.translate(cx, cz);
        g.rotate(Math.PI);            // upright from the broadcast sideline
        g.fillStyle = teams.home.secondary;
        g.beginPath();
        g.ellipse(0, 0, r * 0.5, r * 0.3, 0, 0, TAU);
        g.fill();
        g.strokeStyle = teams.home.primary;
        g.lineWidth = 0.16 * S;
        g.beginPath(); g.moveTo(-r * 0.3, 0); g.lineTo(r * 0.3, 0); g.stroke();
        for (let i = -2; i <= 2; i++) {
            g.beginPath();
            g.moveTo(i * r * 0.11, -r * 0.12);
            g.lineTo(i * r * 0.11, r * 0.12);
            g.stroke();
        }
        g.fillStyle = PAINT;
        [-1, 1].forEach(s => {
            g.beginPath();
            g.moveTo(s * r * 0.62, -r * 0.34);
            g.lineTo(s * r * 0.80, 0);
            g.lineTo(s * r * 0.62, r * 0.34);
            g.lineTo(s * r * 0.70, 0);
            g.closePath();
            g.fill();
        });
        g.restore();
    })();

    // ── dashed coaching-box limit line outside each sideline ────────────
    g.setLineDash([1.2 * S, 1.0 * S]);
    g.lineWidth = 0.14 * S;
    g.strokeStyle = 'rgba(244,247,244,0.75)';
    [-4.5, FIELD.WID + 4.5].forEach(z => {
        g.beginPath();
        g.moveTo(px(32), pz(z));
        g.lineTo(px(88), pz(z));
        g.stroke();
    });
    g.setLineDash([]);

    // ── darken the far edge of the apron so it melts into the stadium ───
    const vg = g.createLinearGradient(0, 0, 0, H);
    vg.addColorStop(0.00, 'rgba(0,0,0,0.55)');
    vg.addColorStop(0.10, 'rgba(0,0,0,0.00)');
    vg.addColorStop(0.90, 'rgba(0,0,0,0.00)');
    vg.addColorStop(1.00, 'rgba(0,0,0,0.55)');
    g.fillStyle = vg;
    g.fillRect(0, 0, W, H);
    const hg = g.createLinearGradient(0, 0, W, 0);
    hg.addColorStop(0.00, 'rgba(0,0,0,0.5)');
    hg.addColorStop(0.06, 'rgba(0,0,0,0.0)');
    hg.addColorStop(0.94, 'rgba(0,0,0,0.0)');
    hg.addColorStop(1.00, 'rgba(0,0,0,0.5)');
    g.fillStyle = hg;
    g.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return srgb(tex);
}

/** Tiling grass "fuzz" used as a bump map so the turf isn't a flat sheet. */
function makeGrassBump() {
    const N = 256;
    const cv = document.createElement('canvas');
    cv.width = cv.height = N;
    const g = cv.getContext('2d');
    g.fillStyle = '#808080';
    g.fillRect(0, 0, N, N);
    const rand = rng(7717);
    for (let i = 0; i < 9000; i++) {
        const x = rand() * N, y = rand() * N;
        const v = rand() < 0.5 ? 255 : 0;
        g.strokeStyle = `rgba(${v},${v},${v},0.25)`;
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + (rand() - 0.5) * 3, y - 1 - rand() * 3);
        g.stroke();
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(TURF.W / 2, TURF.D / 2);
    return tex;
}

/** Speckled crowd tile — reads as thousands of people once it's repeated. */
function makeCrowdTexture(teams) {
    const N = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = N;
    const g = cv.getContext('2d');
    g.fillStyle = '#363b45';                              // shaded concrete seating
    g.fillRect(0, 0, N, N);

    // Weighted toward mid and dark tones: a distant crowd is a mottled mass,
    // not a field of bright dots.
    const palette = [
        teams.home.primary, teams.home.primary, teams.home.secondary,
        teams.away.primary, '#e8e4da', '#b9b3a8', '#8d949e', '#6d7684',
        '#3b4252', '#2b303c', '#4a4f5a', '#c9a227', '#57606e',
        '#c98d63', '#8a5a3b', '#5d4a3a',
    ];
    const rand = rng(4242);
    const rows = 7;
    for (let r = 0; r < rows; r++) {
        const y = (r + 0.5) * (N / rows);
        g.fillStyle = 'rgba(0,0,0,0.28)';                 // seat riser shadow
        g.fillRect(0, y + (N / rows) * 0.34, N, (N / rows) * 0.22);
        for (let i = 0; i < 9; i++) {
            const x = (i + (r % 2 ? 0.5 : 0)) * (N / 9) + (rand() - 0.5) * 4;
            g.fillStyle = palette[(rand() * palette.length) | 0];
            const w = 7 + rand() * 4, h = 9 + rand() * 5;
            g.beginPath();
            g.ellipse(x, y + (rand() - 0.5) * 3, w / 2, h / 2, 0, 0, TAU);
            g.fill();
            // head
            g.fillStyle = ['#c99a76', '#a8734d', '#6f4a30', '#d8b494'][(rand() * 4) | 0];
            g.beginPath();
            g.ellipse(x, y - h * 0.45 + (rand() - 0.5) * 2, w * 0.26, w * 0.28, 0, 0, TAU);
            g.fill();
        }
    }
    // Overall knock-down so the deck sits back in the frame
    g.fillStyle = 'rgba(20,24,32,0.22)';
    g.fillRect(0, 0, N, N);
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return srgb(tex);
}

/** Vertical sky gradient for the backdrop sphere. */
function makeSkyTexture() {
    const cv = document.createElement('canvas');
    cv.width = 16; cv.height = 256;
    const g = cv.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.00, '#2f6ec4');
    grad.addColorStop(0.42, '#79b4e6');
    grad.addColorStop(0.72, '#bcd9ee');
    grad.addColorStop(0.90, '#e2ecf2');
    grad.addColorStop(1.00, '#cdd8dc');
    g.fillStyle = grad;
    g.fillRect(0, 0, 16, 256);
    return srgb(new THREE.CanvasTexture(cv));
}

// ═════════════════════════════════════════════════════════════════════════
// PLAYER FIGURES
// ═════════════════════════════════════════════════════════════════════════

// Geometry + material caches: every figure shares these, so 22 players cost
// 22 × transforms instead of 22 × geometry uploads.
const GEO = {};
function geo() {
    if (GEO.ready) return GEO;
    GEO.thigh  = new THREE.CylinderGeometry(0.095, 0.082, 0.46, 7);
    GEO.shin   = new THREE.CylinderGeometry(0.075, 0.058, 0.45, 6);
    GEO.shoe   = new THREE.BoxGeometry(0.30, 0.09, 0.15);
    GEO.torso  = new THREE.CylinderGeometry(0.20, 0.165, 0.62, 16, 1, false);
    GEO.pads   = new THREE.SphereGeometry(0.20, 14, 8);
    GEO.neck   = new THREE.CylinderGeometry(0.068, 0.082, 0.10, 6);
    GEO.helmet = new THREE.SphereGeometry(0.19, 16, 12);
    GEO.jaw    = new THREE.BoxGeometry(0.15, 0.11, 0.245);
    GEO.mask   = new THREE.TorusGeometry(0.112, 0.013, 5, 12, Math.PI);
    GEO.bar    = new THREE.CylinderGeometry(0.012, 0.012, 0.19, 5);
    GEO.stripe = new THREE.TorusGeometry(0.19, 0.021, 4, 16, Math.PI);
    GEO.arm    = new THREE.CylinderGeometry(0.062, 0.049, 0.56, 6);
    GEO.glove  = new THREE.SphereGeometry(0.062, 7, 5);
    GEO.blob   = new THREE.CircleGeometry(0.44, 16);
    GEO.ring   = new THREE.TorusGeometry(0.62, 0.055, 6, 22);
    GEO.cap    = new THREE.SphereGeometry(0.17, 12, 8);
    GEO.brim   = new THREE.CircleGeometry(0.19, 12);
    GEO.ready  = true;
    return GEO;
}

const MAT_CACHE = new Map();
function mat(key, make) {
    let m = MAT_CACHE.get(key);
    if (!m) { m = make(); MAT_CACHE.set(key, m); }
    return m;
}

/** Jersey texture: colour, collar, sleeve trim and the number front and back. */
function makeJerseyTexture({ jersey, trim, number }) {
    const W = 256, H = 256;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');

    g.fillStyle = jersey;
    g.fillRect(0, 0, W, H);
    // Side panels sit at u = 0 / 0.5 (the player's flanks)
    g.fillStyle = 'rgba(0,0,0,0.16)';
    g.fillRect(0, 0, W * 0.05, H);
    g.fillRect(W * 0.95, 0, W * 0.05, H);
    g.fillRect(W * 0.47, 0, W * 0.06, H);
    // Collar (canvas top = top of the torso cylinder)
    g.fillStyle = trim;
    g.fillRect(0, 0, W, H * 0.05);
    g.fillStyle = 'rgba(0,0,0,0.22)';
    g.fillRect(0, H * 0.05, W, H * 0.02);
    // Waist shading
    const wg = g.createLinearGradient(0, H * 0.7, 0, H);
    wg.addColorStop(0, 'rgba(0,0,0,0)');
    wg.addColorStop(1, 'rgba(0,0,0,0.3)');
    g.fillStyle = wg;
    g.fillRect(0, H * 0.7, W, H * 0.3);

    const num = String(number);
    const draw = (cx, size) => {
        g.save();
        g.translate(cx, H * 0.34);
        g.font = `900 ${size}px "Arial Black", Impact, sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.lineWidth = size * 0.11;
        g.strokeStyle = trim;
        g.lineJoin = 'round';
        g.strokeText(num, 0, 0);
        g.fillStyle = '#f7f7f5';
        g.fillText(num, 0, 0);
        g.restore();
    };
    draw(W * 0.25, H * 0.26);        // chest (faces +x, the way they run)
    draw(W * 0.75, H * 0.32);        // back

    return srgb(new THREE.CanvasTexture(cv));
}

/** Vertical black/white stripes for the officials. */
function makeRefereeTexture() {
    const W = 256, H = 256;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#f2f2f2';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#151515';
    for (let i = 0; i < 16; i += 2) g.fillRect((i / 16) * W, 0, W / 16, H);
    g.fillStyle = '#151515';
    g.fillRect(0, 0, W, H * 0.07);
    return srgb(new THREE.CanvasTexture(cv));
}

const ROLE_NUMBERS = {
    QB: 12, RB: 28, FB: 44, TE: 87, WR: 11, W1: 80, W2: 15, W3: 83,
    C: 55, LG: 66, RG: 68, LT: 71, RT: 76, OG: 67, OT: 74,
    DE: 92, DT: 97, NT: 94, MLB: 54, WLB: 51, SLB: 58, LB: 52,
    CB: 24, FS: 31, SS: 21, S: 26, K: 3, P: 8, LS: 46,
};
function numberFor(role, salt = 0) {
    const key = String(role || '').toUpperCase().replace(/[^A-Z]/g, '');
    let n = ROLE_NUMBERS[key];
    if (n === undefined) {
        n = ROLE_NUMBERS[key.slice(0, 2)];
    }
    if (n === undefined) {
        let h = 0;
        for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 89;
        n = h + 10;
    }
    const digits = String(role || '').match(/\d/);
    if (digits) n = clamp(n + Number(digits[0]), 1, 99);
    return clamp(n + (salt % 3), 1, 99);
}

/**
 * Build one player. Returns a THREE.Group whose origin sits on the turf and
 * whose forward direction is local +x. `group.userData.animate(dt, speed)`
 * drives the run cycle.
 */
export function createPlayerFigure(cfg = {}) {
    const G = geo();
    const kind    = cfg.kind || 'player';
    const jersey  = cfg.jersey  || '#1d4ed8';
    const helmetC = cfg.helmet  || shade(jersey, 0.55);
    const pants   = cfg.pants   || '#e7e8ec';
    const trim    = cfg.trim    || '#ffffff';
    const skin    = cfg.skin    || '#c98d63';
    const number  = cfg.number  !== undefined ? cfg.number : 0;
    const isRef   = kind === 'referee';

    const figure = new THREE.Group();
    const body = new THREE.Group();            // bob + lean live here
    figure.add(body);

    const pantMat  = mat(`pant-${isRef ? 'ref' : pants}`, () => new THREE.MeshStandardMaterial({
        color: isRef ? 0x1b1b1f : pants, roughness: 0.85, metalness: 0,
    }));
    const skinMat  = mat(`skin-${skin}`, () => new THREE.MeshStandardMaterial({
        color: skin, roughness: 0.8,
    }));
    const shoeMat  = mat('shoe', () => new THREE.MeshStandardMaterial({
        color: 0x121216, roughness: 0.55,
    }));
    const jerseyMat = mat(`jsy-${kind}-${jersey}-${trim}-${number}`, () => new THREE.MeshStandardMaterial({
        map: isRef ? makeRefereeTexture() : makeJerseyTexture({ jersey, trim, number }),
        roughness: 0.66, metalness: 0.02,
    }));
    const helmetMat = mat(`hel-${isRef ? 'ref' : helmetC}`, () => new THREE.MeshStandardMaterial({
        color: isRef ? 0xf0f0f0 : helmetC, roughness: 0.3, metalness: 0.35,
    }));
    const trimMat  = mat(`trim-${trim}`, () => new THREE.MeshStandardMaterial({
        color: trim, roughness: 0.4, metalness: 0.2,
    }));
    const maskMat  = mat('mask', () => new THREE.MeshStandardMaterial({
        color: 0xd8dbe0, roughness: 0.35, metalness: 0.6,
    }));

    // ── legs (hip → knee → shoe, so the run cycle can bend the knee) ────
    // Dark socks below the knee: without them the white pants and skin-tone
    // shins merge into one pale post at broadcast distance.
    const sockMat = mat('sock', () => new THREE.MeshStandardMaterial({
        color: 0x1c1c24, roughness: 0.75,
    }));

    const legs = [];
    [-0.16, 0.16].forEach(dz => {
        const hip = new THREE.Group();
        hip.position.set(0, 0.98, dz);
        const thigh = new THREE.Mesh(G.thigh, pantMat);
        thigh.position.y = -0.23;
        thigh.castShadow = true;
        hip.add(thigh);

        const knee = new THREE.Group();
        knee.position.y = -0.46;
        const shin = new THREE.Mesh(G.shin, sockMat);
        shin.position.y = -0.225;
        knee.add(shin);
        const shoe = new THREE.Mesh(G.shoe, shoeMat);
        shoe.position.set(0.06, -0.45, 0);
        knee.add(shoe);
        hip.add(knee);

        body.add(hip);
        legs.push({ hip, knee });
    });

    // ── torso / shoulder pads ───────────────────────────────────────────
    const torso = new THREE.Mesh(G.torso, jerseyMat);
    torso.position.y = 1.29;
    torso.scale.set(1.04, 1, 1.62);
    torso.castShadow = true;
    body.add(torso);

    if (!isRef) {
        // Wide shoulder pads over a narrow waist — that inverted triangle is
        // what makes a figure read as a football player from 70 yards out.
        const pads = new THREE.Mesh(G.pads, jerseyMat);
        pads.position.y = 1.49;
        pads.scale.set(1.15, 0.7, 2.05);
        pads.castShadow = true;
        body.add(pads);
    }

    const neck = new THREE.Mesh(G.neck, skinMat);
    neck.position.y = 1.62;
    body.add(neck);

    // ── head ────────────────────────────────────────────────────────────
    const head = new THREE.Group();
    head.position.y = 1.78;
    body.add(head);

    if (isRef) {
        const cap = new THREE.Mesh(G.cap, mat('refcap', () => new THREE.MeshStandardMaterial({
            color: 0x101014, roughness: 0.6,
        })));
        cap.scale.set(1.05, 0.85, 1);
        cap.castShadow = true;
        head.add(cap);
        const brim = new THREE.Mesh(G.brim, mat('refbrim', () => new THREE.MeshStandardMaterial({
            color: 0x101014, roughness: 0.6, side: THREE.DoubleSide,
        })));
        brim.rotation.x = -Math.PI / 2;
        brim.position.set(0.11, -0.03, 0);
        brim.scale.set(0.8, 1, 1);
        head.add(brim);
        const face = new THREE.Mesh(G.helmet, skinMat);
        face.scale.setScalar(0.86);
        face.position.y = -0.03;
        head.add(face);
    } else {
        const helmet = new THREE.Mesh(G.helmet, helmetMat);
        helmet.scale.set(1.13, 1.0, 1.0);
        helmet.castShadow = true;
        head.add(helmet);

        const jaw = new THREE.Mesh(G.jaw, helmetMat);
        jaw.position.set(0.10, -0.075, 0);
        head.add(jaw);

        const stripe = new THREE.Mesh(G.stripe, trimMat);
        stripe.scale.set(1.14, 1.03, 1);
        head.add(stripe);

        const mask = new THREE.Mesh(G.mask, maskMat);
        mask.rotation.z = -Math.PI / 2;
        mask.position.set(0.055, -0.02, 0);
        mask.scale.set(0.92, 1, 1);
        head.add(mask);
        [-0.03, -0.10].forEach(y => {
            const bar = new THREE.Mesh(G.bar, maskMat);
            bar.rotation.x = Math.PI / 2;
            bar.position.set(0.165, y, 0);
            head.add(bar);
        });
    }

    // ── arms ────────────────────────────────────────────────────────────
    const arms = [];
    [-0.34, 0.34].forEach(dz => {
        const shoulder = new THREE.Group();
        shoulder.position.set(0, 1.44, dz);
        shoulder.rotation.x = dz > 0 ? -0.16 : 0.16;
        const arm = new THREE.Mesh(G.arm, isRef ? jerseyMat : jerseyMat);
        arm.position.y = -0.28;
        arm.castShadow = true;
        shoulder.add(arm);
        const glove = new THREE.Mesh(G.glove, isRef ? skinMat : mat('glove', () =>
            new THREE.MeshStandardMaterial({ color: 0x1b1b20, roughness: 0.5 })));
        glove.position.y = -0.57;
        shoulder.add(glove);
        body.add(shoulder);
        arms.push(shoulder);
    });

    // ── contact shadow + ball-carrier ring ──────────────────────────────
    const blob = new THREE.Mesh(G.blob, mat('blob', () => new THREE.MeshBasicMaterial({
        color: 0x0a1408, transparent: true, opacity: 0.13, depthWrite: false,
    })));
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.006;
    figure.add(blob);

    const ring = new THREE.Mesh(G.ring, mat(`ring-${trim}`, () => new THREE.MeshBasicMaterial({
        color: new THREE.Color(trim), transparent: true, opacity: 0.85,
        depthWrite: false, blending: THREE.AdditiveBlending,
    })));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    ring.visible = false;
    figure.add(ring);

    figure.userData.parts = { body, legs, arms, head, torso, ring, blob };
    figure.userData.phase = Math.random() * TAU;
    figure.userData.animate = (dt, speed) => animateFigure(figure, dt, speed);
    return figure;
}

function animateFigure(figure, dt, speed) {
    const ud = figure.userData;
    const p = ud.parts;
    if (!p) return;

    const norm = clamp((speed || 0) / 8.5, 0, 1);          // 8.5 yd/s ≈ sprint
    ud.phase = (ud.phase + dt * (5 + norm * 16)) % TAU;

    const sw = Math.sin(ud.phase);
    const amp = 0.12 + norm * 0.80;

    p.legs[0].hip.rotation.z = sw * amp;
    p.legs[1].hip.rotation.z = -sw * amp;
    p.legs[0].knee.rotation.z = -Math.max(0, -sw) * amp * 1.5 - 0.06;
    p.legs[1].knee.rotation.z = -Math.max(0, sw) * amp * 1.5 - 0.06;

    p.arms[0].rotation.z = -sw * amp * 0.85 - 0.10;
    p.arms[1].rotation.z = sw * amp * 0.85 - 0.10;

    p.body.position.y = Math.abs(sw) * 0.055 * norm;
    p.body.rotation.z = -0.05 - norm * 0.26;               // forward lean
}

// ═════════════════════════════════════════════════════════════════════════
// FOOTBALL
// ═════════════════════════════════════════════════════════════════════════

/**
 * Prolate-spheroid football with laces and stripes. Returns a Group; the
 * inner mesh (userData.spin) has its long axis on local +x so the group can
 * be yawed to the direction of flight while the ball spins on its own axis.
 */
export function createFootball() {
    const HALF = 0.26, R = 0.135;
    const pts = [];
    const SEG = 16;
    for (let i = 0; i <= SEG; i++) {
        const t = -1 + (2 * i) / SEG;
        pts.push(new THREE.Vector2(Math.pow(Math.max(0, 1 - t * t), 0.72) * R, t * HALF));
    }
    const leather = new THREE.MeshStandardMaterial({ color: 0x6a3a24, roughness: 0.62, metalness: 0.04 });
    const white   = new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.5 });

    const spin = new THREE.Mesh(new THREE.LatheGeometry(pts, 20), leather);
    spin.rotation.z = -Math.PI / 2;              // long axis → local +x
    spin.castShadow = true;

    // Two white end stripes
    [-0.11, 0.11].forEach(y => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 0.72, 0.012, 4, 18), white);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        spin.add(ring);
    });
    // Laces
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.2, 0.03), white);
    lace.position.set(R * 0.94, 0, 0);
    spin.add(lace);
    for (let i = -2; i <= 2; i++) {
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.02, 0.055), white);
        st.position.set(R * 0.96, i * 0.042, 0);
        spin.add(st);
    }

    const group = new THREE.Group();
    group.add(spin);
    group.userData.spin = spin;
    return group;
}

// ═════════════════════════════════════════════════════════════════════════
// STADIUM / ENVIRONMENT
// ═════════════════════════════════════════════════════════════════════════

/** One grandstand built facing +z; callers rotate the group into place. */
function makeStand(width, crowdTex, opts = {}) {
    const group = new THREE.Group();
    const front = opts.front !== undefined ? opts.front : 15;   // distance from field centre line
    const depth = opts.depth || 34;
    const rise  = opts.rise || 22;
    const wallH = opts.wallH || 3.2;
    const slope = Math.hypot(depth, rise);
    const angle = Math.atan2(rise, depth);

    const concrete = mat('concrete', () => new THREE.MeshLambertMaterial({ color: 0x2a2f3a }));
    const dark     = mat('stadark',  () => new THREE.MeshLambertMaterial({ color: 0x141821 }));

    // Field-level ad wall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, wallH, 1.2), dark);
    wall.position.set(0, wallH / 2, -front);
    group.add(wall);
    const band = new THREE.Mesh(new THREE.BoxGeometry(width, 0.34, 1.34),
        mat(`band-${opts.accent || '#1e3a8a'}`, () => new THREE.MeshBasicMaterial({
            color: new THREE.Color(opts.accent || '#1e3a8a'),
        })));
    band.position.set(0, wallH * 0.62, -front);
    group.add(band);

    // Seating deck
    const tex = crowdTex.clone();
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / 4, slope / 4);
    const deck = new THREE.Mesh(new THREE.PlaneGeometry(width, slope),
        new THREE.MeshLambertMaterial({ map: tex }));
    deck.rotation.x = -angle;
    deck.position.set(0, wallH + (rise - wallH) / 2, -front - depth / 2);
    group.add(deck);

    // Underside / structure so you never see sky through the deck
    const back = new THREE.Mesh(new THREE.BoxGeometry(width, rise + 6, 2), concrete);
    back.position.set(0, (rise + 6) / 2 - 2, -front - depth - 1);
    group.add(back);

    // Roof lip
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width, 1.6, 10), dark);
    roof.position.set(0, rise + 5, -front - depth + 3);
    group.add(roof);

    return group;
}

/**
 * Drops the full broadcast environment (sky, lighting, painted turf,
 * grandstands, goalposts, pylons, sideline crew) into an existing scene.
 * Returns handles the caller needs for per-frame work.
 */
export function buildBroadcastEnvironment(scene, renderer, opts = {}) {
    const teams = {
        home: { ...DEFAULT_TEAMS.home, ...(opts.teams && opts.teams.home) },
        away: { ...DEFAULT_TEAMS.away, ...(opts.teams && opts.teams.away) },
    };
    const res = opts.turfResolution ||
        (typeof window !== 'undefined' && window.innerWidth < 900 ? 2048 : 4096);

    const handles = { teams, objects: [], textures: [] };
    const add = o => { scene.add(o); handles.objects.push(o); return o; };

    // ── sky + haze ──────────────────────────────────────────────────────
    const skyTex = makeSkyTexture();
    handles.textures.push(skyTex);
    const sky = add(new THREE.Mesh(
        new THREE.SphereGeometry(900, 24, 16),
        new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, fog: false })
    ));
    sky.position.set(FIELD.CX, 0, FIELD.CZ);
    scene.fog = new THREE.Fog(0xc3d8e6, 150, 620);

    // ── lighting ────────────────────────────────────────────────────────
    add(new THREE.HemisphereLight(0xbfd8f2, 0x3d5a33, 0.72));
    add(new THREE.AmbientLight(0xffffff, 0.16));

    const sun = new THREE.DirectionalLight(0xfff2dc, 1.35);
    sun.position.set(FIELD.CX + 45, 85, -35);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 20;
    sun.shadow.camera.far = 260;
    sun.shadow.camera.left = -46;
    sun.shadow.camera.right = 46;
    sun.shadow.camera.top = 46;
    sun.shadow.camera.bottom = -46;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.025;
    add(sun);
    add(sun.target);
    sun.target.position.set(FIELD.CX, 0, FIELD.CZ);
    handles.sun = sun;

    // Cool bounce from the opposite side so shadowed jerseys don't go black
    const fill = new THREE.DirectionalLight(0xb9d4ff, 0.35);
    fill.position.set(FIELD.CX - 50, 34, 90);
    add(fill);

    // ── turf ────────────────────────────────────────────────────────────
    const turfTex = makeTurfTexture(teams, res);
    turfTex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
    const bumpTex = makeGrassBump();
    handles.textures.push(turfTex, bumpTex);

    const turf = add(new THREE.Mesh(
        new THREE.PlaneGeometry(TURF.W, TURF.D, 1, 1),
        new THREE.MeshStandardMaterial({
            map: turfTex, bumpMap: bumpTex, bumpScale: 0.035,
            roughness: 0.88, metalness: 0,
        })
    ));
    turf.rotation.x = -Math.PI / 2;
    turf.position.set(FIELD.CX, 0, FIELD.CZ);
    turf.receiveShadow = true;
    handles.turf = turf;

    // Concrete apron beyond the painted grass
    const apron = add(new THREE.Mesh(
        new THREE.PlaneGeometry(210, 150),
        new THREE.MeshLambertMaterial({ color: 0x39414c })
    ));
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(FIELD.CX, -0.05, FIELD.CZ);

    // ── grandstands (4 sides + corners) ─────────────────────────────────
    const crowd = makeCrowdTexture(teams);
    handles.textures.push(crowd);
    // The near sideline deck is deliberately low: the broadcast camera flies
    // above its back rows, so a tall deck there would occlude the field.
    const stands = [
        { rotY: 0,            width: 190, front: 44, depth: 26, rise: 12, accent: teams.home.primary },
        { rotY: Math.PI,      width: 190, front: 38, depth: 34, rise: 24, accent: teams.away.primary },
        { rotY: Math.PI / 2,  width: 124, front: 74, depth: 32, rise: 23, accent: teams.home.secondary },
        { rotY: -Math.PI / 2, width: 124, front: 74, depth: 32, rise: 23, accent: teams.away.secondary },
    ];
    stands.forEach(s => {
        const st = makeStand(s.width, crowd, s);
        st.position.set(FIELD.CX, 0, FIELD.CZ);
        st.rotation.y = s.rotY;
        add(st);
    });

    // ── light towers for stadium silhouette ─────────────────────────────
    const steel = mat('steel', () => new THREE.MeshLambertMaterial({ color: 0x20242c }));
    const lamp  = mat('lamp',  () => new THREE.MeshBasicMaterial({ color: 0xfdf6d8 }));
    [[-42, -60], [162, -60], [-42, 113], [162, 113]].forEach(([x, z]) => {
        const pole = add(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.3, 62, 6), steel));
        pole.position.set(x, 31, z);
        const rack = add(new THREE.Mesh(new THREE.BoxGeometry(16, 6, 1.4), steel));
        rack.position.set(x, 62, z);
        const glow = add(new THREE.Mesh(new THREE.BoxGeometry(15, 5, 0.4), lamp));
        glow.position.set(x, 62, z + (z < 0 ? 0.9 : -0.9));
    });

    // ── goalposts on the end lines ──────────────────────────────────────
    const gold = mat('gold', () => new THREE.MeshStandardMaterial({
        color: 0xf2c53d, roughness: 0.32, metalness: 0.65,
    }));
    const padMat = mat('goalpad', () => new THREE.MeshStandardMaterial({
        color: 0x1b1b20, roughness: 0.8,
    }));
    [{ x: 0, dir: 1 }, { x: 120, dir: -1 }].forEach(({ x, dir }) => {
        const g = new THREE.Group();
        // base pole set back behind the end line
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.4, 10), gold);
        base.position.set(-dir * 1.9, 1.7, 0);
        base.castShadow = true;
        g.add(base);
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 1.9, 10), padMat);
        pad.position.set(-dir * 1.9, 0.95, 0);
        g.add(pad);
        // gooseneck out to the end line
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-dir * 1.9, 3.3, 0),
            new THREE.Vector3(-dir * 1.6, 3.7, 0),
            new THREE.Vector3(-dir * 0.7, 3.33, 0),
            new THREE.Vector3(0, 3.33, 0),
        ]);
        const neck = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.14, 8, false), gold);
        neck.castShadow = true;
        g.add(neck);
        // crossbar + uprights (18'6" apart, 30 ft tall)
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 6.4, 10), gold);
        bar.rotation.x = Math.PI / 2;
        bar.position.set(0, 3.33, 0);
        bar.castShadow = true;
        g.add(bar);
        [-3.08, 3.08].forEach(dz => {
            const up = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 10, 8), gold);
            up.position.set(0, 8.33, dz);
            up.castShadow = true;
            g.add(up);
        });
        g.position.set(x, 0, FIELD.CZ);
        add(g);
    });

    // ── pylons ──────────────────────────────────────────────────────────
    const pylonMat = mat('pylon', () => new THREE.MeshBasicMaterial({ color: 0xff6a13 }));
    [0, 10, 110, 120].forEach(x => {
        [-0.55, FIELD.WID + 0.55].forEach(z => {
            const p = add(new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.15, 0.28), pylonMat));
            p.position.set(x, 0.58, z);
        });
    });

    // ── sideline crew: three instanced draw calls (legs / torso / head) so
    // the bench area is populated without 60 full skeletons. Split into three
    // parts because a single capsule reads as a bowling pin up close.
    const CREW = 60;
    const lamb = () => new THREE.MeshLambertMaterial({});
    const crewLegs = new THREE.InstancedMesh(
        new THREE.CylinderGeometry(0.11, 0.13, 0.92, 6), lamb(), CREW);
    const crewBody = new THREE.InstancedMesh(
        new THREE.CylinderGeometry(0.19, 0.15, 0.78, 7), lamb(), CREW);
    const crewHead = new THREE.InstancedMesh(
        new THREE.SphereGeometry(0.115, 8, 6), lamb(), CREW);
    const dummy = new THREE.Object3D();
    const rand = rng(9091);
    const crewColors = [teams.home.primary, teams.home.secondary, teams.away.primary,
                        '#1b1b20', '#e8e8ea', '#3b4252', '#c9ccd2'];
    const legColors = ['#1b1b20', '#2c3242', '#d8d9dd', '#4a4f5a'];
    for (let i = 0; i < CREW; i++) {
        const nearSide = i % 2 === 0;
        const x = 10 + rand() * 100;
        // Kept behind the white border so they never crowd the playing field
        const z = nearSide ? -4.6 - rand() * 2.6 : FIELD.WID + 4.6 + rand() * 2.6;
        dummy.rotation.set(0, nearSide ? 0 : Math.PI, 0);
        dummy.position.set(x, 0.46, z);
        dummy.updateMatrix();
        crewLegs.setMatrixAt(i, dummy.matrix);
        dummy.position.y = 1.29;
        dummy.updateMatrix();
        crewBody.setMatrixAt(i, dummy.matrix);
        dummy.position.y = 1.79;
        dummy.updateMatrix();
        crewHead.setMatrixAt(i, dummy.matrix);
        crewBody.setColorAt(i, new THREE.Color(crewColors[(rand() * crewColors.length) | 0]));
        crewLegs.setColorAt(i, new THREE.Color(legColors[(rand() * legColors.length) | 0]));
        crewHead.setColorAt(i, new THREE.Color(0xc98d63).lerp(new THREE.Color(0x8a5a3b), rand()));
    }
    [crewLegs, crewBody, crewHead].forEach(m => {
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
        add(m);
    });

    return handles;
}

// ═════════════════════════════════════════════════════════════════════════
// CAMERA PRESETS — telephoto framing is what makes it read as television
// ═════════════════════════════════════════════════════════════════════════

// Every preset is deliberately long-lens: a real broadcast camera sits ~70
// yards away behind a telephoto, which flattens the perspective and keeps the
// yard lines nearly parallel. Short distance + wide FOV is what made the old
// view look like a video game instead of a TV feed.
export const CAMERA_PRESETS = {
    sky: {
        fov: 42, follow: 3.2,
        pos:  (fx, o) => o.set(fx - 14, 11.5, FIELD.CZ),
        look: (fx, o) => o.set(fx + 2.0, 1.2, FIELD.CZ),
    },
    broadcast: {
        fov: 20, follow: 3.2,
        pos:  (fx, o) => o.set(fx - 13, 26, -46),
        look: (fx, o) => o.set(fx + 2, 1.4, FIELD.CZ),
    },
    closeup: {
        fov: 30, follow: 4.0,
        pos:  (fx, o) => o.set(fx - 8, 6.0, -19),
        look: (fx, o) => o.set(fx + 5, 1.4, FIELD.CZ),
    },
    endzone: {
        fov: 20, follow: 2.4,
        pos:  (fx, o) => o.set(146, 17, FIELD.CZ),
        look: (fx, o) => o.set(fx, 1.4, FIELD.CZ),
    },
};
const CAMERA_ORDER = ['sky', 'broadcast', 'closeup', 'endzone'];

function normalizeMode(mode) {
    const key = String(mode || '').toLowerCase().replace(/[^a-z]/g, '');
    if (CAMERA_PRESETS[key]) return key;
    if (key.includes('sky')) return 'sky';
    if (key.includes('close') || key.includes('field')) return 'closeup';
    if (key.includes('end')) return 'endzone';
    return 'broadcast';
}

// ═════════════════════════════════════════════════════════════════════════
// RENDERER
// ═════════════════════════════════════════════════════════════════════════

export class ThreeRenderer {
    constructor(mountElementId, opts = {}) {
        if (typeof THREE === 'undefined') {
            throw new Error('ThreeRenderer: global THREE not found — load three.min.js first.');
        }

        this.container = (typeof mountElementId === 'string'
            ? document.getElementById(mountElementId)
            : mountElementId) || document.body;

        const w = Math.max(1, this.container.clientWidth || 960);
        const h = Math.max(1, this.container.clientHeight || 540);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(34, w / h, 0.5, 2000);
        this.camera.position.set(45, 29, -40);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false,
            powerPreference: 'high-performance' });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.container.appendChild(this.renderer.domElement);

        // Environment
        this._env = buildBroadcastEnvironment(this.scene, this.renderer, opts);
        this._sun = this._env.sun;
        this.teams = this._env.teams;

        // Runtime state
        this._playerMeshes = new Map();
        this._refs = [];
        this._particles = [];
        this._routeArt = [];
        this._camMode = normalizeMode(opts.cameraMode || 'broadcast');
        this._focusX = FIELD.CX;
        this._losX = 35;
        this._firstDownX = 45;
        this._ballSeen = false;
        this._shake = 0;
        this._lastT = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
        this._dt = 1 / 60;
        this._lookAt = new THREE.Vector3(FIELD.CX, 1.6, FIELD.CZ);
        this._tmpPos = new THREE.Vector3();
        this._tmpLook = new THREE.Vector3();

        this._buildBall();
        this._buildTVLines();
        this._buildSidelineMarkers();

        // Snap the camera to the preset immediately so frame 1 is framed right
        const preset = CAMERA_PRESETS[this._camMode];
        preset.pos(this._focusX, this._tmpPos);
        preset.look(this._focusX, this._lookAt);
        this.camera.position.copy(this._tmpPos);
        this.camera.fov = preset.fov;
        this.camera.updateProjectionMatrix();
        this.camera.lookAt(this._lookAt);

        this._onResizeBound = () => this._onResize();
        window.addEventListener('resize', this._onResizeBound);
        if (typeof ResizeObserver !== 'undefined') {
            this._ro = new ResizeObserver(this._onResizeBound);
            this._ro.observe(this.container);
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // BUILD
    // ─────────────────────────────────────────────────────────────────────
    _buildBall() {
        this._ball = createFootball();
        this._ball.position.set(35, 0.42, FIELD.CZ);
        this.scene.add(this._ball);
        this._ballMesh = this._ball;                 // legacy alias
    }

    /** Television line-of-scrimmage (blue) and first-down (yellow) lines. */
    _buildTVLines() {
        const make = (color, y) => {
            const grp = new THREE.Group();
            const core = new THREE.Mesh(
                new THREE.PlaneGeometry(0.3, FIELD.WID),
                new THREE.MeshBasicMaterial({
                    color, transparent: true, opacity: 0.92, depthWrite: false,
                    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
                })
            );
            core.rotation.x = -Math.PI / 2;
            grp.add(core);
            const glow = new THREE.Mesh(
                new THREE.PlaneGeometry(0.8, FIELD.WID),
                new THREE.MeshBasicMaterial({
                    color, transparent: true, opacity: 0.13, depthWrite: false,
                    blending: THREE.AdditiveBlending,
                })
            );
            glow.rotation.x = -Math.PI / 2;
            grp.add(glow);
            grp.position.set(35, y, FIELD.CZ);
            this.scene.add(grp);
            return grp;
        };
        this._losLine = make(0x2f6fe8, 0.035);
        this._firstDownLine = make(0xf5d020, 0.04);
    }

    /** Chain-crew style sideline markers that track the LOS / first down. */
    _buildSidelineMarkers() {
        const pole = new THREE.CylinderGeometry(0.045, 0.045, 1.75, 6);
        const poleMat = mat('marker-pole', () => new THREE.MeshStandardMaterial({
            color: 0x2a2a30, roughness: 0.6,
        }));
        const mk = (color) => {
            const g = new THREE.Group();
            const p = new THREE.Mesh(pole, poleMat);
            p.position.y = 0.87;
            g.add(p);
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.5),
                new THREE.MeshStandardMaterial({ color, roughness: 0.5 }));
            head.position.y = 1.9;
            g.add(head);
            g.position.set(35, 0, -2.9);
            this.scene.add(g);
            return g;
        };
        this._downMarker = mk(0xf07000);
        this._chainMarker = mk(0xf5d020);
    }

    // ─────────────────────────────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────────────────────────────

    /** Optional: paint the end zones / crowd with real team identities. */
    setTeams(cfg = {}) {
        const teams = {
            home: { ...this.teams.home, ...(cfg.home || {}) },
            away: { ...this.teams.away, ...(cfg.away || {}) },
        };
        const same = JSON.stringify(teams) === JSON.stringify(this.teams);
        if (same) return;
        this.teams = teams;
        const old = this._env.turf.material.map;
        const tex = makeTurfTexture(teams, old.image.width);
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        this._env.turf.material.map = tex;
        this._env.turf.material.needsUpdate = true;
        old.dispose();
    }

    /**
     * Draw all players (called every frame).
     * renderPlayers: [{ x, y, team, role|type, state, vx, vy, id? }]
     */
    drawPlayers(renderPlayers, camX, offColor, defColor, ballCarrier) {
        this._tick();
        const dt = this._dt;
        if (!Array.isArray(renderPlayers)) return;

        this._offColor = offColor || this._offColor || '#2f6fe8';
        this._defColor = defColor || this._defColor || '#d92b2b';

        const needed = new Set();

        renderPlayers.forEach((p, i) => {
            const team = (p.team === 'defense' || p.team === 'def' || p.team === 'away')
                ? 'defense' : 'offense';
            const role = p.role || p.type || 'WR';
            const key = p.id !== undefined ? `id-${p.id}` : `${team}-${role}-${i}`;
            needed.add(key);

            let fig = this._playerMeshes.get(key);
            const stale = fig && (fig.userData.team !== team || fig.userData.role !== role);
            if (!fig || stale) {
                if (fig) {
                    this.scene.remove(fig);
                    this._playerMeshes.delete(key);
                }
                fig = this._makeFigure(team, role, i);
                fig.userData.team = team;
                fig.userData.role = role;
                // Spawn in place — the old renderer slid every player in from
                // the origin on their first frame.
                fig.position.set(
                    p.x !== undefined ? p.x : this._losX,
                    0,
                    p.y !== undefined ? p.y : FIELD.CZ
                );
                fig.rotation.y = team === 'offense' ? 0 : Math.PI;
                this.scene.add(fig);
                this._playerMeshes.set(key, fig);
            }

            const tx = p.x !== undefined ? p.x : this._losX;
            const tz = p.y !== undefined ? p.y : FIELD.CZ;
            const k = 1 - Math.exp(-12 * dt);
            fig.position.x += (tx - fig.position.x) * k;
            fig.position.z += (tz - fig.position.z) * k;

            const vx = p.vx || 0, vz = p.vy || 0;
            const speed = Math.hypot(vx, vz);
            if (speed > 0.25) {
                fig.rotation.y = lerpAngle(fig.rotation.y, -Math.atan2(vz, vx), 1 - Math.exp(-9 * dt));
            }
            fig.userData.animate(dt, speed);

            const isCarrier = !!ballCarrier && (ballCarrier === p ||
                (ballCarrier.id !== undefined && ballCarrier.id === p.id));
            const ring = fig.userData.parts.ring;
            ring.visible = isCarrier;
            if (isCarrier) {
                ring.scale.setScalar(1 + Math.sin(this._lastT * 6) * 0.06);
            }
        });

        for (const [key, fig] of this._playerMeshes) {
            if (!needed.has(key)) {
                this.scene.remove(fig);
                this._playerMeshes.delete(key);
            }
        }
    }

    _makeFigure(team, role, i) {
        const isDef = team === 'defense';
        const isKicker = ['K', 'P'].includes(String(role).toUpperCase());
        const base = isDef ? this._defColor : this._offColor;
        const jersey = isKicker ? shade(base, 1.15) : base;
        return createPlayerFigure({
            jersey,
            helmet: shade(base, isDef ? 0.34 : 0.3),
            pants: isDef ? '#e2e3e8' : '#eceef2',
            trim: isDef ? shade(base, 1.7) : '#ffffff',
            skin: ['#8a5a3b', '#a86f49', '#c98d63', '#e0aa7f'][i % 4],
            number: numberFor(role, i),
        });
    }

    /** Update ball position; supports the 3D arc (ball.z = height). */
    drawBall(ball) {
        this._tick();
        if (!this._ball || !ball) return;
        if (ball.state === 'dead' || ball.state === 'incomplete') {
            this._ball.visible = false;
            return;
        }
        this._ball.visible = true;

        const bx = ball.x !== undefined ? ball.x : this._losX;
        const bz = ball.y !== undefined ? ball.y : FIELD.CZ;
        const height = ball.z !== undefined ? ball.z : 0;
        const k = 1 - Math.exp(-18 * this._dt);
        this._ball.position.x += (bx - this._ball.position.x) * k;
        this._ball.position.z += (bz - this._ball.position.z) * k;
        this._ball.position.y = 0.42 + Math.max(0, height) * 1.1;

        this._focusX = this._ballSeen
            ? this._focusX + (bx - this._focusX) * (1 - Math.exp(-3.5 * this._dt))
            : bx;
        this._ballSeen = true;

        const inFlight = ball.state === 'in_flight' || ball.state === 'pass' || ball.state === 'kick';
        if (inFlight) {
            const yaw = -Math.atan2(ball.vy || 0, ball.vx || 1);
            this._ball.rotation.y = lerpAngle(this._ball.rotation.y, yaw, 0.35);
            this._ball.rotation.z = clamp(height * 0.05, -0.35, 0.35);
            this._ball.userData.spin.rotation.y += 1.1;    // spirals on its axis
        } else {
            this._ball.rotation.z = 0;
            this._ball.userData.spin.rotation.y += 0.05;
        }
    }

    /** LOS + first-down markers, and the camera focus fallback. */
    drawField(matchState, camX) {
        this._tick();
        if (matchState && matchState.yardLine !== undefined) {
            this._losX = clamp(matchState.yardLine, 0, FIELD.LEN);
        }
        if (matchState && matchState.firstDownYardLine !== undefined) {
            this._firstDownX = clamp(matchState.firstDownYardLine, 0, FIELD.LEN);
        }
        if (this._losLine) this._losLine.position.x = this._losX;
        if (this._firstDownLine) {
            this._firstDownLine.position.x = this._firstDownX;
            this._firstDownLine.visible = this._firstDownX > 10 && this._firstDownX < 110;
        }
        if (this._downMarker) this._downMarker.position.x = this._losX;
        if (this._chainMarker) this._chainMarker.position.x = this._firstDownX;

        // The ball drives the framing when we have it; camX is the fallback so
        // this still works for callers that only track the line of scrimmage.
        if (!this._ballSeen) {
            const hint = camX !== undefined ? camX + 40 : this._losX;
            this._focusX += (hint - this._focusX) * (1 - Math.exp(-2.5 * this._dt));
        }
    }

    /** Officials — a striped figure per referee object the engine hands us. */
    drawReferee(ref, camX) {
        if (!ref) return;
        const pos = ref.position || ref;
        const x = pos.x !== undefined ? pos.x : null;
        const z = pos.y !== undefined ? pos.y : (pos.z !== undefined ? pos.z : null);
        if (x === null || z === null) return;

        let entry = this._refs.find(r => r.ref === ref);
        if (!entry) {
            const fig = createPlayerFigure({ kind: 'referee', number: 0, trim: '#f2f2f2' });
            fig.position.set(x, 0, z);
            this.scene.add(fig);
            entry = { ref, fig };
            this._refs.push(entry);
        }
        entry.seen = this._lastT;
        const k = 1 - Math.exp(-10 * this._dt);
        entry.fig.position.x += (x - entry.fig.position.x) * k;
        entry.fig.position.z += (z - entry.fig.position.z) * k;
        const vx = ref.vx || (ref.velocity && ref.velocity.x) || 0;
        const vz = ref.vy || (ref.velocity && ref.velocity.y) || 0;
        const speed = Math.hypot(vx, vz);
        if (speed > 0.25) {
            entry.fig.rotation.y = lerpAngle(entry.fig.rotation.y, -Math.atan2(vz, vx), k);
        }
        entry.fig.userData.animate(this._dt, speed);

        // Drop officials the engine stopped reporting
        for (let i = this._refs.length - 1; i >= 0; i--) {
            const e = this._refs[i];
            if (this._lastT - (e.seen || 0) > 1.5) {
                this.scene.remove(e.fig);
                this._refs.splice(i, 1);
            }
        }
    }

    /** Pre-snap route overlay — glowing chalk lines on the turf. */
    drawPreSnapOverlay(offPlay, isFlipped, los, camX) {
        this._clearRoutes();
        if (!offPlay || !offPlay.routes) return;

        const FORMATION_Z = {
            QB: 0, RB: 0, LT: -4.5, LG: -1.5, C: 0, RG: 1.5, RT: 4.5,
            TE: 9, W1: -21, W2: 21, W3: -12, WR: -15,
        };
        const flip = isFlipped ? -1 : 1;
        const baseX = los !== undefined ? los : this._losX;
        const qbOffsetX = (offPlay.formation && offPlay.formation.QB &&
            offPlay.formation.QB.x !== undefined) ? offPlay.formation.QB.x : -2;

        Object.entries(offPlay.routes).forEach(([role, waypoints]) => {
            if (!Array.isArray(waypoints) || waypoints.length === 0) return;
            let cx = baseX + qbOffsetX;
            let cz = FIELD.CZ + (FORMATION_Z[role] || 0) * flip;
            const points = [new THREE.Vector3(cx, 0.12, cz)];
            waypoints.forEach(wp => {
                cx += wp.dx || 0;
                cz += (wp.dz || 0) * flip;
                points.push(new THREE.Vector3(cx, 0.12, cz));
            });
            if (points.length < 2) return;

            const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
            const tube = new THREE.Mesh(
                new THREE.TubeGeometry(curve, Math.max(16, points.length * 8), 0.07, 6, false),
                new THREE.MeshBasicMaterial({
                    color: 0xffe27a, transparent: true, opacity: 0.9, depthWrite: false,
                })
            );
            this.scene.add(tube);
            this._routeArt.push(tube);

            // Arrowhead aimed down the last leg of the route
            const a = points[points.length - 2], b = points[points.length - 1];
            const cone = new THREE.Mesh(
                new THREE.ConeGeometry(0.26, 0.72, 8),
                new THREE.MeshBasicMaterial({ color: 0xffe27a, transparent: true, opacity: 0.95 })
            );
            const dir = new THREE.Vector3().subVectors(b, a).normalize();
            cone.position.copy(b);
            cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            this.scene.add(cone);
            this._routeArt.push(cone);
        });
    }

    _clearRoutes() {
        this._routeArt.forEach(o => {
            this.scene.remove(o);
            if (o.geometry) o.geometry.dispose();
            if (o.material) o.material.dispose();
        });
        this._routeArt.length = 0;
    }

    // ── particles ───────────────────────────────────────────────────────

    /** Turf spray + dust when someone gets put on the ground. */
    addTackleBurst(x, y) {
        for (let i = 0; i < 18; i++) {
            const divot = i % 3 === 0;
            const geo = divot
                ? new THREE.PlaneGeometry(0.3 + Math.random() * 0.35, 0.2 + Math.random() * 0.25)
                : new THREE.SphereGeometry(0.07 + Math.random() * 0.09, 5, 4);
            const p = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
                color: divot ? 0x5a4326 : (Math.random() < 0.6 ? 0x4c8b3a : 0x7a6238),
                transparent: true, opacity: 0.95,
                side: divot ? THREE.DoubleSide : THREE.FrontSide,
            }));
            if (divot) p.rotation.set(-Math.PI / 2, 0, Math.random() * TAU);
            p.position.set(x, 0.35 + Math.random() * 0.5, y);
            p.userData = {
                vx: (Math.random() - 0.5) * 7, vy: 1 + Math.random() * 5,
                vz: (Math.random() - 0.5) * 7, life: 0.75 + Math.random() * 0.4,
                max: 1.15, drag: 0.86,
            };
            this.scene.add(p);
            this._particles.push(p);
        }
        this._shake = Math.min(0.35, this._shake + 0.18);
    }

    addTouchdownFireworks(x, y) {
        const colors = [0xff5a5a, 0x5aa8ff, 0x4ade80, 0xffd54a, 0xc084fc, 0xffffff];
        for (let i = 0; i < 60; i++) {
            const p = new THREE.Mesh(
                new THREE.SphereGeometry(0.12 + Math.random() * 0.12, 5, 4),
                new THREE.MeshBasicMaterial({
                    color: colors[(Math.random() * colors.length) | 0],
                    transparent: true, opacity: 1, blending: THREE.AdditiveBlending,
                })
            );
            p.position.set(x, 1.2, y);
            const a = Math.random() * TAU, s = 4 + Math.random() * 12;
            p.userData = {
                vx: Math.cos(a) * s, vy: 6 + Math.random() * 12, vz: Math.sin(a) * s,
                life: 1.4 + Math.random() * 0.8, max: 2.2, drag: 0.94,
            };
            this.scene.add(p);
            this._particles.push(p);
        }
    }

    updateParticles(dt) {
        const step = dt && dt > 0 ? Math.min(dt, 0.05) : this._dt;
        for (let i = this._particles.length - 1; i >= 0; i--) {
            const p = this._particles[i];
            const u = p.userData;
            u.vy -= 22 * step;
            const d = Math.pow(u.drag, step * 60);
            u.vx *= d; u.vz *= d;
            p.position.x += u.vx * step;
            p.position.y += u.vy * step;
            p.position.z += u.vz * step;
            if (p.position.y < 0.02) { p.position.y = 0.02; u.vy *= -0.28; }
            u.life -= step;
            p.material.opacity = clamp(u.life / u.max, 0, 1);
            if (u.life <= 0) {
                this.scene.remove(p);
                p.geometry.dispose();
                p.material.dispose();
                this._particles.splice(i, 1);
            }
        }
    }

    /** Frame step — app.js calls this at the end of its render pass. */
    drawParticles() {
        this.render();
    }

    // ── camera ──────────────────────────────────────────────────────────

    setCameraMode(mode) {
        this._camMode = normalizeMode(mode);
        const preset = CAMERA_PRESETS[this._camMode];
        preset.pos(this._focusX, this._tmpPos);
        preset.look(this._focusX, this._lookAt);
        this.camera.position.copy(this._tmpPos);
        this.camera.fov = preset.fov;
        this.camera.updateProjectionMatrix();
        this.camera.lookAt(this._lookAt);
        return this._camMode;
    }

    /** Convenience for a "change view" button. Returns the new mode name. */
    cycleCameraMode() {
        const i = CAMERA_ORDER.indexOf(this._camMode);
        return this.setCameraMode(CAMERA_ORDER[(i + 1) % CAMERA_ORDER.length]);
    }

    _updateCamera() {
        const dt = this._dt;
        const preset = CAMERA_PRESETS[this._camMode] || CAMERA_PRESETS.broadcast;
        const fx = clamp(this._focusX, 14, 106);
        preset.pos(fx, this._tmpPos);
        preset.look(fx, this._tmpLook);

        const k = 1 - Math.exp(-preset.follow * dt);
        this.camera.position.lerp(this._tmpPos, k);
        this._lookAt.lerp(this._tmpLook, k);

        if (Math.abs(this.camera.fov - preset.fov) > 0.05) {
            this.camera.fov += (preset.fov - this.camera.fov) * k;
            this.camera.updateProjectionMatrix();
        }

        if (this._shake > 0.002) {
            this._shake *= Math.pow(0.02, dt);
            const s = this._shake;
            this.camera.position.x += (Math.random() - 0.5) * s;
            this.camera.position.y += (Math.random() - 0.5) * s;
        }
        this.camera.lookAt(this._lookAt);

        // Keep the shadow frustum tight around the action for crisp shadows
        if (this._sun) {
            this._sun.position.set(fx + 45, 85, -35);
            this._sun.target.position.set(fx, 0, FIELD.CZ);
            this._sun.target.updateMatrixWorld();
        }
    }

    /**
     * Advance the frame clock exactly once per frame, no matter how many of
     * the draw* entry points the host calls (app.js calls four of them), so
     * every smoothing term sees the whole frame's elapsed time.
     */
    _tick() {
        if (this._frameStamped) return;
        const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
        this._dt = clamp(now - this._lastT, 0.0005, 0.05);
        this._lastT = now;
        this._frameStamped = true;
    }

    render() {
        this._tick();
        this._updateCamera();
        this.renderer.render(this.scene, this.camera);
        this._frameStamped = false;
    }

    _onResize() {
        const w = Math.max(1, this.container.clientWidth);
        const h = Math.max(1, this.container.clientHeight);
        if (w === this._lastW && h === this._lastH) return;
        this._lastW = w; this._lastH = h;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
    }

    dispose() {
        window.removeEventListener('resize', this._onResizeBound);
        if (this._ro) this._ro.disconnect();
        this._clearRoutes();
        this._env.textures.forEach(t => t.dispose());
        this.renderer.dispose();
        if (this.renderer.domElement.parentNode === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

export default ThreeRenderer;
