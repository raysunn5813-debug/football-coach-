/* ==========================================
   CHALKBOARD FOOTBALL COACH - MATCH CONTROLLER
   ========================================== */

import { getPlayList } from "./simulation/plays.js";

export class Match {
    constructor(myTeam, oppTeam, myOffBook, myDefBook, oppOffBook, oppDefBook) {
        this.myTeam = myTeam;
        this.oppTeam = oppTeam;
        
        // Playbooks
        this.myOffBook = myOffBook;
        this.myDefBook = myDefBook;
        this.oppOffBook = oppOffBook;
        this.oppDefBook = oppDefBook;
        
        // Game State
        this.scoreMy = 0;
        this.scoreOpp = 0;
        this.quarter = 1;
        this.clock = 900;
        
        // Weather conditions: 50% Clear, 25% Rain, 25% Snow
        const weathers = ["clear", "clear", "rain", "snow"];
        this.weather = weathers[Math.floor(Math.random() * weathers.length)];
        
        // Drive State
        this.possession = "my_team";
        this.yardLine = 30;
        this.down = 1;
        this.ytg = 10;
        this.firstDownYardLine = 40;
        
        // Play History logs
        this.playLogs = [];
        
        // Statistics
        this.stats = {
            my: { passYards: 0, rushYards: 0, totalYards: 0, turnovers: 0 },
            opp: { passYards: 0, rushYards: 0, totalYards: 0, turnovers: 0 }
        };
        
        this.currentOffPlay = null;
        this.currentDefPlay = null;
        this.matchOver = false;
        
        this.generateScoutingReports();
    }

    generateScoutingReports() {
        this.playLogs.push(`Match preview: ${this.myTeam.name} vs ${this.oppTeam.name}`);
        this.playLogs.push(`Weather: ${this.weather.toUpperCase()}. Turf is ${this.weather === 'clear' ? 'fast' : (this.weather === 'rain' ? 'wet and slick' : 'covered in snow')}.`);
    }

    getScoreString() {
        return `${this.myTeam.name} ${this.scoreMy} - ${this.scoreOpp} ${this.oppTeam.name}`;
    }

    getClockString() {
        const mins = Math.floor(this.clock / 60);
        const secs = this.clock % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getYardLineString() {
        if (this.yardLine === 60) return "50 YARD LINE";
        
        if (this.possession === "my_team") {
            if (this.yardLine < 60) {
                return `OWN ${this.yardLine - 10}`;
            } else {
                return `OPP ${110 - this.yardLine}`;
            }
        } else {
            if (this.yardLine > 60) {
                return `OWN ${110 - this.yardLine}`;
            } else {
                return `OPP ${this.yardLine - 10}`;
            }
        }
    }

    getDownDistanceString() {
        if (this.down === 0) return "KICKOFF";
        const ordinal = ["", "1ST", "2ND", "3RD", "4TH"];
        
        if (this.possession === "my_team" && this.firstDownYardLine >= 110) {
            return `${ordinal[this.down]} & GOAL`;
        }
        if (this.possession === "opp_team" && this.firstDownYardLine <= 10) {
            return `${ordinal[this.down]} & GOAL`;
        }
        
        return `${ordinal[this.down]} & ${Math.round(this.ytg)}`;
    }

    selectOpponentPlay(type) {
        if (type === "offense") {
            if (this.down === 4) {
                const yardsToGoal = this.yardLine - 10; // opp moves left
                if (yardsToGoal > 35 && this.ytg > 3) {
                    return getPlayList(null, "special_teams")[0];
                }
            }
            const plays = getPlayList(this.oppOffBook, "offense");
            return plays[Math.floor(Math.random() * plays.length)];
        } else {
            const plays = getPlayList(this.oppDefBook, "defense");
            return plays[Math.floor(Math.random() * plays.length)];
        }
    }

    getAutoPlay(type) {
        if (type === "offense") {
            if (this.down === 4) {
                const yardsToGoal = 110 - this.yardLine; // my_team moves right
                if (yardsToGoal > 35 && this.ytg > 3) {
                    return getPlayList(null, "special_teams")[0];
                }
            }
            const plays = getPlayList(this.myOffBook, "offense");
            return plays[Math.floor(Math.random() * plays.length)];
        } else {
            const plays = getPlayList(this.myDefBook, "defense");
            return plays[Math.floor(Math.random() * plays.length)];
        }
    }

    setupPlay(playerPlay, delegationMode = "manual") {
        const isOffense = this.possession === "my_team";

        if (delegationMode === "spectate") {
            this.currentOffPlay = isOffense ? this.getAutoPlay("offense") : this.selectOpponentPlay("offense");
            this.currentDefPlay = isOffense ? this.selectOpponentPlay("defense") : this.getAutoPlay("defense");
        } 
        else if (delegationMode === "delegate_offense") {
            if (isOffense) {
                this.currentOffPlay = this.getAutoPlay("offense");
                this.currentDefPlay = this.selectOpponentPlay("defense");
            } else {
                this.currentOffPlay = this.selectOpponentPlay("offense");
                this.currentDefPlay = playerPlay;
            }
        } 
        else if (delegationMode === "delegate_defense") {
            if (isOffense) {
                this.currentOffPlay = playerPlay;
                this.currentDefPlay = this.selectOpponentPlay("defense");
            } else {
                this.currentOffPlay = this.selectOpponentPlay("offense");
                this.currentDefPlay = this.getAutoPlay("defense");
            }
        } 
        else {
            if (isOffense) {
                this.currentOffPlay = playerPlay;
                this.currentDefPlay = this.selectOpponentPlay("defense");
            } else {
                this.currentOffPlay = this.selectOpponentPlay("offense");
                this.currentDefPlay = playerPlay;
            }
        }
    }

    // Resolve penalty infraction mathematically
    resolvePenalty(penalty, accepted = true, originalYards = 0, originalResult = "tackle") {
        // Decrement clock for the play
        const playTime = Math.floor(Math.random() * 15 + 25);
        this.clock = Math.max(0, this.clock - playTime);

        if (!accepted) {
            this.playLogs.push(`Penalty declined. Play results in original output.`);
            return this.resolvePlayResult(originalYards, originalResult);
        }

        const isOffenseTeam = this.possession === "my_team";
        const infractionOffense = penalty.team === "offense";
        
        let yardsApplied = penalty.yards; // e.g. -10 for offensive holding, +5 for offside/defensive holding
        
        // Reverse signs if opponent has possession
        if (!isOffenseTeam) {
            // Opponent has possession. They move right-to-left.
            // Offensive penalty (opponent) moves them backwards (increases yardline).
            // Defensive penalty (us) moves them forwards (decreases yardline).
            yardsApplied = -yardsApplied;
        }

        // Apply penalty yards to yardline
        this.yardLine += yardsApplied;
        
        let commentary = `🏳️ PENALTY ACCEPTED: ${penalty.desc}`;
        this.playLogs.push(commentary);

        // Adjust downs/distance based on penalty rules
        if (penalty.name.includes("Defensive Pass Interference") || penalty.name.includes("Defensive Holding")) {
            // Auto 1st Down
            this.firstDown();
        } else {
            // Replay down (offset yards to gain)
            if (isOffenseTeam) {
                this.ytg -= yardsApplied;
                if (this.yardLine >= this.firstDownYardLine) {
                    this.firstDown();
                } else {
                    if (this.down > 4) {
                        this.playLogs.push(`Turnover on downs!`);
                        this.turnover();
                    }
                }
            } else {
                this.ytg += yardsApplied;
                if (this.yardLine <= this.firstDownYardLine) {
                    this.firstDown();
                } else {
                    if (this.down > 4) {
                        this.playLogs.push(`Turnover on downs!`);
                        this.turnover();
                    }
                }
            }
        }

        this.checkQuarterTransition();
        this.currentOffPlay = null;
        this.currentDefPlay = null;
        return commentary;
    }

    resolvePlayResult(simYards, resultType, isAutoSim = false) {
        let yards = parseFloat(simYards.toFixed(1));
        let commentary = "";
        
        const playTime = Math.floor(Math.random() * 15 + 25);
        this.clock = Math.max(0, this.clock - playTime);

        const currentOffense = this.possession === "my_team" ? "my" : "opp";
        const teamName = this.possession === "my_team" ? this.myTeam.name : this.oppTeam.name;

        if (this.currentOffPlay.type === "pass" && resultType !== "incomplete" && resultType !== "interception" && resultType !== "sack") {
            this.stats[currentOffense].passYards += yards;
        } else if (this.currentOffPlay.type === "run" && resultType !== "fumble") {
            this.stats[currentOffense].rushYards += yards;
        }
        this.stats[currentOffense].totalYards += yards;

        if (resultType === "touchdown") {
            // Touchdown adds 6 points
            if (this.possession === "my_team") {
                this.scoreMy += 6;
            } else {
                this.scoreOpp += 6;
            }

            // Determine PAT selection
            let attemptType = "pat"; // "pat" or "2pt"
            const isUserOffense = this.possession === "my_team";
            
            if (isUserOffense && !isAutoSim) {
                // Prompt User for choice
                const choice = confirm(`🏈 TOUCHDOWN ${teamName}! (6 PTS)\nDo you want to KICK the Extra Point (OK)?\nOr go for a 2-Point Conversion (Cancel)?`);
                attemptType = choice ? "pat" : "2pt";
            } else {
                // CPU/AutoSim decides: 95% PAT, 5% 2-Point conversion
                attemptType = (Math.random() < 0.95) ? "pat" : "2pt";
            }

            const activeTeam = isUserOffense ? this.myTeam : this.oppTeam;
            const kicker = activeTeam.roster.find(p => p.position === "K");
            const kickerName = kicker ? kicker.name : "Kicker";
            
            if (attemptType === "pat") {
                const kickerOvr = kicker ? kicker.ovr : 75;
                const successChance = 0.85 + (kickerOvr / 99) * 0.14; // 85% - 99% success
                const patGood = Math.random() < successChance;
                
                if (patGood) {
                    if (isUserOffense) this.scoreMy += 1;
                    else this.scoreOpp += 1;
                    commentary = `🏈 TOUCHDOWN ${teamName}! Extra Point kick by ${kickerName} is GOOD!`;
                } else {
                    commentary = `🏈 TOUCHDOWN ${teamName}! Extra Point kick by ${kickerName} is WIDE RIGHT! No Good!`;
                }
            } else {
                // 2-Point Conversion simulation: success chance based on team average OVR vs opponent average OVR
                const defenseTeam = isUserOffense ? this.oppTeam : this.myTeam;
                const offOvr = activeTeam.getAverageOVR();
                const defOvr = defenseTeam.getAverageOVR();
                const successChance = 0.40 + ((offOvr - defOvr) / 40); // base 40%, adjusted by OVR difference
                const success = Math.random() < Math.max(0.2, Math.min(0.7, successChance));
                
                if (success) {
                    if (isUserOffense) this.scoreMy += 2;
                    else this.scoreOpp += 2;
                    commentary = `🏈 TOUCHDOWN ${teamName}! 2-Point conversion attempt is SUCCESSFUL!`;
                } else {
                    commentary = `🏈 TOUCHDOWN ${teamName}! 2-Point conversion attempt FAILS! Pass is incomplete.`;
                }
            }

            this.turnover(true);
        } 
        else if (resultType === "interception") {
            commentary = `⚠️ INTERCEPTION! Under pressure, the quarterback throws a pick! Turnover!`;
            this.stats[currentOffense].turnovers++;
            this.turnover();
        } 
        else if (resultType === "fumble") {
            commentary = `⚠️ FUMBLE! The defender strips the ball! Recovered by defense!`;
            this.stats[currentOffense].turnovers++;
            this.turnover();
        } 
        else if (resultType === "sack") {
            commentary = `🚫 SACKED! Defensive front drops QB for a loss of ${Math.abs(yards)} yards!`;
            this.advanceField(yards);
        }
        else if (resultType === "punt") {
            const isMyTeam = this.possession === "my_team";
            let landingSpot = isMyTeam ? this.yardLine + yards : this.yardLine - yards;
            
            if (isMyTeam && landingSpot >= 110) {
                commentary = `Punt kicked into the end zone for a TOUCHBACK. Opponent takes over at the 20.`;
                this.turnover(true);
            } else if (!isMyTeam && landingSpot <= 10) {
                commentary = `Punt kicked into the end zone for a TOUCHBACK. Saints take over at the 20.`;
                this.turnover(true);
            } else {
                const returnYards = Math.floor(Math.random() * 13);
                const finalSpot = isMyTeam ? landingSpot - returnYards : landingSpot + returnYards;
                this.yardLine = Math.max(11, Math.min(109, finalSpot));
                
                // Flip possession BEFORE calling getYardLineString so it describes from receiving team's perspective
                this.possession = isMyTeam ? "opp_team" : "my_team";
                commentary = `Punt kicked ${Math.floor(yards)} yards. Returned ${returnYards} yards to the ${this.getYardLineString()}.`;
                this.possession = isMyTeam ? "my_team" : "opp_team"; // Restore so turnover() handles it
                
                this.turnover();
            }
        }
        else if (resultType === "incomplete") {
            commentary = `❌ Incomplete pass. The throw sailed wide or was batted down.`;
            this.advanceField(0);
        }
        else {
            const playActionWord = this.currentOffPlay.type === "run" ? "rushes" : "completes a pass";
            commentary = `${teamName} ${playActionWord} for a gain of ${yards} yards.`;
            this.advanceField(yards);
        }

        this.playLogs.push(commentary);
        this.checkQuarterTransition();

        this.currentOffPlay = null;
        this.currentDefPlay = null;

        return commentary;
    }

    checkQuarterTransition() {
        if (this.clock <= 0) {
            if (this.quarter < 4) {
                this.quarter++;
                this.clock = 900;
                this.playLogs.push(`--- END OF QUARTER ${this.quarter - 1} ---`);
            } else {
                this.matchOver = true;
                this.playLogs.push(`=== GAME OVER ===`);
                this.playLogs.push(`Final Score: ${this.getScoreString()}`);
            }
        }
    }

    advanceField(yards) {
        if (this.possession === "my_team") {
            this.yardLine += yards;
            this.ytg -= yards;
            
            if (this.yardLine >= this.firstDownYardLine) {
                this.firstDown();
            } else {
                this.down++;
                if (this.down > 4) {
                    this.playLogs.push(`Turnover on downs! ${this.oppTeam.name} takes over.`);
                    this.turnover();
                }
            }
        } else {
            this.yardLine -= yards;
            this.ytg -= yards;
            
            if (this.yardLine <= this.firstDownYardLine) {
                this.firstDown();
            } else {
                this.down++;
                if (this.down > 4) {
                    this.playLogs.push(`Turnover on downs! ${this.myTeam.name} takes over.`);
                    this.turnover();
                }
            }
        }
        
        if (this.yardLine <= 10) {
            if (this.possession === "my_team") {
                this.scoreOpp += 2;
                this.playLogs.push(`SAFETY! Saints tackled in their own endzone! 2 pts to Patriots.`);
                this.turnover(true);
            } else {
                this.scoreOpp += 7;
                this.playLogs.push(`🏈 TOUCHDOWN Patriots! They punch it in!`);
                this.turnover(true);
            }
        }
        else if (this.yardLine >= 110) {
            if (this.possession === "my_team") {
                this.scoreMy += 7;
                this.playLogs.push(`🏈 TOUCHDOWN Saints! Touchdown!`);
                this.turnover(true);
            } else {
                this.scoreMy += 2;
                this.playLogs.push(`SAFETY! Patriots tackled in their own endzone! 2 pts to Saints.`);
                this.turnover(true);
            }
        }
    }

    firstDown() {
        this.down = 1;
        this.ytg = 10;
        if (this.possession === "my_team") {
            this.firstDownYardLine = Math.min(110, this.yardLine + 10);
        } else {
            this.firstDownYardLine = Math.max(10, this.yardLine - 10);
        }
        this.playLogs.push(`🔑 First Down! Chain gang moves up.`);
    }

    turnover(isKickoff = false) {
        if (this.possession === "my_team") {
            this.possession = "opp_team";
            this.yardLine = isKickoff ? 90 : this.yardLine;
            this.firstDownYardLine = this.yardLine - 10;
        } else {
            this.possession = "my_team";
            this.yardLine = isKickoff ? 30 : this.yardLine;
            this.firstDownYardLine = this.yardLine + 10;
        }
        this.down = 1;
        this.ytg = 10;
    }

    simulatePlay() {
        if (this.matchOver) return;

        // Auto select plays if none are queued
        if (!this.currentOffPlay) {
            this.currentOffPlay = this.possession === "my_team" ? this.getAutoPlay("offense") : this.selectOpponentPlay("offense");
        }
        if (!this.currentDefPlay) {
            this.currentDefPlay = this.possession === "my_team" ? this.selectOpponentPlay("defense") : this.getAutoPlay("defense");
        }

        let yards = 0;
        let resultType = "tackle";

        if (this.currentOffPlay.type === "pass") {
            const compProb = 0.62;
            if (Math.random() < compProb) {
                yards = Math.random() * 20 - 2;
                resultType = "tackle";
            } else if (Math.random() < 0.03) {
                resultType = "interception";
            } else if (Math.random() < 0.08) {
                yards = -(Math.random() * 8 + 2);
                resultType = "sack";
            } else {
                resultType = "incomplete";
            }
        } else if (this.currentOffPlay.type === "PUNT") {
            yards = this.currentOffPlay.kickYardsBase + Math.floor(Math.random() * this.currentOffPlay.variance);
            resultType = "punt";
        } else if (this.currentOffPlay.type === "run") {
            yards = Math.random() * 12 - 2;
            if (Math.random() < 0.015) {
                resultType = "fumble";
            }
        } else {
            yards = Math.random() * 5;
        }

        this.resolvePlayResult(yards, resultType, true);
    }

    simulateDrive() {
        if (this.matchOver) return;
        const startPossession = this.possession;
        while (this.possession === startPossession && !this.matchOver) {
            this.simulatePlay();
        }
    }

    simulateGame() {
        while (!this.matchOver) {
            this.simulatePlay();
        }
    }
}
