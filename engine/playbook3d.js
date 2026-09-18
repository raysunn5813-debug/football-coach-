/**
 * engine/playbook3d.js
 * ---------------------------------------------------------------------------
 * Single source-of-truth adapter for the shared play catalog.
 *
 * Loads shared/playbook.json (150 plays across 5 formations) at module init
 * and exposes:
 *   - PLAYBOOK   : { [key]: PlayObject }  — used by gameday.js for the play grid
 *   - FORMATIONS : { [name]: FormationTemplate } — fallback positions for canvas draw
 *
 * The play objects already carry { alignments, routes[] } in the direct-vector
 * format that drawRouteOnCanvas() expects (gameday.js line 328).
 * ---------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// FORMATIONS — canonical pre-snap coordinate templates
// (x = depth from LOS, z = lateral position; hash center = 26.65)
// These are used as a fallback for the legacy delta-route draw path.
// ---------------------------------------------------------------------------
export const FORMATIONS = {
    "I-FORM": {
        QB:  { x: -4.5, z: 26.65 },
        FB:  { x: -6.0, z: 26.65 },
        RB:  { x: -7.0, z: 24.65 },
        WR1: { x: -0.5, z:  8.65 },
        WR2: { x: -1.0, z: 44.65 },
        TE:  { x: -0.5, z: 32.65 },
        LT:  { x: -0.5, z: 22.65 },
        LG:  { x: -0.5, z: 24.65 },
        C:   { x: -0.5, z: 26.65 },
        RG:  { x: -0.5, z: 28.65 },
        RT:  { x: -0.5, z: 30.65 },
    },
    "SHOTGUN": {
        QB:  { x: -5.0, z: 26.65 },
        RB:  { x: -5.0, z: 23.65 },
        WR1: { x: -0.5, z:  8.65 },
        WR2: { x: -1.0, z: 44.65 },
        WR3: { x: -1.0, z: 17.65 },
        TE:  { x: -0.5, z: 32.65 },
        LT:  { x: -0.5, z: 22.65 },
        LG:  { x: -0.5, z: 24.65 },
        C:   { x: -0.5, z: 26.65 },
        RG:  { x: -0.5, z: 28.65 },
        RT:  { x: -0.5, z: 30.65 },
    },
    "SHOTGUN_SPREAD": {
        QB:  { x: -5.0, z: 26.65 },
        RB:  { x: -5.0, z: 23.65 },
        WR1: { x: -0.5, z:  8.65 },
        WR2: { x: -1.0, z: 44.65 },
        WR3: { x: -1.0, z: 17.65 },
        TE:  { x: -0.5, z: 32.65 },
        LT:  { x: -0.5, z: 22.65 },
        LG:  { x: -0.5, z: 24.65 },
        C:   { x: -0.5, z: 26.65 },
        RG:  { x: -0.5, z: 28.65 },
        RT:  { x: -0.5, z: 30.65 },
    },
    "PISTOL": {
        QB:  { x: -3.0, z: 26.65 },
        RB:  { x: -5.5, z: 26.65 },
        WR1: { x: -0.5, z:  8.65 },
        WR2: { x: -1.0, z: 44.65 },
        WR3: { x: -1.0, z: 17.65 },
        TE:  { x: -0.5, z: 32.65 },
        LT:  { x: -0.5, z: 22.65 },
        LG:  { x: -0.5, z: 24.65 },
        C:   { x: -0.5, z: 26.65 },
        RG:  { x: -0.5, z: 28.65 },
        RT:  { x: -0.5, z: 30.65 },
    },
    "EMPTY": {
        QB:  { x: -5.0, z: 26.65 },
        WR1: { x: -0.5, z:  8.65 },
        WR2: { x: -1.0, z: 44.65 },
        WR3: { x: -1.0, z: 17.65 },
        WR4: { x: -1.5, z: 20.65 },
        WR5: { x: -1.5, z: 33.65 },
        LT:  { x: -0.5, z: 22.65 },
        LG:  { x: -0.5, z: 24.65 },
        C:   { x: -0.5, z: 26.65 },
        RG:  { x: -0.5, z: 28.65 },
        RT:  { x: -0.5, z: 30.65 },
    },
    "GOAL LINE": {
        QB:  { x: -1.0, z: 26.65 },
        FB:  { x: -3.0, z: 26.65 },
        RB:  { x: -4.0, z: 24.65 },
        WR1: { x: -0.5, z: 17.65 },
        WR2: { x: -0.5, z: 35.65 },
        TE:  { x: -0.5, z: 30.65 },
        LT:  { x: -0.5, z: 22.65 },
        LG:  { x: -0.5, z: 24.65 },
        C:   { x: -0.5, z: 26.65 },
        RG:  { x: -0.5, z: 28.65 },
        RT:  { x: -0.5, z: 30.65 },
    },
};

// ---------------------------------------------------------------------------
// PLAYBOOK — populated asynchronously from shared/playbook.json
// Exported as a live object so any consumer that awaits playbookReady
// will see the fully-populated catalog.
// ---------------------------------------------------------------------------
export const PLAYBOOK = {};

/**
 * Promise that resolves once PLAYBOOK is fully populated.
 * Await this in any module that needs plays before rendering.
 *
 * Usage:
 *   import { PLAYBOOK, playbookReady } from './engine/playbook3d.js?v=4';
 *   await playbookReady;
 *   // PLAYBOOK is now populated
 */
export const playbookReady = (async () => {
    try {
        const res = await fetch('/shared/playbook.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();

        // raw is keyed by numeric string "1".."150"
        // Normalise each play and insert into the live PLAYBOOK object
        for (const [id, play] of Object.entries(raw)) {
            // Use the play's own `key` field if present, else the numeric id
            const key = play.key ?? id;

            PLAYBOOK[key] = {
                // Core identity
                id:          play.id          ?? key,
                key:         key,
                name:        play.name        ?? play.play_name ?? `Play ${key}`,
                card_title:  play.card_title  ?? play.name ?? `Play ${key}`,
                formation:   play.formation   ?? 'SHOTGUN',
                category:    play.category    ?? play.play_type ?? 'RUN',
                play_type:   play.play_type   ?? play.category ?? 'RUN',
                walsh_call:  play.walsh_call  ?? '',
                description: play.description ?? '',

                // Direct-vector route data (used by drawRouteOnCanvas)
                alignments:  play.alignments  ?? {},
                routes:      play.routes      ?? [],
            };
        }

        console.log(`[playbook3d] ✅ Loaded ${Object.keys(PLAYBOOK).length} plays from shared catalog.`);
    } catch (err) {
        console.error('[playbook3d] ❌ Failed to load shared/playbook.json:', err);
    }
})();
