/* ==========================================
   CHALKBOARD FOOTBALL COACH - PLAYBOOKS & PLAYS
   ==========================================
   Routes are defined in yards relative to each player's LOS starting position.
   Offense moves Left → Right (increasing X = downfield).
   Y axis: 0 = top sideline, 53.3 = bottom sideline. Center = 26.65.
   Negative Y = toward top sideline, Positive Y = toward bottom sideline.
   Defense assignments: "rush" | "man" | "zone" | "deep" | "flat"
*/

// ═══════════════════════════════════════════════════════════════
//  OFFENSIVE PLAYBOOKS
// ═══════════════════════════════════════════════════════════════

export const OFFENSIVE_PLAYBOOKS = {

    // ─────────────────────────────────────────────────────────────
    //  1. MIKE MARTZ 2000 RAMS — Air Coryell (Vertical Passing)
    // ─────────────────────────────────────────────────────────────
    "ram_2000": {
        name: "Mike Martz 2000 Rams (Air Coryell)",
        style: "Aggressive Deep Pass",
        scouting: "Unlock high-risk, high-reward vertical passing and spread shotgun formations.",
        plays: [
            {
                id: "rams_four_verts",
                name: "Trips RT — Four Verticals",
                type: "pass", formation: "Shotgun Trips",
                desc: "All four eligible skill players sprint straight downfield. Safeties must choose — somebody is open.",
                routes: {
                    WR1: [{x:0,y:0},{x:8,y:0},{x:35,y:0}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:30,y:-3}],
                    WR3: [{x:0,y:0},{x:12,y:0},{x:32,y:3}],
                    RB:  [{x:0,y:0},{x:3,y:5},{x:8,y:5}]
                }
            },
            {
                id: "rams_deep_post",
                name: "80 Post Corner Combo",
                type: "pass", formation: "Shotgun Spread",
                desc: "WR1 runs a double-move post; WR2 breaks to the corner. Stresses deep safeties.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:26,y:-8}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:20,y:7}],
                    WR3: [{x:0,y:0},{x:7,y:0},{x:12,y:-3}],
                    RB:  [{x:0,y:0},{x:2,y:4},{x:6,y:4}]
                }
            },
            {
                id: "rams_hb_screen",
                name: "Rams Slip Screen",
                type: "pass", formation: "Shotgun Spread",
                desc: "OL invites the rush, slips a screen to the RB who has blockers in space.",
                routes: {
                    WR1: [{x:0,y:0},{x:18,y:0}],
                    WR2: [{x:0,y:0},{x:14,y:3}],
                    WR3: [{x:0,y:0},{x:10,y:-2}],
                    RB:  [{x:0,y:0},{x:-2,y:-5},{x:4,y:-5}]
                }
            },
            {
                id: "rams_sluggo",
                name: "Z-Sluggo Out (Double Move)",
                type: "pass", formation: "Shotgun 2×2",
                desc: "WR1 sells a slant, cuts hard back outside. WR2 runs a deep comeback.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:-3},{x:12,y:0},{x:18,y:4}],
                    WR2: [{x:0,y:0},{x:14,y:0},{x:20,y:5}],
                    WR3: [{x:0,y:0},{x:8,y:0},{x:16,y:-2}],
                    RB:  [{x:0,y:0},{x:2,y:6},{x:5,y:6}]
                }
            },
            {
                id: "rams_pa_bomb",
                name: "PA Sail — Deep Shot",
                type: "pass", formation: "I-Formation",
                desc: "Fake dive freezes the LBs. QB fakes and launches to the deep sail route.",
                routes: {
                    WR1: [{x:0,y:0},{x:20,y:0},{x:35,y:-6}],
                    WR2: [{x:0,y:0},{x:12,y:4}],
                    WR3: [{x:0,y:0},{x:8,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:4,y:3}]
                }
            },
            {
                id: "rams_mesh",
                name: "Mesh Crossers",
                type: "pass", formation: "Shotgun 2×2",
                desc: "Two receivers cross low at 6 yards, rubbing defenders. Great vs zone and man.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0},{x:12,y:8}],
                    WR2: [{x:0,y:0},{x:6,y:0},{x:12,y:-8}],
                    WR3: [{x:0,y:0},{x:15,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:5},{x:5,y:5}]
                }
            },
            {
                id: "rams_dagger",
                name: "Dagger — Dig + Seam",
                type: "pass", formation: "Shotgun Trips",
                desc: "WR1 runs a deep dig at 18 yards; backside seam occupies the safety. Lethal vs Cover-3.",
                routes: {
                    WR1: [{x:0,y:0},{x:18,y:0},{x:24,y:-5}],
                    WR2: [{x:0,y:0},{x:12,y:0},{x:22,y:2}],
                    WR3: [{x:0,y:0},{x:6,y:2},{x:12,y:2}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "rams_curl_flat",
                name: "Y-Stick / Curl-Flat",
                type: "pass", formation: "Shotgun 2×2",
                desc: "Quick slant-flat combination reads the OLB. Hits curl if LB covers flat; flat if LB stays.",
                routes: {
                    WR1: [{x:0,y:0},{x:10,y:0},{x:12,y:-3}],
                    WR2: [{x:0,y:0},{x:5,y:5},{x:8,y:5}],
                    WR3: [{x:0,y:0},{x:8,y:-2},{x:16,y:-2}],
                    RB:  [{x:0,y:0},{x:2,y:4},{x:5,y:4}]
                }
            },
            {
                id: "rams_wheel",
                name: "RB Wheel Route",
                type: "pass", formation: "Shotgun Split",
                desc: "RB releases into the flat then wheels vertically up the sideline. Nightmare for LBs in coverage.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:25,y:-4}],
                    WR2: [{x:0,y:0},{x:8,y:3},{x:16,y:3}],
                    WR3: [{x:0,y:0},{x:6,y:-3}],
                    RB:  [{x:0,y:0},{x:2,y:5},{x:6,y:5},{x:18,y:5}]
                }
            },
            {
                id: "rams_hitch_go",
                name: "Hitch-and-Go",
                type: "pass", formation: "Shotgun 3×1",
                desc: "WR sells the 5-yard hitch, breaks vertical. Cornerback bites on the stop-route fake.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0},{x:6,y:0},{x:28,y:0}],
                    WR2: [{x:0,y:0},{x:10,y:4},{x:16,y:4}],
                    WR3: [{x:0,y:0},{x:8,y:-2}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "rams_sprint_out",
                name: "Sprint Out — Right Hash",
                type: "pass", formation: "I-Formation",
                desc: "QB sprints right and reads the boundary. Forces defense to chase.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:20,y:-4}],
                    WR2: [{x:0,y:0},{x:8,y:2},{x:14,y:2}],
                    WR3: [{x:0,y:0},{x:10,y:0},{x:18,y:0}],
                    RB:  [{x:0,y:0},{x:4,y:-3},{x:8,y:-3}]
                }
            },
            {
                id: "rams_hail_mary",
                name: "Hail Mary — End Zone Flood",
                type: "pass", formation: "Shotgun 5-Wide",
                desc: "Everyone goes deep. Chaos in the end zone. Last-second desperation.",
                routes: {
                    WR1: [{x:0,y:0},{x:20,y:0},{x:45,y:0}],
                    WR2: [{x:0,y:0},{x:20,y:-3},{x:45,y:-3}],
                    WR3: [{x:0,y:0},{x:20,y:3},{x:45,y:3}],
                    RB:  [{x:0,y:0},{x:15,y:5},{x:40,y:5}]
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  2. ANDY REID 2002 EAGLES — West Coast Offense
    // ─────────────────────────────────────────────────────────────
    "eagles_2002": {
        name: "Andy Reid 2002 Eagles (West Coast)",
        style: "Short-Medium Control Pass",
        scouting: "High-percentage timing routes. Stretch the field horizontally and let backs catch out of backfield.",
        plays: [
            {
                id: "wc_semi_angle",
                name: "Trey RT 62 Semi — Angle Route",
                type: "pass", formation: "Trey Formation",
                desc: "RB runs an angle route breaking back inside. Short slant and curl complement.",
                routes: {
                    WR1: [{x:0,y:0},{x:8,y:0},{x:12,y:-4}],
                    WR2: [{x:0,y:0},{x:5,y:0},{x:10,y:4}],
                    WR3: [{x:0,y:0},{x:6,y:0},{x:14,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:4},{x:6,y:1}]
                }
            },
            {
                id: "wc_bench",
                name: "Bunch RT 62 Bench",
                type: "pass", formation: "Bunch Right",
                desc: "Out routes at different depths from a bunch set, creating pick conflicts.",
                routes: {
                    WR1: [{x:0,y:0},{x:10,y:-4}],
                    WR2: [{x:0,y:0},{x:15,y:-4}],
                    WR3: [{x:0,y:0},{x:8,y:2}],
                    RB:  [{x:0,y:0},{x:2,y:5},{x:5,y:5}]
                }
            },
            {
                id: "wc_te_seam",
                name: "63 Texas — TE Seam",
                type: "pass", formation: "I-Formation",
                desc: "Tight end seam down the middle. RB runs Texas (delay into middle).",
                routes: {
                    WR1: [{x:0,y:0},{x:15,y:0}],
                    WR2: [{x:0,y:0},{x:8,y:-3}],
                    WR3: [{x:0,y:0},{x:12,y:0},{x:22,y:0}],
                    RB:  [{x:0,y:0},{x:3,y:4},{x:8,y:1}]
                }
            },
            {
                id: "wc_shallow_cross",
                name: "Shallow Cross — Drive Concept",
                type: "pass", formation: "Shotgun 2×2",
                desc: "WR runs a fast shallow cross at 3 yards. Linebackers can't react fast enough.",
                routes: {
                    WR1: [{x:0,y:0},{x:3,y:0},{x:10,y:-8}],
                    WR2: [{x:0,y:0},{x:8,y:0},{x:16,y:4}],
                    WR3: [{x:0,y:0},{x:12,y:0},{x:22,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "wc_y_cross",
                name: "Y-Cross — TE Over Middle",
                type: "pass", formation: "I-Formation",
                desc: "TE crosses at 10 yards from backside. WR1 clears with a deep fade.",
                routes: {
                    WR1: [{x:0,y:0},{x:15,y:0},{x:28,y:-2}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:18,y:-6}],
                    WR3: [{x:0,y:0},{x:6,y:4}],
                    RB:  [{x:0,y:0},{x:3,y:5}]
                }
            },
            {
                id: "wc_stick",
                name: "Stick Concept — 3rd Down",
                type: "pass", formation: "Shotgun 3×1",
                desc: "Trips side: outside WR runs an out, inside stick route. Perfect for picking up 1st downs.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:-3}],
                    WR2: [{x:0,y:0},{x:6,y:0},{x:6,y:-2}],
                    WR3: [{x:0,y:0},{x:10,y:3}],
                    RB:  [{x:0,y:0},{x:2,y:4},{x:4,y:4}]
                }
            },
            {
                id: "wc_hi_lo",
                name: "Hi-Lo Stretch — Flood",
                type: "pass", formation: "Trips Left",
                desc: "Three receivers flood one zone: deep corner, medium out, quick flat. Zone busters.",
                routes: {
                    WR1: [{x:0,y:0},{x:16,y:-4},{x:22,y:-8}],
                    WR2: [{x:0,y:0},{x:10,y:-4}],
                    WR3: [{x:0,y:0},{x:4,y:-5}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "wc_comeback",
                name: "22-Yard Comeback",
                type: "pass", formation: "Shotgun 2×2",
                desc: "WR1 sprints deep, cuts hard back to 22 yards. Requires big arm. West Coast staple.",
                routes: {
                    WR1: [{x:0,y:0},{x:22,y:0},{x:22,y:-4}],
                    WR2: [{x:0,y:0},{x:12,y:4}],
                    WR3: [{x:0,y:0},{x:8,y:0},{x:16,y:-2}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "wc_rpo_bubble",
                name: "Bubble Screen — RPO",
                type: "pass", formation: "Shotgun 3×1",
                desc: "Quick bubble screen to trips side. OL sells run block. Ball out instantly.",
                routes: {
                    WR1: [{x:0,y:0},{x:-1,y:-2},{x:2,y:-2}],
                    WR2: [{x:0,y:0},{x:2,y:0}],
                    WR3: [{x:0,y:0},{x:3,y:0}],
                    RB:  [{x:0,y:0},{x:1,y:2},{x:3,y:2}]
                }
            },
            {
                id: "wc_option_route",
                name: "Z-Option Route",
                type: "pass", formation: "Singleback",
                desc: "WR reads the DB and runs out or in based on coverage. West Coast precision.",
                routes: {
                    WR1: [{x:0,y:0},{x:8,y:0},{x:12,y:-4}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:10,y:4}],
                    WR3: [{x:0,y:0},{x:6,y:0},{x:12,y:-3}],
                    RB:  [{x:0,y:0},{x:3,y:5},{x:6,y:5}]
                }
            },
            {
                id: "wc_pa_boot",
                name: "PA Boot Leg — Naked",
                type: "pass", formation: "I-Formation",
                desc: "QB fakes inside run and rolls backside. West Coast play-action staple.",
                routes: {
                    WR1: [{x:0,y:0},{x:15,y:0},{x:22,y:-3}],
                    WR2: [{x:0,y:0},{x:8,y:2}],
                    WR3: [{x:0,y:0},{x:6,y:0},{x:10,y:-2}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:5,y:2}]
                }
            },
            {
                id: "wc_draw_pass",
                name: "Draw-Pass Fake",
                type: "pass", formation: "Shotgun 2×2",
                desc: "Draw action freezes DL. QB straightens up and fires to the backside dig.",
                routes: {
                    WR1: [{x:0,y:0},{x:14,y:0},{x:20,y:-4}],
                    WR2: [{x:0,y:0},{x:10,y:4},{x:16,y:4}],
                    WR3: [{x:0,y:0},{x:6,y:0}],
                    RB:  [{x:0,y:0},{x:4,y:0},{x:8,y:0}]
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  3. SEATTLE SEAHAWKS 2000 — Pro Style (Balanced)
    // ─────────────────────────────────────────────────────────────
    "seahawks_2000": {
        name: "Seattle Seahawks 2000 (Pro Style)",
        style: "Balanced / Play Action",
        scouting: "Power run game sets up deep play-action. Effective TE usage. Built for long drives.",
        plays: [
            {
                id: "pro_inside_run",
                name: "I-Form Lead Dive",
                type: "run", formation: "I-Formation",
                desc: "FB leads HB straight up the middle behind center. Classic power run.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:3,y:0}],
                    RB:  [{x:0,y:0},{x:3,y:0},{x:12,y:0}]
                }
            },
            {
                id: "pro_pa_post",
                name: "PA Rollout — Deep Post",
                type: "pass", formation: "I-Formation",
                desc: "Fake draw, QB rolls right and launches to the deep post. Safeties bite on run fake.",
                routes: {
                    WR1: [{x:0,y:0},{x:15,y:0},{x:30,y:-8}],
                    WR2: [{x:0,y:0},{x:10,y:5}],
                    WR3: [{x:0,y:0},{x:8,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:-2},{x:5,y:-2}]
                }
            },
            {
                id: "pro_toss_sweep",
                name: "HB Pitch Sweep — Outer",
                type: "run", formation: "Singleback Wide",
                desc: "Pitch to HB sweeping outside. Pulling guards lead the way.",
                routes: {
                    WR1: [{x:0,y:0},{x:8,y:0}],
                    WR2: [{x:0,y:0},{x:6,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:1,y:6},{x:14,y:8}]
                }
            },
            {
                id: "pro_power_o",
                name: "Power O — Pulling Guard",
                type: "run", formation: "I-Formation",
                desc: "Backside guard pulls through the C-gap hole. FB kicks out the DE. HB follows the puller.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:2},{x:10,y:3}]
                }
            },
            {
                id: "pro_counter_trey",
                name: "Counter Trey",
                type: "run", formation: "I-Formation",
                desc: "HB hesitates, then hits the counter gap as two linemen pull. Punishes aggressive pursuit.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:1,y:-2},{x:3,y:-2},{x:11,y:1}]
                }
            },
            {
                id: "pro_qb_sneak",
                name: "QB Sneak — Short Yardage",
                type: "run", formation: "I-Formation Under Center",
                desc: "QB sneaks behind center on 4th-and-1. Maximum surge.",
                routes: {
                    WR1: [{x:0,y:0},{x:3,y:0}],
                    WR2: [{x:0,y:0},{x:3,y:0}],
                    WR3: [{x:0,y:0},{x:2,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:4,y:0}]
                }
            },
            {
                id: "pro_zone_stretch",
                name: "Outside Zone — Stretch",
                type: "run", formation: "Singleback",
                desc: "OL takes lateral steps and stretches the defense horizontally. RB reads and cuts back.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0}],
                    WR2: [{x:0,y:0},{x:6,y:0}],
                    WR3: [{x:0,y:0},{x:5,y:0}],
                    RB:  [{x:0,y:0},{x:1,y:4},{x:4,y:4},{x:12,y:5}]
                }
            },
            {
                id: "pro_draw",
                name: "Delay Draw",
                type: "run", formation: "Shotgun",
                desc: "QB drops back like pass, hands off on a delay. DL stands up, creating running lanes.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0}],
                    WR2: [{x:0,y:0},{x:12,y:0}],
                    WR3: [{x:0,y:0},{x:10,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:5,y:0},{x:14,y:0}]
                }
            },
            {
                id: "pro_pa_te_flat",
                name: "PA — TE Flat + Deep",
                type: "pass", formation: "I-Formation",
                desc: "Run fake holds safety. TE leaks to flat while WR1 runs deep corner.",
                routes: {
                    WR1: [{x:0,y:0},{x:14,y:0},{x:22,y:-6}],
                    WR2: [{x:0,y:0},{x:5,y:5},{x:8,y:5}],
                    WR3: [{x:0,y:0},{x:8,y:0},{x:16,y:-3}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:4,y:4}]
                }
            },
            {
                id: "pro_sprint_draw",
                name: "Sprint Draw — HB Off Tackle",
                type: "run", formation: "Singleback",
                desc: "Sprint action left, HB cuts off tackle to the right. Defense chases the QB fake.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:-3},{x:10,y:-4}]
                }
            },
            {
                id: "pro_te_over",
                name: "TE Over — Curl Flat",
                type: "pass", formation: "Singleback",
                desc: "TE runs a seam-sit while WR curls. Classic 2-man combination.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:14,y:-3}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:20,y:0}],
                    WR3: [{x:0,y:0},{x:5,y:5}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "pro_goal_line_dive",
                name: "Goal Line Smash",
                type: "run", formation: "Goal Line",
                desc: "FB and HB stack up the middle in goal-line formation. Short field, maximum blocking.",
                routes: {
                    WR1: [{x:0,y:0},{x:3,y:0}],
                    WR2: [{x:0,y:0},{x:3,y:0}],
                    WR3: [{x:0,y:0},{x:2,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:5,y:0}]
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  4. 2004 PATRIOTS — Charlie Weis (Spread & Run-Pass Option)
    // ─────────────────────────────────────────────────────────────
    "patriots_2004": {
        name: "2004 New England Patriots (Spread & Versatile)",
        style: "Spread / Run-Pass Option",
        scouting: "Uses motion, shifts, and personnel mismatches to exploit defenses. Adaptable to any opponent.",
        plays: [
            {
                id: "ne_motion_slant",
                name: "H-Motion Slant",
                type: "pass", formation: "Shotgun",
                desc: "H-back motions across pre-snap. Defense adjusts, creating a slant window.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:-3},{x:12,y:-3}],
                    WR2: [{x:0,y:0},{x:6,y:2},{x:12,y:2}],
                    WR3: [{x:0,y:0},{x:4,y:0},{x:10,y:-4}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "ne_spread_run",
                name: "Spread Zone — Inside",
                type: "run", formation: "Shotgun Spread",
                desc: "5 wide aligns, defense spreads. QB hands off inside to RB running zone.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:10,y:1}]
                }
            },
            {
                id: "ne_trips_over",
                name: "Trips Over — Y Cross",
                type: "pass", formation: "Shotgun Trips",
                desc: "Trips forces one safety to cover. Backside TE crosses at 12 yards. Space created.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:20,y:0}],
                    WR2: [{x:0,y:0},{x:8,y:2},{x:14,y:2}],
                    WR3: [{x:0,y:0},{x:6,y:-2}],
                    RB:  [{x:0,y:0},{x:3,y:5}]
                }
            },
            {
                id: "ne_empty_rpo",
                name: "Empty — RPO Read",
                type: "pass", formation: "Shotgun Empty",
                desc: "No backs in backfield. QB reads unblocked DE — run or throw bubble instantly.",
                routes: {
                    WR1: [{x:0,y:0},{x:-1,y:-3},{x:3,y:-3}],
                    WR2: [{x:0,y:0},{x:8,y:0},{x:14,y:-3}],
                    WR3: [{x:0,y:0},{x:5,y:0},{x:12,y:3}],
                    RB:  [{x:0,y:0},{x:2,y:3}]
                }
            },
            {
                id: "ne_levels",
                name: "Levels Concept",
                type: "pass", formation: "Shotgun 2×2",
                desc: "Two receivers cross at different depths — 4 yards and 12 yards. MLB must choose.",
                routes: {
                    WR1: [{x:0,y:0},{x:4,y:0},{x:10,y:-6}],
                    WR2: [{x:0,y:0},{x:12,y:0},{x:18,y:-5}],
                    WR3: [{x:0,y:0},{x:16,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "ne_pa_deep",
                name: "PA Waggle — Deep Cross",
                type: "pass", formation: "I-Formation",
                desc: "QB waggle keeps boots to the right, throws backside deep crosser at 20 yards.",
                routes: {
                    WR1: [{x:0,y:0},{x:20,y:0},{x:28,y:-5}],
                    WR2: [{x:0,y:0},{x:8,y:3}],
                    WR3: [{x:0,y:0},{x:6,y:-2}],
                    RB:  [{x:0,y:0},{x:3,y:4}]
                }
            },
            {
                id: "ne_rb_route",
                name: "RB Texas Route",
                type: "pass", formation: "Singleback",
                desc: "RB check-releases after fake block, runs Texas route inside. Catches LB flat-footed.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:20,y:-4}],
                    WR2: [{x:0,y:0},{x:8,y:0}],
                    WR3: [{x:0,y:0},{x:10,y:3}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:4,y:2},{x:8,y:0}]
                }
            },
            {
                id: "ne_snag",
                name: "Snag Concept — Corner",
                type: "pass", formation: "Shotgun 3×1",
                desc: "Backfield flat, slot snag, outside corner route. Three-man triangle that destroys zones.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:-4},{x:18,y:-8}],
                    WR2: [{x:0,y:0},{x:5,y:0},{x:5,y:2}],
                    WR3: [{x:0,y:0},{x:3,y:-4}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  5. 2006 COWBOYS — Balanced Pro Style
    // ─────────────────────────────────────────────────────────────
    "cowboys_2006": {
        name: "2006 Dallas Cowboys (Balanced Pro)",
        style: "Balanced Run / Pass",
        scouting: "Strong OL runs pairs with quick-passing concepts. TE is a focal point of the offense.",
        plays: [
            {
                id: "dak_power",
                name: "Strong I — Power Right",
                type: "run", formation: "Strong I",
                desc: "FB blocks the hole, HB follows off right tackle. Classic smash-mouth.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:3},{x:10,y:4}]
                }
            },
            {
                id: "dak_dig",
                name: "Post-Dig Combo",
                type: "pass", formation: "Singleback",
                desc: "WR1 digs at 14 yards while WR2 bends to a post. Attacks deep and intermediate zones.",
                routes: {
                    WR1: [{x:0,y:0},{x:14,y:0},{x:20,y:-4}],
                    WR2: [{x:0,y:0},{x:12,y:0},{x:24,y:-5}],
                    WR3: [{x:0,y:0},{x:6,y:4},{x:10,y:4}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "dak_te_seam",
                name: "TE Seam — Split Flow",
                type: "pass", formation: "Singleback",
                desc: "TE splits the hash down the seam. WRs clear corners deep.",
                routes: {
                    WR1: [{x:0,y:0},{x:18,y:0}],
                    WR2: [{x:0,y:0},{x:18,y:0}],
                    WR3: [{x:0,y:0},{x:10,y:0},{x:22,y:0}],
                    RB:  [{x:0,y:0},{x:3,y:5}]
                }
            },
            {
                id: "dak_sweep",
                name: "Jet Sweep — Motion",
                type: "run", formation: "Shotgun",
                desc: "WR goes in jet motion, takes handoff on sweep. Edge speed vs. slow outside defenders.",
                routes: {
                    WR1: [{x:0,y:0},{x:-2,y:0},{x:12,y:-1}],
                    WR2: [{x:0,y:0},{x:6,y:0}],
                    WR3: [{x:0,y:0},{x:5,y:0}],
                    RB:  [{x:0,y:0},{x:1,y:0}]
                }
            },
            {
                id: "dak_screen_rb",
                name: "RB Screen — Tunnel",
                type: "pass", formation: "Shotgun",
                desc: "OL releases downfield as blockers. RB catches inside then follows the wall.",
                routes: {
                    WR1: [{x:0,y:0},{x:14,y:0}],
                    WR2: [{x:0,y:0},{x:12,y:0}],
                    WR3: [{x:0,y:0},{x:10,y:0}],
                    RB:  [{x:0,y:0},{x:-1,y:2},{x:2,y:2},{x:10,y:2}]
                }
            },
            {
                id: "dak_pa_corner",
                name: "PA Corner — Off Fake",
                type: "pass", formation: "I-Formation",
                desc: "Run fake left, WR2 breaks to corner right. Safety rolls with run — corner is open.",
                routes: {
                    WR1: [{x:0,y:0},{x:15,y:0},{x:22,y:-4}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:18,y:6}],
                    WR3: [{x:0,y:0},{x:6,y:2}],
                    RB:  [{x:0,y:0},{x:2,y:-3}]
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  6. BILL WALSH 1985 49ERS — West Coast Foundation
    //     Based on: "85 49ers Bill Walsh Offense (Jerry Rice era)"
    // ─────────────────────────────────────────────────────────────
    "walsh_49ers_1985": {
        name: "Bill Walsh 1985 49ers (Original West Coast)",
        style: "Precision Timing / Route-Running",
        scouting: "The birthplace of the West Coast offense. Stretches defense horizontally with surgical timing passes. Route trees start from '6' & '8' series pass patterns.",
        plays: [
            {
                id: "walsh_red_rt_slant",
                name: "Red RT — 84 Slant (Quick)",
                type: "pass", formation: "Red Right",
                desc: "X and Z run quick slants on the snap. TE runs a seam. QB throws on 3-step drop. Walsh's bread-and-butter quick-strike.",
                routes: {
                    WR1: [{x:0,y:0},{x:3,y:0},{x:7,y:-4}],
                    WR2: [{x:0,y:0},{x:3,y:0},{x:8,y:-4}],
                    WR3: [{x:0,y:0},{x:12,y:0},{x:20,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:5},{x:4,y:5}]
                }
            },
            {
                id: "walsh_brown_rt_out",
                name: "Brown RT — 86 Out",
                type: "pass", formation: "Brown Right",
                desc: "Flanker runs a crisp 10-yard out. Split end runs a deep post to clear the corner. Walsh timing classic.",
                routes: {
                    WR1: [{x:0,y:0},{x:10,y:0},{x:10,y:-5}],
                    WR2: [{x:0,y:0},{x:14,y:0},{x:24,y:-7}],
                    WR3: [{x:0,y:0},{x:6,y:3},{x:10,y:3}],
                    RB:  [{x:0,y:0},{x:2,y:4},{x:5,y:4}]
                }
            },
            {
                id: "walsh_green_rt_cross",
                name: "Green RT — 96 Cross (Crossing Route)",
                type: "pass", formation: "Green Right",
                desc: "Deep crossing routes at 15-18 yards with RB check-down. Jerry Rice's signature crossing route.",
                routes: {
                    WR1: [{x:0,y:0},{x:15,y:0},{x:22,y:-8}],
                    WR2: [{x:0,y:0},{x:12,y:0},{x:18,y:7}],
                    WR3: [{x:0,y:0},{x:8,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:4},{x:5,y:4}]
                }
            },
            {
                id: "walsh_red_rt_flag",
                name: "Red RT — 80 Flag Corner",
                type: "pass", formation: "Red Right",
                desc: "WR1 runs a corner flag route; WR2 runs a deep post to hold the safety. Walsh's vertical stretch.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:20,y:5}],
                    WR2: [{x:0,y:0},{x:14,y:0},{x:26,y:-5}],
                    WR3: [{x:0,y:0},{x:6,y:2}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "walsh_shotgun_four_cross",
                name: "Gun Trey — Four Crossers",
                type: "pass", formation: "Shotgun Trey",
                desc: "Four receivers at different depths criss-crossing the field. Linebackers get picked and twisted.",
                routes: {
                    WR1: [{x:0,y:0},{x:4,y:0},{x:12,y:-8}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:18,y:6}],
                    WR3: [{x:0,y:0},{x:16,y:0},{x:24,y:-5}],
                    RB:  [{x:0,y:0},{x:6,y:0},{x:12,y:6}]
                }
            },
            {
                id: "walsh_power_sweep",
                name: "Power I — Sweep Right",
                type: "run", formation: "Power I",
                desc: "FB leads around the right end. Two pulling guards kick out the edge defenders. Classic Power I sweep.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:5},{x:8,y:7},{x:16,y:7}]
                }
            },
            {
                id: "walsh_pa_boot_te",
                name: "PA Boot — TE Flat Leak",
                type: "pass", formation: "Red Right",
                desc: "QB fakes the inside run, boots opposite. TE leaks to the flat; WR1 runs a post behind. Walsh's play-action weapon.",
                routes: {
                    WR1: [{x:0,y:0},{x:15,y:0},{x:26,y:-6}],
                    WR2: [{x:0,y:0},{x:5,y:5},{x:8,y:5}],
                    WR3: [{x:0,y:0},{x:7,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:-2}]
                }
            },
            {
                id: "walsh_inside_trap",
                name: "Brown RT — Inside Trap",
                type: "run", formation: "Brown Right",
                desc: "Guard traps the defensive tackle by letting him penetrate, then blocking him out. Quick-hitting interior run.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:-1},{x:8,y:-1}]
                }
            },
            {
                id: "walsh_sprint_right",
                name: "Sprint Right — X Comeback",
                type: "pass", formation: "Red Right",
                desc: "QB sprints right. WR1 runs a 16-yard comeback; TE runs a flat route as checkdown. Walsh sprint-out pass.",
                routes: {
                    WR1: [{x:0,y:0},{x:16,y:0},{x:16,y:-4}],
                    WR2: [{x:0,y:0},{x:6,y:4},{x:9,y:4}],
                    WR3: [{x:0,y:0},{x:8,y:-2}],
                    RB:  [{x:0,y:0},{x:3,y:-4}]
                }
            },
            {
                id: "walsh_trips_bubble",
                name: "Trips — Y Screen Bubble",
                type: "pass", formation: "Trips Right",
                desc: "Trips creates overload. Outside WR runs a bubble back; inside receivers block for YAC. Walsh's horizontal attack.",
                routes: {
                    WR1: [{x:0,y:0},{x:-1,y:-3},{x:4,y:-3}],
                    WR2: [{x:0,y:0},{x:2,y:0}],
                    WR3: [{x:0,y:0},{x:3,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "walsh_medium_cross",
                name: "Green RT — 62 Dig Cross",
                type: "pass", formation: "Green Right",
                desc: "WR1 and WR3 cross at 12 yards in opposite directions creating a traffic jam for zone defenders.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:18,y:-5}],
                    WR2: [{x:0,y:0},{x:10,y:0},{x:18,y:5}],
                    WR3: [{x:0,y:0},{x:6,y:3},{x:10,y:3}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "walsh_sprint_left_post",
                name: "Sprint Left — Z Post",
                type: "pass", formation: "Red Right",
                desc: "QB sprints left; WR2 (Z) runs a deep post backside. LB can't chase both QB and Z-receiver.",
                routes: {
                    WR1: [{x:0,y:0},{x:18,y:0},{x:28,y:-7}],
                    WR2: [{x:0,y:0},{x:8,y:3},{x:14,y:3}],
                    WR3: [{x:0,y:0},{x:6,y:-3}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  7. 2004 NEW ORLEANS SAINTS — Fast-Tempo Spread
    //     Based on: "2004 New Orleans Saints Offense"
    // ─────────────────────────────────────────────────────────────
    "saints_2004": {
        name: "2004 New Orleans Saints (Fast-Tempo Spread)",
        style: "No-Huddle Spread / Up-Tempo",
        scouting: "High-tempo attack that doesn't let defenses substitute. Uses 4-wide sets and fast screens to stress every zone. Aaron Brooks leading the fast break offense.",
        plays: [
            {
                id: "saints_four_wide_curl",
                name: "Four Wide — Curl Flood",
                type: "pass", formation: "Shotgun 4-Wide",
                desc: "Four receivers run curls at different depths simultaneously. Defense can't bracket everyone.",
                routes: {
                    WR1: [{x:0,y:0},{x:10,y:0},{x:10,y:-3}],
                    WR2: [{x:0,y:0},{x:8,y:0},{x:8,y:-2}],
                    WR3: [{x:0,y:0},{x:12,y:0},{x:12,y:4}],
                    RB:  [{x:0,y:0},{x:6,y:0},{x:6,y:4}]
                }
            },
            {
                id: "saints_no_huddle_slant",
                name: "No-Huddle Quick Slant",
                type: "pass", formation: "No-Huddle Shotgun",
                desc: "Snap immediately after lining up. Slant-flat combination hits before defense can adjust.",
                routes: {
                    WR1: [{x:0,y:0},{x:4,y:0},{x:9,y:-5}],
                    WR2: [{x:0,y:0},{x:4,y:3},{x:9,y:3}],
                    WR3: [{x:0,y:0},{x:8,y:-2}],
                    RB:  [{x:0,y:0},{x:2,y:5},{x:4,y:5}]
                }
            },
            {
                id: "saints_sprint_screen",
                name: "Sprint Screen — WR Crack",
                type: "pass", formation: "Shotgun Spread",
                desc: "WR cracks block for RB. RB takes a quick screen with two blockers in front.",
                routes: {
                    WR1: [{x:0,y:0},{x:2,y:0}],
                    WR2: [{x:0,y:0},{x:10,y:0}],
                    WR3: [{x:0,y:0},{x:8,y:0}],
                    RB:  [{x:0,y:0},{x:-1,y:-3},{x:5,y:-3},{x:12,y:-2}]
                }
            },
            {
                id: "saints_bunch_cross",
                name: "Bunch — Triple Cross",
                type: "pass", formation: "Bunch Left",
                desc: "Three receivers bunch left and all cross to the right at different depths. Creates rub routes.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0},{x:14,y:-8}],
                    WR2: [{x:0,y:0},{x:8,y:0},{x:16,y:-5}],
                    WR3: [{x:0,y:0},{x:12,y:0},{x:20,y:-3}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "saints_empty_quick",
                name: "Empty — Quick Hitch & Go",
                type: "pass", formation: "Empty Backfield",
                desc: "5-wide empty; QB gets ball out in under 2 seconds. Hitch-and-go to boundary WR.",
                routes: {
                    WR1: [{x:0,y:0},{x:4,y:0},{x:5,y:0},{x:22,y:0}],
                    WR2: [{x:0,y:0},{x:6,y:-3}],
                    WR3: [{x:0,y:0},{x:8,y:3},{x:12,y:3}],
                    RB:  [{x:0,y:0},{x:4,y:-4}]
                }
            },
            {
                id: "saints_fast_draw",
                name: "Fast-Tempo Draw",
                type: "run", formation: "No-Huddle Shotgun",
                desc: "Ball snapped fast, inside draw catches defense still setting up. Zone blocking in shotgun.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0}],
                    WR2: [{x:0,y:0},{x:6,y:0}],
                    WR3: [{x:0,y:0},{x:5,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:4,y:0},{x:12,y:0}]
                }
            },
            {
                id: "saints_dbl_move_go",
                name: "Speed Out Double Move",
                type: "pass", formation: "Shotgun 3×1",
                desc: "WR sells the speed out cut, turns and goes vertical. CB sitting on out route is beaten deep.",
                routes: {
                    WR1: [{x:0,y:0},{x:8,y:0},{x:10,y:-3},{x:24,y:-3}],
                    WR2: [{x:0,y:0},{x:6,y:0},{x:12,y:5}],
                    WR3: [{x:0,y:0},{x:10,y:0}],
                    RB:  [{x:0,y:0},{x:3,y:4}]
                }
            },
            {
                id: "saints_power_iso",
                name: "Power Iso — Fullback Lead",
                type: "run", formation: "I-Formation",
                desc: "FB isolates on MLB; HB follows through the A-gap. Hard inside run at linebacker.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:0},{x:9,y:0}]
                }
            },
            {
                id: "saints_corner_post",
                name: "Corner-Post Combo",
                type: "pass", formation: "Shotgun 2×2",
                desc: "WR1 runs corner, WR2 runs post. Forces safety to pick — one is always open over the top.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:22,y:6}],
                    WR2: [{x:0,y:0},{x:14,y:0},{x:26,y:-5}],
                    WR3: [{x:0,y:0},{x:8,y:0},{x:14,y:-3}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "saints_option_keeper",
                name: "QB Option — Keeper Right",
                type: "run", formation: "Shotgun",
                desc: "QB reads DE — if DE crashes, keeps outside; if DE holds, hands off. Option football from shotgun.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:1,y:0},{x:8,y:3}]
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  8. CARDINALS PLAYBOOK — Kurt Warner Era
    //     Based on: "cardinals playbook.md"
    // ─────────────────────────────────────────────────────────────
    "cardinals_warner": {
        name: "Arizona Cardinals — Warner/Whisenhunt Era",
        style: "West Coast Spread / Explosive",
        scouting: "Dangerous vertical passing with max-protect and deep shots. Kurt Warner's precision and Larry Fitzgerald's route-running. Uses 22/23 DBL series runs and 62 protections.",
        plays: [
            {
                id: "cards_22_dbl",
                name: "22 DBL — Inside Zone Right",
                type: "run", formation: "I-Formation",
                desc: "Double-team blocking scheme at the point of attack. Both guards and center collapse the interior. Great short-yardage run.",
                routes: {
                    WR1: [{x:0,y:0},{x:5,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:2},{x:9,y:2}]
                }
            },
            {
                id: "cards_23_dbl",
                name: "23 DBL — Iso Left",
                type: "run", formation: "Deuce Formation",
                desc: "FB isolates on LOLB. HB hits the outside B-gap. Two-back double-team run to the strong side.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:-2},{x:9,y:-3}]
                }
            },
            {
                id: "cards_62_sort",
                name: "62 Sort — Inside Crossing",
                type: "pass", formation: "Ace Formation",
                desc: "Sort routes: WR1 runs a quick inside cross at 6 yards; TE releases to the flat. Classic 62-protection pass.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0},{x:12,y:-6}],
                    WR2: [{x:0,y:0},{x:5,y:4},{x:8,y:4}],
                    WR3: [{x:0,y:0},{x:10,y:0},{x:18,y:-3}],
                    RB:  [{x:0,y:0},{x:2,y:5}]
                }
            },
            {
                id: "cards_80_blunt",
                name: "80 Blunt Pass — PA Waggle",
                type: "pass", formation: "Fan Formation",
                desc: "Play-action fake with QB waggling. TE circles to the flat; WR1 runs the deep post behind the safety.",
                routes: {
                    WR1: [{x:0,y:0},{x:18,y:0},{x:28,y:-8}],
                    WR2: [{x:0,y:0},{x:6,y:4},{x:9,y:4}],
                    WR3: [{x:0,y:0},{x:8,y:0},{x:14,y:-2}],
                    RB:  [{x:0,y:0},{x:2,y:-2}]
                }
            },
            {
                id: "cards_base_out",
                name: "Base — 12-Yard Out",
                type: "pass", formation: "Ace Formation",
                desc: "WR1 runs a crisp 12-yard out route. WR2 runs deep seam to occupy the safety. Warner precision.",
                routes: {
                    WR1: [{x:0,y:0},{x:12,y:0},{x:12,y:-5}],
                    WR2: [{x:0,y:0},{x:16,y:0},{x:26,y:0}],
                    WR3: [{x:0,y:0},{x:6,y:2},{x:10,y:2}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "cards_middle_hi_lo",
                name: "Middle Hi-Lo — TE Cross",
                type: "pass", formation: "Fan Formation",
                desc: "TE crosses high (15 yds); RB angles low (5 yds). Middle linebacker must choose between two threats.",
                routes: {
                    WR1: [{x:0,y:0},{x:14,y:0},{x:20,y:-4}],
                    WR2: [{x:0,y:0},{x:15,y:0},{x:22,y:-5}],
                    WR3: [{x:0,y:0},{x:5,y:3},{x:8,y:1}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "cards_trips_flood",
                name: "Trips Rt — Three-Level Flood",
                type: "pass", formation: "Trips Right",
                desc: "Three receivers flood the right zone. Corner, out, and flat at 20/12/4 yards. Zone beaters.",
                routes: {
                    WR1: [{x:0,y:0},{x:20,y:-5},{x:28,y:-9}],
                    WR2: [{x:0,y:0},{x:12,y:-4}],
                    WR3: [{x:0,y:0},{x:4,y:-5}],
                    RB:  [{x:0,y:0},{x:2,y:4}]
                }
            },
            {
                id: "cards_empty_slant",
                name: "Empty — Quick Slant Both Sides",
                type: "pass", formation: "Empty Trips",
                desc: "Empty formation; WRs on both sides slant simultaneously. Quick 3-step drop, beat the blitz.",
                routes: {
                    WR1: [{x:0,y:0},{x:4,y:0},{x:8,y:-5}],
                    WR2: [{x:0,y:0},{x:4,y:0},{x:8,y:-3}],
                    WR3: [{x:0,y:0},{x:4,y:0},{x:8,y:4}],
                    RB:  [{x:0,y:0},{x:4,y:4},{x:8,y:2}]
                }
            },
            {
                id: "cards_pa_deep_post",
                name: "PA — Fitz Deep Post",
                type: "pass", formation: "Deuce Right",
                desc: "Fake toss to HB, QB looks deep to WR1 (Larry Fitzgerald) on a deep post. Safeties freeze on fake.",
                routes: {
                    WR1: [{x:0,y:0},{x:16,y:0},{x:30,y:-8}],
                    WR2: [{x:0,y:0},{x:12,y:4}],
                    WR3: [{x:0,y:0},{x:8,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:3},{x:4,y:3}]
                }
            },
            {
                id: "cards_43_run",
                name: "43 Run — Power Sweep Left",
                type: "run", formation: "Lawn Formation",
                desc: "Guards pull left; FB kicks out. HB follows the convoy around the left end. Old-school Cardinals smash.",
                routes: {
                    WR1: [{x:0,y:0},{x:6,y:0}],
                    WR2: [{x:0,y:0},{x:5,y:0}],
                    WR3: [{x:0,y:0},{x:4,y:0}],
                    RB:  [{x:0,y:0},{x:2,y:-5},{x:10,y:-7}]
                }
            }
        ]
    }
};


// ═══════════════════════════════════════════════════════════════
//  DEFENSIVE PLAYBOOKS
// ═══════════════════════════════════════════════════════════════

export const DEFENSIVE_PLAYBOOKS = {

    // ─────────────────────────────────────────────────────────────
    //  1. BUDDY RYAN 1985 BEARS — 46 Bear Defense
    // ─────────────────────────────────────────────────────────────
    "bears_1985": {
        name: "Buddy Ryan 1985 Bears (46 Defense)",
        style: "Heavy Blitz / Man-to-Man",
        scouting: "8 men in the box. Suffocates the run and overwhelms QB with pressure from everywhere.",
        plays: [
            {
                id: "bears_46_blitz",
                name: "46 Bear — A-Gap Storm",
                type: "blitz", formation: "46 Bear Front",
                desc: "LOLB and MLB crash both A-gaps simultaneously. Instant QB pressure.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"rush", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            },
            {
                id: "bears_cover_1",
                name: "46 Cover 1 Man-Press",
                type: "man", formation: "46 Bear Front",
                desc: "CBs press receivers at the line. FS plays single-high. LBs rush.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            },
            {
                id: "bears_double_a_gap",
                name: "Double A-Gap Blitz",
                type: "blitz", formation: "46 Bear Pinch",
                desc: "Both inside gaps attacked by MLB splits. DTs slant outside. Collapses the pocket.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"man", MLB:"rush", ROLB:"rush",
                    CB1:"man", CB2:"man", SS:"zone", FS:"deep"
                }
            },
            {
                id: "bears_overload_right",
                name: "Overload Right Blitz",
                type: "blitz", formation: "46 Over",
                desc: "5 rushers attack the right side of the offense. OL can't block them all.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"rush", ROLB:"rush",
                    CB1:"man", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "bears_zero_blitz",
                name: "Zero Coverage — All-Out Blitz",
                type: "blitz", formation: "46 Zero",
                desc: "No safety help. Every DB plays man. Seven rushers. High risk, high reward.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"rush", ROLB:"rush",
                    CB1:"man", CB2:"man", SS:"man", FS:"man"
                }
            },
            {
                id: "bears_spy_qb",
                name: "QB Spy — Contain",
                type: "man", formation: "46 Contain",
                desc: "MLB spies the QB's run lanes. DE and OLB contain edges. Effective vs mobile QBs.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"zone", FS:"deep"
                }
            },
            {
                id: "bears_nickel_blitz",
                name: "Nickel Fire — DB Blitz",
                type: "blitz", formation: "Nickel 46",
                desc: "SS blitzes off the slot. 5 rushers vs 5 blockers. CB1 gambles in man.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"rush", FS:"deep"
                }
            },
            {
                id: "bears_cover3_cloud",
                name: "Cover 3 — Cloud Flat",
                type: "zone", formation: "4-3 Under",
                desc: "Three deep zones. CB funnels WR inside. LBs take curl-to-flat zones.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"zone", SS:"zone", FS:"deep"
                }
            },
            {
                id: "bears_goal_line_stand",
                name: "Goal Line Stack — 8 in Box",
                type: "man", formation: "Goal Line Stack",
                desc: "Everyone crowds the line of scrimmage. No run gets through this wall.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"zone", ROLB:"rush",
                    CB1:"man", CB2:"man", SS:"zone", FS:"deep"
                }
            },
            {
                id: "bears_prevent",
                name: "Prevent Defense",
                type: "zone", formation: "3-Deep Prevent",
                desc: "Give up short gains, protect the end zone. Use late in games with a lead.",
                assignments: {
                    LDE:"rush", LDT:"zone", RDT:"zone", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"deep", SS:"deep", FS:"deep"
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  2. BUD CARSON 1991 GIANTS — 3-4 Defense
    // ─────────────────────────────────────────────────────────────
    "giants_1991": {
        name: "Bud Carson 1991 Giants (3-4 Defense)",
        style: "3-4 Tactical Zone / Contain",
        scouting: "3 linemen free up 4 linebackers. Disguise which two LBs blitz to create confusion.",
        plays: [
            {
                id: "giants_34_cover3",
                name: "3-4 Cover 3 Sky",
                type: "zone", formation: "3-4 Front",
                desc: "3 deep zones + 4 short zones. Keeps every route in front.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"zone",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_34_fire",
                name: "3-4 Fire Zone Blitz",
                type: "blitz", formation: "3-4 Front",
                desc: "Outside LBs crash from both edges. DBs rotate into zone. Forces quick decisions.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"zone",
                    LOLB:"rush", ROLB:"rush", MLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_34_inside_blitz",
                name: "3-4 Inside Rush — ILB Blitz",
                type: "blitz", formation: "3-4 Tight",
                desc: "Both inside LBs shoot the A and B gaps. OL must account for 5 rushers.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"rush", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_cover2",
                name: "3-4 Cover 2 — Hard Flats",
                type: "zone", formation: "3-4 Base",
                desc: "Two safeties split the deep halves. CBs jam WRs and sink to flat zones.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"zone",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_tampa2",
                name: "Tampa 2 — MLB Deep",
                type: "zone", formation: "3-4 Cover 2",
                desc: "MLB drops to a deep middle zone. CBs drive on the curl. Middle of field guarded.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"zone",
                    LOLB:"zone", MLB:"deep", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_cover4",
                name: "Cover 4 Quarters",
                type: "zone", formation: "3-4 Deep",
                desc: "Four players cover four deep quarters. No deep ball succeeds. Very run-vulnerable.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"zone",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"deep", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_zero_man",
                name: "Zero Man — No Safety Help",
                type: "man", formation: "3-4 Aggressive",
                desc: "Everybody in man coverage. LOLB rushes off edge. Total commitment to the pass rush.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"man", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"man"
                }
            },
            {
                id: "giants_olb_edge",
                name: "OLB Edge Contain",
                type: "zone", formation: "3-4 Wide",
                desc: "OLBs pin outside the tackles. DTs plug gaps. Stops sweeps and outside runs cold.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_dime_zone",
                name: "Dime Zone — 6 DBs",
                type: "zone", formation: "Dime",
                desc: "Sub-package with 6 defensive backs. Drops everything into zone. Use on 3rd-and-long.",
                assignments: {
                    LDE:"rush", LDT:"zone", RDT:"zone", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "giants_ss_blitz",
                name: "Strong Safety Blitz",
                type: "blitz", formation: "3-4 SS Pressure",
                desc: "SS blitzes off the edge as a 5th rusher. MLB stays back in spy coverage.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"zone",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"rush", FS:"deep"
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  3. STANDARD 4-3 DEFENSE — Balanced All-Purpose
    // ─────────────────────────────────────────────────────────────
    "std_43": {
        name: "Standard 4-3 Defense",
        style: "Balanced Zone / Versatile",
        scouting: "Solid NFL base defense. Adaptable. Strong against both run and pass when played smart.",
        plays: [
            {
                id: "std_cover2",
                name: "4-3 Cover 2 Tampa",
                type: "zone", formation: "4-3 Base",
                desc: "2 deep safeties cover halves. MLB drops into middle hole. CBs jam at line.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_blitz",
                name: "4-3 Sam Fire Blitz",
                type: "blitz", formation: "4-3 Base",
                desc: "Sam (LOLB) fires off the edge as 5th rusher. CBs go man.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_cover3",
                name: "4-3 Cover 3 — Sky",
                type: "zone", formation: "4-3 Base",
                desc: "3 deep zones (FS middle, CB halves). OLBs take curl-flat. Safe catch-all zone.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"deep", SS:"zone", FS:"deep"
                }
            },
            {
                id: "std_man_2",
                name: "4-3 Man Cover 2",
                type: "man", formation: "4-3 Tight",
                desc: "DBs play man with 2-deep safety bracket. Solid against medium routes.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"man", MLB:"zone", ROLB:"man",
                    CB1:"man", CB2:"man", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_nickel",
                name: "Nickel Cover 2 — Pass Prevent",
                type: "zone", formation: "Nickel",
                desc: "Sub-package with extra DB. 5 DBs handle spread formations. Zone-2 behind.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_will_blitz",
                name: "Will Linebacker Blitz",
                type: "blitz", formation: "4-3 Will Pressure",
                desc: "ROLB (Will) fires the weak A-gap. Catches teams off guard on quick throws.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"rush",
                    CB1:"man", CB2:"man", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_cover6",
                name: "Cover 6 — Quarter-Quarter-Half",
                type: "zone", formation: "4-3 Over",
                desc: "Boundary CB plays Cover 4, field side plays Cover 2. Disguises coverage.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_blitz_corner",
                name: "Cornerback Blitz — Overload",
                type: "blitz", formation: "4-3 Corner Blitz",
                desc: "CB2 blitzes off the line while SS rotates into coverage. Surprise pressure off edge.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"rush", SS:"man", FS:"deep"
                }
            },
            {
                id: "std_goal_line",
                name: "Goal Line — Heavy Front",
                type: "man", formation: "Goal Line 6-5",
                desc: "6 down linemen, 5 in coverage. Stop the run at all costs inside the 5-yard line.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"rush", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"zone", FS:"deep"
                }
            },
            {
                id: "std_3rd_long",
                name: "3rd & Long — 4-Verts Prevent",
                type: "zone", formation: "4-3 Prevent",
                desc: "4 rushers, 7 in coverage. Give up underneath routes, protect the sticks.",
                assignments: {
                    LDE:"rush", LDT:"zone", RDT:"zone", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"deep", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_middle_zone",
                name: "Cover 2 — Middle Zone Sink",
                type: "zone", formation: "4-3 Over",
                desc: "MLB and SS sink deep into middle zones. Forces ball to the boundary where corners wait.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"deep", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "std_fs_blitz",
                name: "Free Safety Blitz — Surprise",
                type: "blitz", formation: "4-3 FS Pressure",
                desc: "FS blitzes from deep at the snap. CB1 rotates to center field. Shock value only.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"man", SS:"man", FS:"rush"
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  4. TONY DUNGY / MONTE KIFFIN 1998 BUCCANEERS — Tampa 2
    //     Based on: "1998-Tampa-Bay-Buccaneers-Tony-Dungy-Monte-Kiffin.md"
    // ─────────────────────────────────────────────────────────────
    "bucs_1998": {
        name: "Tony Dungy 1998 Buccaneers (Tampa 2)",
        style: "Tampa 2 / Physical Man Coverage",
        scouting: "The birth of Tampa 2. Jam receivers at the line, MLB runs to the deep middle. Physically sound gap-control run defense. Derrick Brooks and Warren Sapp era.",
        plays: [
            {
                id: "bucs_tampa2_base",
                name: "Tampa 2 — Base Coverage",
                type: "zone", formation: "4-3 Under",
                desc: "CBs jam at the line and sink to flats. MLB sprints to deep middle hole. SS and FS split deep halves. The signature Dungy defense.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"deep", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "bucs_cover1_rob",
                name: "Cover 1 Robber — MLB Robs",
                type: "man", formation: "4-3 Under",
                desc: "All DBs play man. MLB drops into robber position over the middle. Reads QB's eyes. Bait-and-intercept scheme.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            },
            {
                id: "bucs_un3_strong_roll",
                name: "Under-3 Strong Roll",
                type: "zone", formation: "4-3 Under",
                desc: "Under front rolls coverage to the strong side. CB clouds the flat; FS covers strong deep. Dungy's directional zone.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"zone", SS:"zone", FS:"deep"
                }
            },
            {
                id: "bucs_un_china",
                name: "Under-China — Weak Roll",
                type: "zone", formation: "4-3 Under",
                desc: "Coverage rotates weak. CB1 goes deep, FS rolls to weak flat. Creates mismatch against motion to weak side.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"deep", SS:"deep", FS:"zone"
                }
            },
            {
                id: "bucs_gap_control",
                name: "Gap Control — Run Stuff",
                type: "zone", formation: "4-3 Under Run",
                desc: "Each lineman owns one gap. LBs fill gaps immediately on run reads. Nothing gets past the first level.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"zone", FS:"deep"
                }
            },
            {
                id: "bucs_cloud_bump",
                name: "Bump-and-Run Cloud",
                type: "man", formation: "4-3 Cover 2 Man",
                desc: "CBs press and bump at line. SS takes cloud flat to short side. Disrupts timing routes entirely.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"flat", FS:"deep"
                }
            },
            {
                id: "bucs_off_coverage",
                name: "Off Coverage — Cushion",
                type: "zone", formation: "4-3 Cover 2 Off",
                desc: "CBs play 7 yards off. Lets WRs release cleanly but eliminates deep throws. Bait the short game.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "bucs_zone_blitz",
                name: "Zone Blitz — Drop DE",
                type: "blitz", formation: "4-3 Zone Blitz",
                desc: "LB blitzes while DE drops into zone. Creates confusion — offense doesn't know who's rushing. Tampa specialty.",
                assignments: {
                    LDE:"zone", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            },
            {
                id: "bucs_cover2_hard_flat",
                name: "Cover 2 Hard Flat — Jam",
                type: "zone", formation: "4-3 Hard",
                desc: "CBs hard flatten: jam receiver, then drive to flat underneath. Forces WR to go over the top into deep safety.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"flat", CB2:"flat", SS:"deep", FS:"deep"
                }
            },
            {
                id: "bucs_cover3_fire",
                name: "Cover 3 Fire Zone — LB Blitz",
                type: "blitz", formation: "4-3 Fire Zone",
                desc: "LB blitzes strong side. CB drops from man to deep third. Zone rotation behind the blitz.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"zone", SS:"zone", FS:"deep"
                }
            },
            {
                id: "bucs_nickel_man_press",
                name: "Nickel Man-Press — 5 DB",
                type: "man", formation: "Nickel Under",
                desc: "Five DBs in man coverage. Nickel corner presses the slot receiver. No zone help at all. All pressure.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            },
            {
                id: "bucs_prevent_2deep",
                name: "2-Deep Prevent — Late Game",
                type: "zone", formation: "Prevent 2-Deep",
                desc: "Two deep safeties play zone at 15 yards. CBs and LBs take underneath zones. Give up the short; stop the score.",
                assignments: {
                    LDE:"rush", LDT:"zone", RDT:"zone", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"deep", FS:"deep"
                }
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    //  5. PETE CARROLL 2013 SEAHAWKS — Legion of Boom
    //     Based on: "Seahawks 2013 Playbook defensive.md"
    // ─────────────────────────────────────────────────────────────
    "seahawks_2013": {
        name: "Pete Carroll 2013 Seahawks (Legion of Boom)",
        style: "Press Man / Cover 3 / Physical DB Play",
        scouting: "The greatest defense of the modern era. Richard Sherman, Earl Thomas, Kam Chancellor. Cheat Stone 1 Y-Bump is their base. Press coverage, physical LBs, and a dominant pass rush from the front 4.",
        plays: [
            {
                id: "lob_stone1_ybump",
                name: "Stone 1 Y-Bump — Base Cover 1",
                type: "man", formation: "4-3 Over Base",
                desc: "Base Seattle man-free defense. SS bumps the TE at the line ('Y Bump'). CBs press WRs. FS plays single-high deep. Seattle's signature call.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            },
            {
                id: "lob_over1_black",
                name: "Over 1 Y (Black) — Press Man",
                type: "man", formation: "4-3 Over",
                desc: "Over front shifts DL toward strength. Man coverage with FS single-high. Physical press at the line.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"man", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            },
            {
                id: "lob_load1_flex",
                name: "Load 1 Flex — Load China",
                type: "zone", formation: "4-3 Load",
                desc: "Load front with soft zone behind. SS loads to strong flat. Disguises coverage until snap. Load-China rotation.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"zone", CB2:"zone", SS:"flat", FS:"deep"
                }
            },
            {
                id: "lob_under1_china",
                name: "Under 1 Flex — China Coverage",
                type: "zone", formation: "4-3 Under",
                desc: "Under front aligns away from strength. China rotation: CB1 inverts to flat, FS deep. Traps the short sideline pass.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"flat", CB2:"deep", SS:"deep", FS:"zone"
                }
            },
            {
                id: "lob_under1_tokyo",
                name: "Under 1 Solid — Tokyo",
                type: "man", formation: "4-3 Under",
                desc: "Under front. Tokyo call: CBs play press man. SS covers TE man. FS free over the top. Very physical coverage.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            },
            {
                id: "lob_mug_easy_blitz",
                name: "Mug Easy — OLB Blitz",
                type: "blitz", formation: "4-3 Mug",
                desc: "OLBs mug the guards pre-snap, then one or both shoot gaps. Defense shows blitz, only one actually comes.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"rush", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"zone", FS:"deep"
                }
            },
            {
                id: "lob_check_fist",
                name: "Check Fist — Trips Adjustment",
                type: "zone", formation: "4-3 vs Trips",
                desc: "Automatic trips adjustment. FS rolls to cover trips side. CB covers deep third. Rotational zone vs overloads.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"zone", SS:"zone", FS:"deep"
                }
            },
            {
                id: "lob_cover3_base",
                name: "Cover 3 — Seattle Base",
                type: "zone", formation: "4-3 Cover 3",
                desc: "Seattle's base zone. Three deep zones with aggressive flat zones underneath. CB1 takes deep third boundary. The LOB signature zone.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"deep", CB2:"deep", SS:"zone", FS:"deep"
                }
            },
            {
                id: "lob_fire_blitz_cb",
                name: "Fire Zone — CB Blitz",
                type: "blitz", formation: "4-3 Fire Zone",
                desc: "CB blitzes off the corner while DE drops into zone. Creates unexpected outside pressure — Sherman's specialty.",
                assignments: {
                    LDE:"zone", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"rush",
                    CB1:"rush", CB2:"man", SS:"deep", FS:"deep"
                }
            },
            {
                id: "lob_cover2_cloud",
                name: "Cover 2 — Hard Flat Cloud",
                type: "zone", formation: "4-3 Cover 2",
                desc: "CBs play hard flats. SS and FS split the deep halves. Aggressive underneath — forces the ball outside where the crowd is waiting.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"flat", CB2:"flat", SS:"deep", FS:"deep"
                }
            },
            {
                id: "lob_rat_coverage",
                name: "RAT Coverage — Rat Route",
                type: "zone", formation: "4-3 RAT",
                desc: "LB plays 'RAT': drops deep and reads QB's eyes to intercept crossing routes. Earl Thomas concept applied at LB level.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"deep", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"zone", FS:"deep"
                }
            },
            {
                id: "lob_bump_press_out",
                name: "Bump & Run — Press Out Routes",
                type: "man", formation: "4-3 Press",
                desc: "CBs jam receivers at line. Designed specifically to disrupt out routes — press inside leverage forces the WR to fight for position.",
                assignments: {
                    LDE:"rush", LDT:"rush", RDT:"rush", RDE:"rush",
                    LOLB:"zone", MLB:"zone", ROLB:"zone",
                    CB1:"man", CB2:"man", SS:"man", FS:"deep"
                }
            }
        ]
    }
};


// ═══════════════════════════════════════════════════════════════
//  SPECIAL TEAMS
// ═══════════════════════════════════════════════════════════════

export const SPECIAL_TEAMS_PLAYS = {
  PUNT: {
    id: "ST_PUNT",
    name: "Punt Formation",
    type: "PUNT",
    kickYardsBase: 42,
    variance: 8,
    formation: {
      PUNTER: { x: -14, y: 0 },
      GUNNER_L: { x: -1, y: -18 },
      GUNNER_R: { x: -1, y: 18 }
    },
    routes: {}
  }
};

// ═══════════════════════════════════════════════════════════════
//  HELPER — getPlayList
// ═══════════════════════════════════════════════════════════════

export function getPlayList(playbookId, type = "offense") {
    if (type === "offense") {
        const book = OFFENSIVE_PLAYBOOKS[playbookId] || OFFENSIVE_PLAYBOOKS["seahawks_2000"];
        return book.plays;
    } else if (type === "defense") {
        const book = DEFENSIVE_PLAYBOOKS[playbookId] || DEFENSIVE_PLAYBOOKS["std_43"];
        return book.plays;
    } else if (type === "special_teams") {
        return [SPECIAL_TEAMS_PLAYS.PUNT];
    }
}

export const PLAYS = {
  four_verts: {
    id: 'four_verts',
    name: 'Four Verticals',
    type: 'PASS',
    getWaypoints: (los) => ({
      WR1: [
        { x: los + 5, y: 6.0 },
        { x: los + 15, y: 6.0 },
        { x: los + 40, y: 6.0 }
      ],
      WR3: [
        { x: los + 5, y: 18.0 },
        { x: los + 15, y: 18.0 },
        { x: los + 40, y: 18.0 }
      ],
      TE: [
        { x: los + 5, y: 35.0 },
        { x: los + 15, y: 35.0 },
        { x: los + 40, y: 35.0 }
      ],
      WR2: [
        { x: los + 5, y: 47.0 },
        { x: los + 15, y: 47.0 },
        { x: los + 40, y: 47.0 }
      ]
    })
  },
  inside_zone: {
    id: 'inside_zone',
    name: 'Inside Zone',
    type: 'RUN',
    getWaypoints: (los) => ({
      RB: [
        { x: los - 2, y: 26.65 },
        { x: los + 5, y: 26.65 },
        { x: los + 20, y: 26.65 }
      ]
    })
  },
  slant_flats: {
    id: 'slant_flats',
    name: 'Slant / Flats',
    type: 'PASS',
    getWaypoints: (los) => ({
      WR1: [
        { x: los + 5, y: 6.0 },
        { x: los + 12, y: 18.0 }
      ],
      WR2: [
        { x: los + 5, y: 47.0 },
        { x: los + 12, y: 35.0 }
      ],
      WR3: [
        { x: los + 2, y: 15.0 },
        { x: los + 5, y: 6.0 }
      ]
    })
  }
};

