/* ==========================================
   CHALKBOARD FOOTBALL COACH - COACHING STAFF
   ========================================== */

export const OFF_STYLES = ["spread", "vertical", "west coast", "run and gun", "option", "smash mouth"];
export const DEF_STYLES = ["zone blitz", "man blitz", "man coverage", "zone coverage", "run focus", "pass focus"];
export const ST_STYLES = ["conservative", "balanced", "aggressive"];

export class Coach {
    constructor(name, role, tier, cost, specialtyDesc, bonusVal, styles = {}) {
        this.name = name;
        this.role = role; // "HC", "OC", "DC", "PT", "ST", "SC", "MD"
        this.tier = tier; // "Bronze", "Silver", "Gold", "Legendary"
        this.cost = cost;
        this.specialtyDesc = specialtyDesc;
        this.bonusVal = bonusVal;
        
        // Coach Tactics Alignment Styles
        this.offStyle = styles.offStyle || "";
        this.defStyle = styles.defStyle || "";
        this.stStyle = styles.stStyle || "";
    }

    getRoleLabel() {
        if (this.role === "HC") return "Head Coach";
        if (this.role === "OC") return "Offensive Coordinator";
        if (this.role === "DC") return "Defensive Coordinator";
        if (this.role === "PT") return "Physical Trainer";
        if (this.role === "ST") return "Special Teams Coach";
        if (this.role === "SC") return "Team Scout";
        return "Team Doctor";
    }

    getStylesLabel() {
        if (this.role === "HC") {
            return `Style: Off: ${this.offStyle.toUpperCase()} | Def: ${this.defStyle.toUpperCase()} | ST: ${this.stStyle.toUpperCase()}`;
        }
        if (this.role === "OC" && this.offStyle) {
            return `Style: ${this.offStyle.toUpperCase()}`;
        }
        if (this.role === "DC" && this.defStyle) {
            return `Style: ${this.defStyle.toUpperCase()}`;
        }
        if (this.role === "ST" && this.stStyle) {
            return `Style: ${this.stStyle.toUpperCase()}`;
        }
        return "";
    }
}

export function generateCoachMarket() {
    const market = [];
    const hcNames = ["Bill Belichick Jr.", "Andy Reid Jr.", "Sean McVay Jr.", "Mike Tomlin Jr.", "Jim Harbaugh Jr."];
    const ocNames = ["Marcus Whipple", "Lane Kiffin", "Kyle Shanahan Jr.", "Ken Dorsey", "Charlie Weis Jr."];
    const dcNames = ["Wade Phillips Jr.", "Rex Ryan Jr.", "Vic Fangio III", "Robert Saleh Jr.", "Dan Quinn Jr."];
    const ptNames = ["Tommy Moffitt", "Mickey Marotti", "Scott Cochran", "Ben Herbert", "Aaron Feld"];
    const stNames = ["Dave Toub Jr.", "John Harbaugh Jr.", "Rich Bisaccia Jr.", "Chris Tabor Jr."];
    const scNames = ["Mel Kiper III", "Todd McShay Jr.", "Gil Brandt Jr.", "John Dorsey Jr."];
    const mdNames = ["Dr. James Andrews Jr.", "Dr. Neal ElAttrache Jr.", "Dr. Robert Anderson Jr."];

    const specs = {
        "HC": [
            { desc: "General Manager (+10% all stats growth)", val: 0.10, tier: "Bronze", cost: 250000 },
            { desc: "Program Director (+20% all stats growth)", val: 0.20, tier: "Silver", cost: 500000 },
            { desc: "Franchise Builder (+30% all stats growth)", val: 0.30, tier: "Gold", cost: 900000 },
            { desc: "Championship Architect (+45% all stats growth)", val: 0.45, tier: "Legendary", cost: 1600000 }
        ],
        "OC": [
            { desc: "Pass Specialist (+15% OC tactics)", val: 0.15, tier: "Bronze", cost: 150000 },
            { desc: "West Coast Guru (+25% OC tactics)", val: 0.25, tier: "Silver", cost: 350000 },
            { desc: "Spread Master (+35% OC tactics)", val: 0.35, tier: "Gold", cost: 650000 },
            { desc: "Offensive Genius (+50% OC tactics)", val: 0.50, tier: "Legendary", cost: 1200000 }
        ],
        "DC": [
            { desc: "Zone Coverage (+15% DC tactics)", val: 0.15, tier: "Bronze", cost: 150000 },
            { desc: "Blitz Specialist (+25% DC tactics)", val: 0.25, tier: "Silver", cost: 350000 },
            { desc: "46 Defense Disciple (+35% DC tactics)", val: 0.35, tier: "Gold", cost: 650000 },
            { desc: "Defensive Mastermind (+50% DC tactics)", val: 0.50, tier: "Legendary", cost: 1200000 }
        ],
        "PT": [
            { desc: "Cardio Focus (+15% Physical training)", val: 0.15, tier: "Bronze", cost: 120000 },
            { desc: "Powerlifting Coach (+25% Physical training)", val: 0.25, tier: "Silver", cost: 300000 },
            { desc: "Speed & Agility Trainer (+35% Physical training)", val: 0.35, tier: "Gold", cost: 550000 },
            { desc: "Elite Fitness Coordinator (+50% Physical training)", val: 0.50, tier: "Legendary", cost: 1000000 }
        ],
        "ST": [
            { desc: "Kicking Trainer (+20% Kicker stats)", val: 0.20, tier: "Bronze", cost: 100000 },
            { desc: "Special Teams Coordinator (+35% Kicker stats)", val: 0.35, tier: "Silver", cost: 250000 },
            { desc: "Special Teams Specialist (+50% Kicker stats)", val: 0.50, tier: "Gold", cost: 450000 }
        ],
        "SC": [
            { desc: "Regional Talent Scout (+10% Opponent insight)", val: 0.10, tier: "Bronze", cost: 100000 },
            { desc: "National Scouting Director (+20% Opponent insight)", val: 0.20, tier: "Silver", cost: 250000 },
            { desc: "Master Scout (Reveals plays in match)", val: 0.40, tier: "Gold", cost: 500000 }
        ],
        "MD": [
            { desc: "Physical Therapist (+20% Weekly fatigue recovery)", val: 0.20, tier: "Bronze", cost: 120000 },
            { desc: "Lead Sports Doctor (+35% Weekly fatigue recovery)", val: 0.35, tier: "Silver", cost: 280000 },
            { desc: "Renowned Orthopedic Surgeon (+55% Weekly fatigue recovery)", val: 0.55, tier: "Gold", cost: 600000 }
        ]
    };

    const pickName = (list) => list[Math.floor(Math.random() * list.length)];

    const roles = ["HC", "OC", "DC", "PT", "ST", "SC", "MD"];
    roles.forEach(role => {
        const specList = specs[role];
        const names = role === "HC" ? hcNames : (role === "OC" ? ocNames : (role === "DC" ? dcNames : (role === "PT" ? ptNames : (role === "ST" ? stNames : (role === "SC" ? scNames : mdNames)))));
        
        const count = Math.random() < 0.6 ? 1 : 2;
        for (let c = 0; c < count; c++) {
            const item = specList[Math.floor(Math.random() * specList.length)];
            
            // Choose styles
            let styles = {};
            if (role === "HC") {
                styles.offStyle = OFF_STYLES[Math.floor(Math.random() * OFF_STYLES.length)];
                styles.defStyle = DEF_STYLES[Math.floor(Math.random() * DEF_STYLES.length)];
                styles.stStyle = ST_STYLES[Math.floor(Math.random() * ST_STYLES.length)];
            } else if (role === "OC") {
                styles.offStyle = OFF_STYLES[Math.floor(Math.random() * OFF_STYLES.length)];
            } else if (role === "DC") {
                styles.defStyle = DEF_STYLES[Math.floor(Math.random() * DEF_STYLES.length)];
            } else if (role === "ST") {
                styles.stStyle = ST_STYLES[Math.floor(Math.random() * ST_STYLES.length)];
            }

            market.push(new Coach(
                pickName(names), 
                role, 
                item.tier, 
                item.cost + Math.round((Math.random() - 0.5) * 30000), 
                item.desc, 
                item.val,
                styles
            ));
        }
    });

    return market;
}

export function getDefaultStaff() {
    // Standard starting defaults
    return {
        headCoach: new Coach("Coach McCarthy", "HC", "Bronze", 0, "Staff Overseer (+5% all growth)", 0.05, {
            offStyle: "spread",
            defStyle: "man coverage",
            stStyle: "balanced"
        }),
        offensiveCoordinator: new Coach("Coach Miller", "OC", "Bronze", 0, "Basic Offense (+5% tactics)", 0.05, {
            offStyle: "spread"
        }),
        defensiveCoordinator: new Coach("Coach Davis", "DC", "Bronze", 0, "Basic Defense (+5% tactics)", 0.05, {
            defStyle: "man coverage"
        }),
        physicalTrainer: new Coach("Coach Smith", "PT", "Bronze", 0, "Basic Physical (+5% conditioning)", 0.05),
        specialTeamsCoach: new Coach("Coach Bowden", "ST", "Bronze", 0, "Basic Kick Specialist (+5% kicker)", 0.05, {
            stStyle: "balanced"
        }),
        teamScout: new Coach("Coach Kiper", "SC", "Bronze", 0, "Basic Scouting Report", 0.05),
        teamDoctor: new Coach("Dr. Jones", "MD", "Bronze", 0, "Basic Fatigue Care (+5% recovery)", 0.05)
    };
}
