/* ==========================================
   CHALKBOARD FOOTBALL COACH - TEAM & ROSTER
   ========================================== */

export const OFF_STYLES = ["spread", "vertical", "west coast", "run and gun", "option", "smash mouth"];
export const DEF_STYLES = ["zone blitz", "man blitz", "man coverage", "zone coverage", "run focus", "pass focus"];
export const ST_STYLES = ["conservative", "balanced", "aggressive"];

// ─── Legacy Position Code Normalization ───────────────────────────────────────
// Converts old generic/numbered codes → proper position symbols.
// Used internally by generateStats() and calculateOVR() as a safety net.
const _LEGACY_POS_MAP = {
    // Offensive Line (numbered)
    "OL1": "LT",  "OL2": "LG",  "OL3": "C",    "OL4": "RG",   "OL5": "RT",
    "OL":  "LT",
    // Defensive Line (numbered)
    "DL1": "LDE", "DL2": "LDT", "DL3": "RDT",  "DL4": "RDE",
    "DL":  "LDE", "DE": "LDE",  "DT":  "LDT",
    // Linebackers (numbered)
    "LB1": "LOLB","LB2": "MLB", "LB3": "ROLB",
    "LB":  "LOLB","OLB": "LOLB",
    // Defensive Backs (numbered)
    "DB1": "CB1", "DB2": "CB2", "DB3": "SS",   "DB4": "FS",
    "DB":  "CB1", "CB":  "CB1",
    // Wide Receivers
    "WR":  "WR1",
};

function _normalizeLegacyPos(pos) {
    if (!pos) return pos;
    const up = pos.toUpperCase().trim();
    return _LEGACY_POS_MAP[up] || pos;
}



const FIRST_NAMES = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin", "Samuel", "Gregory", "Alexander", "Frank", "Patrick", "Raymond", "Jack", "Dennis", "Jerry", "Tyler"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

export class Player {
    constructor(position, isStarter = true, isRookie = false, yearsAsFreeAgent = 0) {
        this.name = this.generateName();
        this.position = position;
        this.isStarter = isStarter;
        
        // Base Stats (1 to 99)
        this.speed = 50;
        this.accel = 50;
        this.catching = 50;
        this.throwPower = 50;
        this.passAccuracy = 50;
        this.tackle = 50;
        this.strength = 50;
        this.awareness = 50;
        
        // Game State Stats
        this.fatigue = 0;
        this.morale = 75;
        this.preferredStyle = this.assignPreferredStyle();
        
        // Upgrades & Contracts
        this.skillPoints = 0;
        this.yearsAsFreeAgent = yearsAsFreeAgent;
        
        // Age & Career (Rookies are 21-22)
        this.age = isRookie ? Math.floor(Math.random() * 2) + 21 : Math.floor(Math.random() * 12) + 23;
        
        // Character & Off-Field Events
        this.characterRating = Math.floor(Math.random() * 40) + 60; // 60-99
        this.legalStatus = "active"; // "active", "suspended"
        this.suspensionWeeks = 0;
        this.offFieldEvent = "None";
        
        this.generateStats();
        this.ovr = this.calculateOVR();
        this.salary = this.calculateSalary();
    }

    generateName() {
        const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        return `${first.charAt(0)}. ${last}`;
    }

    assignPreferredStyle() {
        const pos = this.position.toUpperCase();
        if (pos === "K" || pos === "P" || pos === "B-K" || pos === "B-P") {
            return ST_STYLES[Math.floor(Math.random() * ST_STYLES.length)];
        }
        
        const isDef = pos.includes("DE") || pos.includes("DT") || pos.includes("LB") || pos.includes("CB") || pos === "SS" || pos === "FS" || pos.includes("DB");
        if (isDef) {
            return DEF_STYLES[Math.floor(Math.random() * DEF_STYLES.length)];
        } else {
            return OFF_STYLES[Math.floor(Math.random() * OFF_STYLES.length)];
        }
    }

    calculateSalary() {
        // High character and younger age is valued, but OVR is the core driver
        const ageModifier = this.age < 26 ? 1.15 : (this.age > 32 ? 0.85 : 1.0);
        return Math.round((Math.round(this.ovr * this.ovr * 60) + 15000) * ageModifier);
    }

    getContractExtensionCost() {
        const ageModifier = this.age < 26 ? 1.2 : (this.age > 32 ? 0.8 : 1.0);
        return Math.round((Math.round(this.ovr * this.ovr * 80) + 25000) * ageModifier);
    }

    upgradeStat(statName, cost) {
        if (this.skillPoints < cost) return false;
        if (this[statName] >= 99) return false;

        this.skillPoints -= cost;
        this[statName] = Math.min(99, this[statName] + 1);
        this.ovr = this.calculateOVR();
        this.salary = this.calculateSalary(); // salary adjusts to upgrades
        return true;
    }

    generateStats() {
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        let posType = this.position;
        if (posType.startsWith("B-")) {
            if (posType === "B-QB") posType = "QB";
            else if (posType === "B-RB") posType = "RB";
            else if (posType.includes("WR")) posType = "WR1";
            else if (posType === "B-OL") posType = "LT";
            else if (posType === "B-DE") posType = "LDE";
            else if (posType === "B-DT") posType = "LDT";
            else if (posType.includes("LB")) posType = "LOLB";
            else posType = "CB1";
        }
        // Normalize any legacy numbered/generic codes
        posType = _normalizeLegacyPos(posType);

        switch (posType) {
            case "QB":
                this.speed = randRange(60, 75);
                this.accel = randRange(65, 80);
                this.catching = randRange(15, 30);
                this.throwPower = randRange(80, 95);
                this.passAccuracy = randRange(76, 92);
                this.tackle = randRange(20, 40);
                this.strength = randRange(55, 70);
                this.awareness = randRange(75, 90);
                break;
            case "RB":
                this.speed = randRange(82, 94);
                this.accel = randRange(84, 95);
                this.catching = randRange(55, 75);
                this.throwPower = randRange(15, 40);
                this.passAccuracy = randRange(15, 35);
                this.tackle = randRange(25, 45);
                this.strength = randRange(66, 80);
                this.awareness = randRange(68, 84);
                break;
            case "WR1":
            case "WR2":
            case "WR3":
                this.speed = randRange(84, 96);
                this.accel = randRange(86, 97);
                this.catching = randRange(78, 94);
                this.throwPower = randRange(15, 30);
                this.passAccuracy = randRange(15, 30);
                this.tackle = randRange(20, 40);
                this.strength = randRange(55, 72);
                this.awareness = randRange(72, 88);
                break;
            case "LT":
            case "LG":
            case "C":
            case "RG":
            case "RT":
                this.speed = randRange(48, 62);
                this.accel = randRange(52, 68);
                this.catching = randRange(10, 20);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(40, 60);
                this.strength = randRange(82, 96);
                this.awareness = randRange(70, 85);
                break;
            case "LDE":
            case "RDE":
                this.speed = randRange(64, 78);
                this.accel = randRange(68, 82);
                this.catching = randRange(10, 20);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(76, 92);
                this.strength = randRange(76, 90);
                this.awareness = randRange(70, 85);
                break;
            case "LDT":
            case "RDT":
                this.speed = randRange(55, 68);
                this.accel = randRange(58, 72);
                this.catching = randRange(10, 15);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(74, 90);
                this.strength = randRange(84, 98);
                this.awareness = randRange(68, 82);
                break;
            case "LOLB":
            case "ROLB":
                this.speed = randRange(74, 86);
                this.accel = randRange(76, 88);
                this.catching = randRange(35, 55);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(74, 88);
                this.strength = randRange(72, 86);
                this.awareness = randRange(72, 85);
                break;
            case "MLB":
                this.speed = randRange(70, 82);
                this.accel = randRange(72, 85);
                this.catching = randRange(40, 60);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(80, 95);
                this.strength = randRange(76, 90);
                this.awareness = randRange(78, 90);
                break;
            case "CB1":
            case "CB2":
                this.speed = randRange(86, 97);
                this.accel = randRange(88, 98);
                this.catching = randRange(65, 82);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(60, 75);
                this.strength = randRange(55, 70);
                this.awareness = randRange(72, 88);
                break;
            case "SS":
                this.speed = randRange(80, 92);
                this.accel = randRange(82, 94);
                this.catching = randRange(60, 76);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(72, 86);
                this.strength = randRange(65, 78);
                this.awareness = randRange(74, 88);
                break;
            case "FS":
                this.speed = randRange(82, 95);
                this.accel = randRange(84, 96);
                this.catching = randRange(68, 84);
                this.throwPower = randRange(10, 20);
                this.passAccuracy = randRange(10, 20);
                this.tackle = randRange(66, 80);
                this.strength = randRange(60, 72);
                this.awareness = randRange(78, 92);
                break;
            case "K":
            case "P":
            case "B-K":
            case "B-P":
                this.speed = randRange(50, 70);
                this.accel = randRange(55, 72);
                this.catching = randRange(10, 30);
                this.throwPower = randRange(80, 95);
                this.passAccuracy = randRange(70, 90);
                this.tackle = randRange(20, 35);
                this.strength = randRange(50, 65);
                this.awareness = randRange(65, 80);
                break;
        }
    }

    calculateOVR() {
        let rawOVR = 50;
        let posType = this.position;
        if (posType.startsWith("B-")) {
            if (posType === "B-QB") posType = "QB";
            else if (posType === "B-RB") posType = "RB";
            else if (posType.includes("WR")) posType = "WR1";
            else if (posType === "B-OL") posType = "LT";
            else if (posType === "B-DE") posType = "LDE";
            else if (posType === "B-DT") posType = "LDT";
            else if (posType.includes("LB")) posType = "LOLB";
            else posType = "CB1";
        }
        // Normalize any legacy numbered/generic codes
        posType = _normalizeLegacyPos(posType);

        switch (posType) {
            case "QB":
                rawOVR = (this.passAccuracy * 0.45) + (this.throwPower * 0.25) + (this.awareness * 0.2) + (this.accel * 0.1);
                break;
            case "RB":
                rawOVR = (this.speed * 0.35) + (this.accel * 0.25) + (this.strength * 0.2) + (this.catching * 0.1) + (this.awareness * 0.1);
                break;
            case "WR1":
            case "WR2":
            case "WR3":
                rawOVR = (this.speed * 0.3) + (this.catching * 0.3) + (this.accel * 0.25) + (this.awareness * 0.1) + (this.strength * 0.05);
                break;
            case "LT":
            case "LG":
            case "C":
            case "RG":
            case "RT":
                rawOVR = (this.strength * 0.55) + (this.awareness * 0.3) + (this.accel * 0.15);
                break;
            case "LDE":
            case "RDE":
                rawOVR = (this.tackle * 0.4) + (this.strength * 0.3) + (this.speed * 0.15) + (this.accel * 0.1) + (this.awareness * 0.05);
                break;
            case "LDT":
            case "RDT":
                rawOVR = (this.strength * 0.45) + (this.tackle * 0.35) + (this.accel * 0.1) + (this.awareness * 0.1);
                break;
            case "LOLB":
            case "ROLB":
                rawOVR = (this.tackle * 0.3) + (this.speed * 0.2) + (this.strength * 0.2) + (this.awareness * 0.2) + (this.accel * 0.1);
                break;
            case "MLB":
                rawOVR = (this.tackle * 0.4) + (this.awareness * 0.3) + (this.strength * 0.15) + (this.speed * 0.1) + (this.accel * 0.05);
                break;
            case "CB1":
            case "CB2":
                rawOVR = (this.speed * 0.35) + (this.accel * 0.25) + (this.catching * 0.15) + (this.tackle * 0.15) + (this.awareness * 0.1);
                break;
            case "SS":
                rawOVR = (this.tackle * 0.3) + (this.speed * 0.2) + (this.awareness * 0.2) + (this.strength * 0.15) + (this.accel * 0.1) + (this.catching * 0.05);
                break;
            case "FS":
                rawOVR = (this.speed * 0.3) + (this.awareness * 0.3) + (this.catching * 0.2) + (this.accel * 0.1) + (this.tackle * 0.1);
                break;
            case "K":
            case "P":
            case "B-K":
            case "B-P":
                rawOVR = (this.throwPower * 0.5) + (this.passAccuracy * 0.4) + (this.awareness * 0.1);
                break;
        }
        return Math.min(99, Math.max(40, Math.round(rawOVR)));
    }

    train(focusType, modifier = 1.0) {
        const gain = (base) => {
            const potential = 100 - base;
            const step = Math.random() * 2 + 0.5;
            const actualGain = step * (potential / 100) * modifier;
            return parseFloat(actualGain.toFixed(2));
        };

        let report = [];
        this.fatigue = Math.min(100, this.fatigue + Math.round(Math.random() * 12 + 8));

        const isDLine = this.position.includes("DE") || this.position.includes("DT");
        const isLB = this.position.includes("LB");
        const isDB = this.position.includes("CB") || this.position === "SS" || this.position === "FS" || this.position.includes("DB");

        if (focusType === "tactics") {
            const awG = gain(this.awareness);
            this.awareness = Math.min(99, this.awareness + awG);
            report.push(`Awareness +${awG}`);

            if (this.position.includes("QB") || this.position === "K") {
                const paG = gain(this.passAccuracy);
                this.passAccuracy = Math.min(99, this.passAccuracy + paG);
                report.push(`Accuracy +${paG}`);
            } else if (isDLine || isLB || isDB) {
                const tkG = gain(this.tackle);
                this.tackle = Math.min(99, this.tackle + tkG);
                report.push(`Tackling +${tkG}`);
            }
        } 
        else if (focusType === "conditioning") {
            const spG = gain(this.speed);
            this.speed = Math.min(99, this.speed + spG);
            report.push(`Speed +${spG}`);

            const acG = gain(this.accel);
            this.accel = Math.min(99, this.accel + acG);
            report.push(`Accel +${acG}`);

            const stG = gain(this.strength);
            this.strength = Math.min(99, this.strength + stG);
            report.push(`Strength +${stG}`);
        } 
        else if (focusType === "film") {
            const awG = gain(this.awareness);
            this.awareness = Math.min(99, this.awareness + awG);
            report.push(`Awareness +${awG}`);

            if (this.position.includes("WR") || this.position.includes("RB") || isDB) {
                const ctG = gain(this.catching);
                this.catching = Math.min(99, this.catching + ctG);
                report.push(`Catching +${ctG}`);
            }
            this.morale = Math.min(100, this.morale + Math.round(Math.random() * 4 + 2));
        }

        this.ovr = this.calculateOVR();
        return report.length > 0 ? `${this.position} ${this.name}: ${report.join(", ")}` : null;
    }

    weeklyReset(docModifier = 1.0) {
        const baseRecovery = Math.round(Math.random() * 20 + 60);
        const multiplier = this.isStarter ? docModifier : docModifier * 1.3;
        this.fatigue = Math.max(0, this.fatigue - Math.round(baseRecovery * multiplier));
    }
}

export class Team {
    constructor(name, primaryColor) {
        this.name = name;
        this.primaryColor = primaryColor;
        this.roster = [];
        // Each team starts with R1, R2, R3 draft picks for the current year
        this.draftPicks = [
            { round: 1, originalTeam: name },
            { round: 2, originalTeam: name },
            { round: 3, originalTeam: name }
        ];
        this.initializeRoster();
    }

    initializeRoster() {
        const starters = [
            "QB", "RB", "WR1", "WR2", "WR3", 
            "LT", "LG", "C", "RG", "RT",
            "LDE", "LDT", "RDT", "RDE", 
            "LOLB", "MLB", "ROLB", 
            "CB1", "CB2", "SS", "FS",
            "K", "P"
        ];
        starters.forEach(pos => {
            this.roster.push(new Player(pos, true));
        });

        const backups = [
            "B-QB", "B-RB", "B-WR1", "B-WR2", "B-OL",
            "B-DE", "B-DT", "B-LB1", "B-LB2", "B-DB1", "B-DB2",
            "B-P"
        ];
        backups.forEach(pos => {
            this.roster.push(new Player(pos, false));
        });
    }

    swapPlayers(idx1, idx2) {
        const p1 = this.roster[idx1];
        const p2 = this.roster[idx2];
        if (!p1 || !p2) return false;

        // Allow any swap — just exchange position slot labels and starter flags
        const tempPos = p1.position;
        const tempStarter = p1.isStarter;

        p1.position = p2.position;
        p1.isStarter = p2.isStarter;

        p2.position = tempPos;
        p2.isStarter = tempStarter;

        p1.ovr = p1.calculateOVR();
        p2.ovr = p2.calculateOVR();

        return true;
    }

    /**
     * Automatically set the best lineup by placing the highest-OVR player
     * at each starting position slot. Considers fatigue so heavily fatigued
     * players (>70%) are deprioritised unless no fresher option exists.
     */
    setBestLineup() {
        // Collect all starting position slots (those currently marked isStarter)
        const starterSlots = this.roster
            .filter(p => p.isStarter)
            .map(p => p.position);

        // Group all roster players by position group
        const groups = {};
        this.roster.forEach((p, idx) => {
            const grp = getPositionGroup(p.position);
            if (!groups[grp]) groups[grp] = [];
            groups[grp].push({ player: p, idx });
        });

        // For each position group, rank players by OVR (fatigue penalty)
        // and assign the top players to starter slots in that group
        Object.keys(groups).forEach(grp => {
            const members = groups[grp];
            // Sort descending: fresh high-OVR players first
            members.sort((a, b) => {
                const aScore = a.player.ovr - (a.player.fatigue > 70 ? 10 : 0);
                const bScore = b.player.ovr - (b.player.fatigue > 70 ? 10 : 0);
                return bScore - aScore;
            });

            // How many starter slots are in this group?
            const slotsForGroup = starterSlots.filter(
                slot => getPositionGroup(slot) === grp
            );
            const numStarters = slotsForGroup.length;

            // Assign starter status: top N players → starters, rest → bench
            members.forEach((m, rank) => {
                m.player.isStarter = rank < numStarters;
                // Assign the matching starter slot position if becoming a starter
                if (m.player.isStarter) {
                    m.player.position = slotsForGroup[rank];
                } else {
                    // Keep a bench position label consistent
                    const benchPos = m.player.position;
                    if (!benchPos.startsWith("B-")) {
                        // Convert specific starter position to a bench label
                        const benchLabel = this._toBenchLabel(benchPos);
                        if (benchLabel) m.player.position = benchLabel;
                    }
                }
                m.player.ovr = m.player.calculateOVR();
            });
        });
    }

    _toBenchLabel(pos) {
        const g = getPositionGroup(pos);
        const map = {
            "QB": "B-QB",
            "RB": "B-RB",
            "WR": "B-WR1",
            "OL": "B-OL",
            "DL": pos.includes("DE") ? "B-DE" : "B-DT",
            "LB": "B-LB1",
            "DB": "B-DB1",
            "K":  pos === "P" ? "B-P" : "B-K"
        };
        return map[g] || null;
    }

    getAverageOVR() {
        const starters = this.roster.filter(p => p.isStarter);
        const total = starters.reduce((sum, player) => sum + player.ovr, 0);
        return Math.round(total / starters.length);
    }

    train(focusType, coaches = {}) {
        let results = [];
        this.roster.forEach(player => {
            let modifier = 1.0;
            const isDef = player.position.includes("DE") || player.position.includes("DT") || player.position.includes("LB") || player.position.includes("CB") || player.position === "SS" || player.position === "FS" || player.position.includes("DB");
            const isOff = player.position.includes("QB") || player.position.includes("WR") || player.position.includes("RB") || player.position === "LT" || player.position === "LG" || player.position === "C" || player.position === "RG" || player.position === "RT" || player.position === "B-OL";

            if (coaches.headCoach) {
                modifier += coaches.headCoach.bonusVal;
            }

            if (focusType === "tactics" && coaches.offensiveCoordinator && isOff) {
                modifier += coaches.offensiveCoordinator.bonusVal;
            }
            if (focusType === "tactics" && coaches.defensiveCoordinator && isDef) {
                modifier += coaches.defensiveCoordinator.bonusVal;
            }
            if (focusType === "conditioning" && coaches.physicalTrainer) {
                modifier += coaches.physicalTrainer.bonusVal;
            }
            if (focusType === "film" && coaches.offensiveCoordinator && (player.position.includes("QB") || player.position.includes("WR"))) {
                modifier += coaches.offensiveCoordinator.bonusVal * 0.5;
            }
            if (focusType === "film" && coaches.defensiveCoordinator && (player.position.includes("DB") || player.position.includes("CB") || player.position === "FS")) {
                modifier += coaches.defensiveCoordinator.bonusVal * 0.5;
            }

            if (player.position === "K" && coaches.specialTeamsCoach) {
                modifier += coaches.specialTeamsCoach.bonusVal * 1.5;
            }

            const report = player.train(focusType, modifier);
            if (report) {
                results.push(report);
            }
        });
        return results;
    }

    weeklyReset(coaches = {}) {
        let docModifier = 1.0;
        if (coaches.teamDoctor) {
            docModifier += coaches.teamDoctor.bonusVal;
        }
        this.roster.forEach(player => player.weeklyReset(docModifier));
    }
}

export function getPositionGroup(pos) {
    if (!pos) return "OTHER";
    // Normalize legacy codes first
    const uPos = _normalizeLegacyPos(pos.toUpperCase());
    if (uPos === "QB" || uPos === "B-QB") return "QB";
    if (uPos.includes("WR") || uPos === "B-WR1" || uPos === "B-WR2") return "WR";
    if (uPos === "RB" || uPos === "B-RB") return "RB";
    if (uPos === "LT" || uPos === "LG" || uPos === "C" || uPos === "RG" || uPos === "RT" || uPos === "B-OL") return "OL";
    if (uPos === "LDE" || uPos === "RDE" || uPos === "LDT" || uPos === "RDT" || uPos === "B-DE" || uPos === "B-DT") return "DL";
    if (uPos === "LOLB" || uPos === "MLB" || uPos === "ROLB" || uPos === "B-LB1" || uPos === "B-LB2") return "LB";
    if (uPos === "CB1" || uPos === "CB2" || uPos === "SS" || uPos === "FS" || uPos === "B-DB1" || uPos === "B-DB2" || uPos.includes("CB") || uPos.includes("DB")) return "DB";
    if (uPos === "K" || uPos === "P" || uPos === "B-K" || uPos === "B-P") return "K";
    return "OTHER";
}

export function getFriendlyPositionName(pos) {
    if (!pos) return "";
    // Normalize any legacy code first
    const normalized = _normalizeLegacyPos(pos.toUpperCase().trim());
    const uPos = normalized.toUpperCase();
    if (uPos === "QB") return "Quarterback (QB)";
    if (uPos === "RB") return "Running Back (RB)";
    if (uPos === "WR1") return "Wide Receiver 1 (WR1)";
    if (uPos === "WR2") return "Wide Receiver 2 (WR2)";
    if (uPos === "WR3") return "Slot Receiver (WR3)";
    if (uPos === "LT") return "Left Tackle (LT)";
    if (uPos === "LG") return "Left Guard (LG)";
    if (uPos === "C") return "Center (C)";
    if (uPos === "RG") return "Right Guard (RG)";
    if (uPos === "RT") return "Right Tackle (RT)";
    if (uPos === "LDE") return "Left Defensive End (LDE)";
    if (uPos === "RDE") return "Right Defensive End (RDE)";
    if (uPos === "LDT") return "Left Defensive Tackle (LDT)";
    if (uPos === "RDT") return "Right Defensive Tackle (RDT)";
    if (uPos === "LOLB") return "Left Outside Linebacker (LOLB)";
    if (uPos === "MLB") return "Middle Linebacker (MLB)";
    if (uPos === "ROLB") return "Right Outside Linebacker (ROLB)";
    if (uPos === "CB1") return "Cornerback 1 (CB1)";
    if (uPos === "CB2") return "Cornerback 2 (CB2)";
    if (uPos === "SS") return "Strong Safety (SS)";
    if (uPos === "FS") return "Free Safety (FS)";
    if (uPos === "K") return "Kicker (K)";
    if (uPos === "P") return "Punter (P)";

    // Backups
    if (uPos === "B-QB") return "Backup QB";
    if (uPos === "B-RB") return "Backup RB";
    if (uPos === "B-WR1" || uPos === "B-WR2") return "Backup WR";
    if (uPos === "B-OL") return "Backup OL (LT/LG/C/RG/RT)";
    if (uPos === "B-DE") return "Backup DE (LDE/RDE)";
    if (uPos === "B-DT") return "Backup DT (LDT/RDT)";
    if (uPos === "B-LB1" || uPos === "B-LB2") return "Backup LB (LOLB/MLB/ROLB)";
    if (uPos === "B-DB1" || uPos === "B-DB2") return "Backup DB (CB/SS/FS)";
    if (uPos === "B-K") return "Backup Kicker";
    if (uPos === "B-P") return "Backup Punter";

    return pos;
}
