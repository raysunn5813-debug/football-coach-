/**
 * REAL NFL LEAGUE DATABASE & FULL 35-PLAYER ROSTER
 */
export const REAL_NFL_LEAGUE = {
  saints: {
    teamName: "New Orleans Saints",
    abbrev: "NO",
    city: "New Orleans",
    division: "NFC South",
    budget: "$5,000,000",
    wins: 2,
    losses: 7,
    ovr: 81,
    
    // 11 OFFENSE + 11 DEFENSE + 2 SPECIAL TEAMS (K + P) = 24 STARTERS
    starters: [
      // OFFENSE STARTERS (11)
      { name: "Derek Carr", pos: "QB", status: "Healthy", style: "Field General", ovr: 80, spd: 74, acc: 78, cat: 45, pwr: 89, passAcc: 83, tak: 28, str: 62 },
      { name: "Alvin Kamara", pos: "RB", status: "Healthy", style: "Receiving Back", ovr: 86, spd: 89, acc: 92, cat: 85, pwr: 58, passAcc: 30, tak: 35, str: 70 },
      { name: "Chris Olave", pos: "WR1", status: "Healthy", style: "Deep Threat", ovr: 87, spd: 93, acc: 94, cat: 89, pwr: 35, passAcc: 25, tak: 25, str: 55 },
      { name: "Rashid Shaheed", pos: "WR2", status: "Healthy", style: "Speedster", ovr: 81, spd: 96, acc: 95, cat: 82, pwr: 30, passAcc: 20, tak: 20, str: 50 },
      { name: "A.T. Perry", pos: "WR3", status: "Healthy", style: "Possession", ovr: 74, spd: 88, acc: 87, cat: 78, pwr: 25, passAcc: 20, tak: 20, str: 62 },
      { name: "Taysom Hill", pos: "TE", status: "Healthy", style: "Power Athlete", ovr: 79, spd: 87, acc: 88, cat: 76, pwr: 75, passAcc: 70, tak: 65, str: 84 },
      { name: "Taliese Fuaga", pos: "OT", status: "Healthy", style: "Pass Blocker", ovr: 78, spd: 68, acc: 74, cat: 30, pwr: 20, passAcc: 15, tak: 40, str: 89 },
      { name: "Trevor Penning", pos: "OT", status: "Healthy", style: "Power Blocker", ovr: 74, spd: 66, acc: 72, cat: 25, pwr: 20, passAcc: 15, tak: 35, str: 91 },
      { name: "Cesar Ruiz", pos: "OG", status: "Healthy", style: "Run Blocker", ovr: 76, spd: 62, acc: 70, cat: 25, pwr: 20, passAcc: 15, tak: 38, str: 88 },
      { name: "Lucas Patrick", pos: "OG", status: "Healthy", style: "Balanced", ovr: 72, spd: 60, acc: 68, cat: 20, pwr: 20, passAcc: 15, tak: 35, str: 86 },
      { name: "Erik McCoy", pos: "C", status: "Healthy", style: "Anchor", ovr: 85, spd: 65, acc: 72, cat: 25, pwr: 20, passAcc: 15, tak: 40, str: 91 },

      // DEFENSE STARTERS (11)
      { name: "Cameron Jordan", pos: "DE", status: "Healthy", style: "Power Rusher", ovr: 83, spd: 76, acc: 81, cat: 40, pwr: 30, passAcc: 20, tak: 86, str: 90 },
      { name: "Carl Granderson", pos: "DE", status: "Healthy", style: "Speed Rusher", ovr: 80, spd: 82, acc: 85, cat: 35, pwr: 25, passAcc: 15, tak: 80, str: 84 },
      { name: "Nathan Shepherd", pos: "DT", status: "Healthy", style: "Run Stopper", ovr: 75, spd: 64, acc: 70, cat: 30, pwr: 20, passAcc: 15, tak: 78, str: 92 },
      { name: "Demario Davis", pos: "LB", status: "Healthy", style: "Field General", ovr: 89, spd: 84, acc: 87, cat: 68, pwr: 35, passAcc: 25, tak: 92, str: 86 },
      { name: "Willie Gay Jr.", pos: "LB", status: "Healthy", style: "Coverage", ovr: 77, spd: 88, acc: 90, cat: 65, pwr: 30, passAcc: 20, tak: 80, str: 82 },
      { name: "Pete Werner", pos: "LB", status: "Healthy", style: "Tackler", ovr: 78, spd: 82, acc: 85, cat: 60, pwr: 25, passAcc: 15, tak: 84, str: 80 },
      { name: "Marshon Lattimore", pos: "CB1", status: "Healthy", style: "Man Lock Down", ovr: 88, spd: 92, acc: 93, cat: 72, pwr: 25, passAcc: 15, tak: 76, str: 68 },
      { name: "Paulson Adebo", pos: "CB2", status: "Healthy", style: "Zone Hawk", ovr: 82, spd: 90, acc: 91, cat: 75, pwr: 25, passAcc: 15, tak: 74, str: 65 },
      { name: "Alontae Taylor", pos: "CB3", status: "Healthy", style: "Slot CB", ovr: 79, spd: 91, acc: 92, cat: 70, pwr: 25, passAcc: 15, tak: 72, str: 64 },
      { name: "Tyrann Mathieu", pos: "FS", status: "Healthy", style: "Ball Hawk", ovr: 85, spd: 87, acc: 89, cat: 80, pwr: 30, passAcc: 20, tak: 82, str: 66 },
      { name: "Jordan Howden", pos: "SS", status: "Healthy", style: "Enforcer", ovr: 74, spd: 88, acc: 89, cat: 62, pwr: 25, passAcc: 15, tak: 76, str: 72 },

      // SPECIAL TEAMS (2)
      { name: "Blake Grupe", pos: "K", status: "Healthy", style: "Accurate Kicker", ovr: 76, spd: 68, acc: 70, cat: 20, pwr: 88, passAcc: 20, tak: 20, str: 50 },
      { name: "Lou Hedley", pos: "P", status: "Healthy", style: "Aussie Punter", ovr: 74, spd: 70, acc: 72, cat: 20, pwr: 86, passAcc: 20, tak: 22, str: 58 }
    ],

    // EXACTLY 11 BENCH / BACKUP PLAYERS
    bench: [
      { name: "Spencer Rattler", pos: "QB", status: "Backup", style: "Scrambler", ovr: 71, spd: 82, acc: 85, cat: 40, pwr: 85, passAcc: 74, tak: 25, str: 60 },
      { name: "Kendre Miller", pos: "RB", status: "Backup", style: "Power Back", ovr: 75, spd: 88, acc: 90, cat: 68, pwr: 40, passAcc: 20, tak: 30, str: 78 },
      { name: "Jamaal Williams", pos: "RB", status: "Backup", style: "Goal Line", ovr: 74, spd: 84, acc: 86, cat: 70, pwr: 50, passAcc: 20, tak: 32, str: 82 },
      { name: "Cedrick Wilson Jr.", pos: "WR", status: "Backup", style: "Slot", ovr: 73, spd: 87, acc: 88, cat: 76, pwr: 25, passAcc: 15, tak: 22, str: 58 },
      { name: "Bub Means", pos: "WR", status: "Backup", style: "Vertical Threat", ovr: 70, spd: 92, acc: 90, cat: 72, pwr: 20, passAcc: 15, tak: 20, str: 60 },
      { name: "Juwan Johnson", pos: "TE", status: "Backup", style: "Receiving TE", ovr: 76, spd: 83, acc: 85, cat: 80, pwr: 30, passAcc: 20, tak: 35, str: 76 },
      { name: "Foster Moreau", pos: "TE", status: "Backup", style: "Blocking TE", ovr: 73, spd: 79, acc: 81, cat: 72, pwr: 40, passAcc: 15, tak: 40, str: 80 },
      { name: "Nick Saldiveri", pos: "OG", status: "Backup", style: "Pass Blocker", ovr: 70, spd: 62, acc: 66, cat: 20, pwr: 15, passAcc: 15, tak: 30, str: 84 },
      { name: "Chase Young", pos: "DE", status: "Backup", style: "Speed Rusher", ovr: 81, spd: 85, acc: 88, cat: 30, pwr: 25, passAcc: 15, tak: 82, str: 86 },
      { name: "Bryan Bresee", pos: "DT", status: "Backup", style: "Interior Rusher", ovr: 77, spd: 72, acc: 78, cat: 25, pwr: 20, passAcc: 15, tak: 78, str: 89 },
      { name: "Kool-Aid McKinstry", pos: "CB", status: "Backup", style: "Zone Hawk", ovr: 76, spd: 91, acc: 92, cat: 74, pwr: 20, passAcc: 15, tak: 70, str: 62 }
    ]
  },

  // 32-TEAM NFL LEAGUE STANDINGS DATA (FORMATTED FOR 8 DIVISIONS)
  divisions: {
    AFCEast: [
      { name: "Buffalo Bills", abbrev: "BUF", wins: 7, losses: 2 },
      { name: "New York Jets", abbrev: "NYJ", wins: 3, losses: 6 },
      { name: "Miami Dolphins", abbrev: "MIA", wins: 2, losses: 6 },
      { name: "New England Patriots", abbrev: "NE", wins: 2, losses: 7 }
    ],
    AFCNorth: [
      { name: "Pittsburgh Steelers", abbrev: "PIT", wins: 6, losses: 2 },
      { name: "Baltimore Ravens", abbrev: "BAL", wins: 7, losses: 3 },
      { name: "Cincinnati Bengals", abbrev: "CIN", wins: 4, losses: 6 },
      { name: "Cleveland Browns", abbrev: "CLE", wins: 2, losses: 7 }
    ],
    AFCSouth: [
      { name: "Houston Texans", abbrev: "HOU", wins: 6, losses: 3 },
      { name: "Indianapolis Colts", abbrev: "IND", wins: 4, losses: 5 },
      { name: "Tennessee Titans", abbrev: "TEN", wins: 2, losses: 6 },
      { name: "Jacksonville Jaguars", abbrev: "JAX", wins: 2, losses: 7 }
    ],
    AFCWest: [
      { name: "Kansas City Chiefs", abbrev: "KC", wins: 8, losses: 0 },
      { name: "Los Angeles Chargers", abbrev: "LAC", wins: 5, losses: 3 },
      { name: "Denver Broncos", abbrev: "DEN", wins: 5, losses: 4 },
      { name: "Las Vegas Raiders", abbrev: "LV", wins: 2, losses: 7 }
    ],
    NFCEast: [
      { name: "Washington Commanders", abbrev: "WAS", wins: 7, losses: 2 },
      { name: "Philadelphia Eagles", abbrev: "PHI", wins: 6, losses: 2 },
      { name: "Dallas Cowboys", abbrev: "DAL", wins: 3, losses: 5 },
      { name: "New York Giants", abbrev: "NYG", wins: 2, losses: 7 }
    ],
    NFCNorth: [
      { name: "Detroit Lions", abbrev: "DET", wins: 7, losses: 1 },
      { name: "Minnesota Vikings", abbrev: "MIN", wins: 6, losses: 2 },
      { name: "Green Bay Packers", abbrev: "GB", wins: 6, losses: 3 },
      { name: "Chicago Bears", abbrev: "CHI", wins: 4, losses: 4 }
    ],
    NFCSouth: [
      { name: "Atlanta Falcons", abbrev: "ATL", wins: 6, losses: 3 },
      { name: "Tampa Bay Buccaneers", abbrev: "TB", wins: 4, losses: 5 },
      { name: "Carolina Panthers", abbrev: "CAR", wins: 2, losses: 7 },
      { name: "New Orleans Saints", abbrev: "NO", wins: 2, losses: 7 }
    ],
    NFCWest: [
      { name: "Arizona Cardinals", abbrev: "ARI", wins: 5, losses: 4 },
      { name: "Los Angeles Rams", abbrev: "LAR", wins: 4, losses: 4 },
      { name: "San Francisco 49ers", abbrev: "SF", wins: 4, losses: 4 },
      { name: "Seattle Seahawks", abbrev: "SEA", wins: 4, losses: 5 }
    ]
  },

  // LEAGUE STAT LEADERS DATA
  statLeaders: {
    passYards: [
      { team: "HNL", player: "D. Allar", compPct: 74, yds: 5798, td: 66, avatar: "🏈" },
      { team: "RR", player: "J. Baca", compPct: 65, yds: 5346, td: 62, avatar: "🏈" },
      { team: "SA", player: "C. Stroud", compPct: 62, yds: 5302, td: 49, avatar: "🏈" }
    ],
    rushYards: [
      { team: "AA", player: "J. Gibbs", att: 183, yds: 1524, td: 25, avatar: "🏃" },
      { team: "PHI", player: "V. Moore", att: 191, yds: 1408, td: 26, avatar: "🏃" },
      { team: "SDS", player: "Q. Wisner", att: 204, yds: 1380, td: 27, avatar: "🏃" }
    ],
    recYards: [
      { team: "MNB", player: "F. Gump", rec: 130, yds: 2110, td: 26, avatar: "👐" },
      { team: "HNL", player: "G. Griffin", rec: 78, yds: 2035, td: 21, avatar: "👐" },
      { team: "BRX", player: "B. Thomas Jr", rec: 53, yds: 1890, td: 25, avatar: "👐" }
    ],
    sacks: [
      { team: "CAR", player: "R. Drew", pos: "REDG", sacks: 14, tfl: 28, avatar: "💪" },
      { team: "BOS", player: "M. Green", pos: "REDG", sacks: 13, tfl: 17, avatar: "💪" },
      { team: "OKC", player: "N. Smith Jr", pos: "LEDG", sacks: 13, tfl: 20, avatar: "💪" }
    ],
    interceptions: [
      { team: "BRX", player: "N. Wiggins", pos: "CB", int: 9, defl: 5, avatar: "🛡️" },
      { team: "MIA", player: "K. Winston Jr.", pos: "SS", int: 8, defl: 0, avatar: "🛡️" },
      { team: "MNB", player: "J. Hancock", pos: "SS", int: 8, defl: 8, avatar: "🛡️" }
    ],
    tackles: [
      { team: "CHO", player: "N. Cross", pos: "FS", tak: 94, solo: 45, avatar: "💥" },
      { team: "SLC", player: "J. Campbell", pos: "MIKE", tak: 66, solo: 42, avatar: "💥" },
      { team: "CHO", player: "B. Branch", pos: "SS", tak: 103, solo: 42, avatar: "💥" }
    ]
  }
};
