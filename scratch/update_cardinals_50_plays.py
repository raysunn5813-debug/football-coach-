import json

plays = [
    # 1. Power & Inside Run Package
    {
        "id": 1, "num_id": 1, "key": "1",
        "name": "22 Dbl", "play_name": "22 Dbl (Inside Run)",
        "card_title": "22 Dbl", "formation": "2-BACK PRO", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Pro Right - 22 Dbl",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Double-team at point of attack; HB flows downhill through A-gap.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "X": [-14,0], "Z": [12,-1], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [0,-3], [1,1], [1,8]], "arrow": True},
            {"player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [1,1]], "arrow": False}
        ]
    },
    {
        "id": 2, "num_id": 2, "key": "2",
        "name": "23 Dbl", "play_name": "23 Dbl (Inside Run)",
        "card_title": "23 Dbl", "formation": "2-BACK PRO", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Pro Left - 23 Dbl",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Weak-side double-team block; HB hits left A/B-gap.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [-6,0], "X": [14,0], "Z": [-12,-1], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [0,-3], [-1,1], [-1,8]], "arrow": True},
            {"player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [-1,1]], "arrow": False}
        ]
    },
    {
        "id": 3, "num_id": 3, "key": "3",
        "name": "36 Power", "play_name": "36 Power (Power Run)",
        "card_title": "36 Power", "formation": "SINGLEBACK ACE", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Ace (12) Singleback Ace - 36 Power [Zelda]",
        "personnel": "Ace (12)", "motion": "Zelda",
        "description": "Guard pulls to kick out edge defender; F-receiver leads through C-gap.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [-6,0], "X": [-14,0], "Z": [14,-1], "QB": [0,-2], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [1,-4], [4,1], [5,8]], "arrow": True},
            {"player": "BSG", "type": "PULL", "color": "WHITE", "waypoints": [[-2,0], [-1,-1.5], [3,-0.5], [5,2]], "arrow": False}
        ]
    },
    {
        "id": 4, "num_id": 4, "key": "4",
        "name": "37 Power", "play_name": "37 Power (Power Run)",
        "card_title": "37 Power", "formation": "2-BACK HEAVY", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Heavy - 37 Power",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Left Guard pull & kick; HB follows lead block into left off-tackle.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [8,0], "X": [-14,0], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-1,-4], [-4,1], [-5,8]], "arrow": True},
            {"player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [-5,1]], "arrow": False}
        ]
    },
    {
        "id": 5, "num_id": 5, "key": "5",
        "name": "34 Pike", "play_name": "34 Pike (ISO / Direct)",
        "card_title": "34 Pike", "formation": "2-BACK TIGHT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Tens (22) 2-Back Tight - 34 Pike",
        "personnel": "Tens (22)", "motion": "None",
        "description": "Direct-hit quick ISO play into B-gap behind lead fullback.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [-6,0], "X": [-12,0], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [2,-3], [2,1], [2,8]], "arrow": True},
            {"player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [2,1]], "arrow": False}
        ]
    },
    {
        "id": 6, "num_id": 6, "key": "6",
        "name": "35 Pike", "play_name": "35 Pike (ISO / Direct)",
        "card_title": "35 Pike", "formation": "2-BACK HEAVY", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Tens (22) 2-Back Heavy - 35 Pike",
        "personnel": "Tens (22)", "motion": "None",
        "description": "Downhill lead ISO attacking the left B-gap seam.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [8,0], "X": [-14,0], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-2,-3], [-2,1], [-2,8]], "arrow": True},
            {"player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [-2,1]], "arrow": False}
        ]
    },
    {
        "id": 7, "num_id": 7, "key": "7",
        "name": "38 Truck", "play_name": "38 Truck (Perimeter Power)",
        "card_title": "38 Truck", "formation": "HEAVY STACK", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Clubs (13) Heavy Stack - 38 Truck [Peel]",
        "personnel": "Clubs (13)", "motion": "Peel",
        "description": "Tackle and TE pin-and-pull combination sealing the right perimeter.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "TE2": [8,0], "TE3": [10,0], "QB": [0,-2], "HB": [0,-6], "X": [-14,0]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [4,-4], [9,1], [11,8]], "arrow": True}
        ]
    },
    {
        "id": 8, "num_id": 8, "key": "8",
        "name": "39 Truck", "play_name": "39 Truck (Heavy Power)",
        "card_title": "39 Truck", "formation": "JUMBO GOAL LINE", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Jacks (23) Jumbo Goal Line - 39 Truck",
        "personnel": "Jacks (23)", "motion": "None",
        "description": "Heavy lead sweep left with pulling Guard and inline tight end block.",
        "alignments": {"OL": [[-6,0], [-4,0], [-2,0], [0,0], [2,0], [4,0], [6,0]], "Y": [-8,0], "TE2": [8,0], "TE3": [10,0], "QB": [0,-1], "FB": [0,-3], "HB": [0,-5]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-5], [-4,-3], [-9,1], [-11,8]], "arrow": True},
            {"player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-3], [-8,1]], "arrow": False}
        ]
    },
    {
        "id": 9, "num_id": 9, "key": "9",
        "name": "34 Part", "play_name": "34 Part (Counter Run)",
        "card_title": "34 Part", "formation": "2-BACK SPLIT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Split - 34 Part",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Fake counter step; HB follows interior pulling lineman through right gap.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "X": [-14,0], "Z": [14,-1], "QB": [0,-2], "FB": [-3,-4], "HB": [3,-4]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[3,-4], [1,-5], [-2,-3], [2,2], [3,8]], "arrow": True}
        ]
    },
    {
        "id": 10, "num_id": 10, "key": "10",
        "name": "35 Part", "play_name": "35 Part (Counter Run)",
        "card_title": "35 Part", "formation": "2-BACK SPLIT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Split - 35 Part",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Lead counter attack executing toward the left side fold-block.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "X": [-14,0], "Z": [14,-1], "QB": [0,-2], "FB": [-3,-4], "HB": [3,-4]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[3,-4], [4,-5], [1,-3], [-3,2], [-4,8]], "arrow": True}
        ]
    },

    # 2. Outside Zone & Gap Scheme Package
    {
        "id": 11, "num_id": 11, "key": "11",
        "name": "26 Zone", "play_name": "26 Zone (Outside Zone)",
        "card_title": "26 Zone", "formation": "3x1 TRIPS RIGHT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Kings (11) 3x1 Trips Right - 26 Zone [Fly]",
        "personnel": "Kings (11)", "motion": "Fly",
        "description": "Full OL zone stretch right; HB reads OL flow for front-side/cutback seam.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[-3,-5], [1,-4], [6,1], [8,8]], "arrow": True}
        ]
    },
    {
        "id": 12, "num_id": 12, "key": "12",
        "name": "27 Zone", "play_name": "27 Zone (Outside Zone)",
        "card_title": "27 Zone", "formation": "3x1 TRIPS LEFT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Kings (11) 3x1 Trips Left - 27 Zone",
        "personnel": "Kings (11)", "motion": "None",
        "description": "Zone steps left; HB aims for outside hip of tackle.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-10,-1], "Y": [-6,0], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[3,-5], [-1,-4], [-6,1], [-8,8]], "arrow": True}
        ]
    },
    {
        "id": 13, "num_id": 13, "key": "13",
        "name": "26 Slash", "play_name": "26 Slash (Cutback Zone)",
        "card_title": "26 Slash", "formation": "2x2 BALANCED", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Ace (12) 2x2 Balanced - 26 Slash [Short]",
        "personnel": "Ace (12)", "motion": "Short",
        "description": "Zone stretch right with designed cutback seam over Right Guard.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[3,-5], [0,-4], [2,1], [2,8]], "arrow": True}
        ]
    },
    {
        "id": 14, "num_id": 14, "key": "14",
        "name": "27 Stretch", "play_name": "27 Stretch (Wide Zone)",
        "card_title": "27 Stretch", "formation": "3x1 TRIPS RIGHT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Kings (11) 3x1 Right - 27 Stretch [Cut]",
        "personnel": "Kings (11)", "motion": "Cut",
        "description": "Wide lateral reach-block sequence toward left sideline.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[3,-5], [-4,-4], [-10,1], [-12,8]], "arrow": True}
        ]
    },
    {
        "id": 15, "num_id": 15, "key": "15",
        "name": "26 Safety", "play_name": "26 Safety (Zone Combo)",
        "card_title": "26 Safety", "formation": "2-BACK PRO", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Pro - 26 Safety",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Zone flow right with safety valve protection logic from HB.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "X": [-14,0], "Z": [12,-1], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [3,-4], [6,1], [7,8]], "arrow": True}
        ]
    },
    {
        "id": 16, "num_id": 16, "key": "16",
        "name": "27 Safety", "play_name": "27 Safety (Zone Combo)",
        "card_title": "27 Safety", "formation": "SINGLEBACK ACE", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Ace (12) Singleback - 27 Safety [Boost]",
        "personnel": "Ace (12)", "motion": "Boost",
        "description": "Zone flow left designed to compromise edge contain defenders.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [-6,0], "F": [6,0], "X": [14,0], "Z": [-14,-1], "QB": [0,-2], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-3,-4], [-6,1], [-7,8]], "arrow": True}
        ]
    },
    {
        "id": 17, "num_id": 17, "key": "17",
        "name": "25 Blunt", "play_name": "25 Blunt (Gap Run)",
        "card_title": "25 Blunt", "formation": "2-BACK TIGHT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Tight - 25 Blunt",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Straight ahead interior gap attack penetrating A-gap directly.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [-6,0], "X": [-12,0], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-1,-3], [-1,1], [-1,8]], "arrow": True}
        ]
    },
    {
        "id": 18, "num_id": 18, "key": "18",
        "name": "24 Blunt", "play_name": "24 Blunt (Gap Run)",
        "card_title": "24 Blunt", "formation": "2-BACK TIGHT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Regular (21) 2-Back Tight - 24 Blunt",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Off-center gap drive targeting weak-side interior line.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [-6,0], "X": [-12,0], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [1,-3], [1,1], [1,8]], "arrow": True}
        ]
    },
    {
        "id": 19, "num_id": 19, "key": "19",
        "name": "29 Blunt", "play_name": "29 Blunt (Gap Sweep)",
        "card_title": "29 Blunt", "formation": "3x1 TRIPS RIGHT", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Kings (11) 3x1 Right - 29 Blunt [Zip]",
        "personnel": "Kings (11)", "motion": "Zip",
        "description": "Outer perimeter gap pin-and-seal maneuver.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[-3,-5], [5,-4], [10,1], [12,8]], "arrow": True}
        ]
    },
    {
        "id": 20, "num_id": 20, "key": "20",
        "name": "T38 Taxi", "play_name": "T38 Taxi (Tackle Wrap)",
        "card_title": "T38 Taxi", "formation": "2-BACK HEAVY", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Tens (22) 2-Back Heavy - T38 Taxi",
        "personnel": "Tens (22)", "motion": "None",
        "description": "Heavy tackle-wrap pull around edge to lead running back sweep.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [8,0], "X": [-14,0], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [4,-4], [9,1], [10,8]], "arrow": True}
        ]
    },

    # 3. Play-Action, Boot, & Waggle Package
    {
        "id": 21, "num_id": 21, "key": "21",
        "name": "80 Blunt Pass - Drive", "play_name": "80 Blunt Pass - Drive",
        "card_title": "80 Blunt Pass", "formation": "2-BACK UNDER CENTER", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Regular (21) 2-Back Under Center - 80 Blunt Pass - Drive",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Fake 22 Dbl; X runs Drive route (18-yd depth), Y runs intermediate Drag, HB releases to flat.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "X": [-14,0], "Z": [12,-1], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,18], [2,18]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [6,4], [-10,6]], "arrow": True},
            {"player": "HB", "type": "ROUTE", "color": "ORANGE", "waypoints": [[0,-6], [4,-3], [12,-1]], "arrow": True}
        ]
    },
    {
        "id": 22, "num_id": 22, "key": "22",
        "name": "81 Waggle 4 - Bench", "play_name": "81 Waggle 4 - Bench",
        "card_title": "81 Waggle 4", "formation": "2-BACK LEFT", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Regular (21) 2-Back Left - 81 Waggle 4 - Bench",
        "personnel": "Regular (21)", "motion": "None",
        "description": "QB bootlegs right off run fake; Z runs 16-yd Bench route, Y executes deep crossover.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [-6,0], "X": [14,0], "Z": [-12,-1], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-12,-1], [-12,16], [-18,16]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-6,0], [-4,5], [10,12]], "arrow": True},
            {"player": "QB", "type": "ROLLOUT", "color": "ORANGE", "waypoints": [[0,-2], [4,-4], [7,-2]], "arrow": True}
        ]
    },
    {
        "id": 23, "num_id": 23, "key": "23",
        "name": "82 Pass - Semi Pylon", "play_name": "82 Pass - Semi Pylon",
        "card_title": "82 Pass Pylon", "formation": "SINGLEBACK ACE", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Ace (12) Singleback Ace - 82 Pass - Semi Pylon [Y Move]",
        "personnel": "Ace (12)", "motion": "Y Move",
        "description": "Fake 36 Power; X runs 10-yd inside cut to fade (Semi), Z executes 15x3 Pylon from hash.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [-6,0], "X": [-14,0], "Z": [14,-1], "QB": [0,-2], "HB": [0,-6]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,10], [-10,12], [-16,22]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,-1], [14,15], [18,22]], "arrow": True}
        ]
    },
    {
        "id": 24, "num_id": 24, "key": "24",
        "name": "83 Pass - Caddy", "play_name": "83 Pass - Caddy",
        "card_title": "83 Pass Caddy", "formation": "HEAVY 2-BACK", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Tens (22) Heavy 2-Back - 83 Pass - Caddy",
        "personnel": "Tens (22)", "motion": "None",
        "description": "Fake 35 Pike; X runs 18-yd Caddy comeback, Y seam route clears deep safety.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "F": [8,0], "X": [-14,0], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,18], [-12,15]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [6,22]], "arrow": True}
        ]
    },
    {
        "id": 25, "num_id": 25, "key": "25",
        "name": "Trap Pass 4 - X-Ray", "play_name": "Trap Pass 4 - X-Ray",
        "card_title": "Trap Pass X-Ray", "formation": "PRO RIGHT", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Regular (21) Pro Right - Trap Pass 4 - X-Ray",
        "personnel": "Regular (21)", "motion": "None",
        "description": "Trap fake in backfield; X runs X-Ray (Post/In counter route) against single-high look.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "Y": [6,0], "X": [-14,0], "Z": [12,-1], "QB": [0,-2], "FB": [0,-4], "HB": [0,-6]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,10], [-6,14], [-2,20]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "ORANGE", "waypoints": [[12,-1], [12,12], [4,16]], "arrow": True}
        ]
    },
    {
        "id": 26, "num_id": 26, "key": "26",
        "name": "Part Pass 5 - Cab", "play_name": "Part Pass 5 - Cab",
        "card_title": "Part Pass Cab", "formation": "2x2 BALANCED", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Ace (12) 2x2 Balance - Part Pass 5 - Cab [Short]",
        "personnel": "Ace (12)", "motion": "Short",
        "description": "Fake 34 Part; QB rolls left, Z runs 18-yd Cab comeback route on field side.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,18], [11,15]], "arrow": True},
            {"player": "QB", "type": "ROLLOUT", "color": "ORANGE", "waypoints": [[0,-5], [-4,-6], [-7,-4]], "arrow": True}
        ]
    },
    {
        "id": 27, "num_id": 27, "key": "27",
        "name": "Naked RT - Devil", "play_name": "Naked RT - Devil",
        "card_title": "Naked RT Devil", "formation": "3x1 RIGHT", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 3x1 Right - Naked RT - Devil [Fly]",
        "personnel": "Kings (11)", "motion": "Fly",
        "description": "Unprotected QB boot right; Y runs flat, H runs Devil route into intermediate zone.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "QB", "type": "ROLLOUT", "color": "YELLOW", "waypoints": [[0,-5], [4,-6], [8,-3]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[10,-1], [12,1], [16,3]], "arrow": True},
            {"player": "H", "type": "ROUTE", "color": "ORANGE", "waypoints": [[6,0], [6,8], [12,10]], "arrow": True}
        ]
    },
    {
        "id": 28, "num_id": 28, "key": "28",
        "name": "88 Pass - Wheel Seam", "play_name": "88 Pass - Wheel Seam",
        "card_title": "88 Wheel Seam", "formation": "SHOTGUN SPLIT", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Queens (20) Shotgun Split - 88 Pass - Wheel Seam [Explode]",
        "personnel": "Queens (20)", "motion": "Explode",
        "description": "Play-action draw fake; HB releases on Wheel route, H receiver runs Seam down hash.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Z": [14,0], "HB": [-3,-5], "F": [3,-5], "QB": [0,-5]},
        "routes": [
            {"player": "HB", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-3,-5], [-8,-4], [-12,2], [-12,20]], "arrow": True},
            {"player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-8,-1], [-6,22]], "arrow": True}
        ]
    },

    # 4. Quick Pass & 3-Step Protection Package
    {
        "id": 29, "num_id": 29, "key": "29",
        "name": "62 Protection - Stick", "play_name": "62 Protection - Stick",
        "card_title": "62 Stick", "formation": "3x1 TRIPS RIGHT", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 3x1 Trips Right - 62 Protection - Stick [Zelda]",
        "personnel": "Kings (11)", "motion": "Zelda",
        "description": "6-man half-slide protection right; Y runs 6-yd option Stick, Z runs Go route.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[10,-1], [10,6], [12,6]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "ORANGE", "waypoints": [[14,0], [14,22]], "arrow": True}
        ]
    },
    {
        "id": 30, "num_id": 30, "key": "30",
        "name": "63 Protection - Hitch", "play_name": "63 Protection - Hitch",
        "card_title": "63 Quick Hitch", "formation": "2x2 SPREAD", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 2x2 Spread - 63 Protection - Hitch",
        "personnel": "Kings (11)", "motion": "None",
        "description": "Half-slide left; X and Z execute 8-yd quick Hitches with fast trigger from QB.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,8], [-13,7]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,8], [13,7]], "arrow": True}
        ]
    },
    {
        "id": 31, "num_id": 31, "key": "31",
        "name": "62 Protection - Split 'Em", "play_name": "62 Protection - Split 'Em",
        "card_title": "62 Split 'Em", "formation": "2x2 TIGHT", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Ace (12) 2x2 Tight - 62 Protection - Split 'Em [Short]",
        "personnel": "Ace (12)", "motion": "Short",
        "description": "Y and F run dual post-slants splitting safeties; outside receivers clear perimeter.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "F": [-6,0], "Y": [6,0], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [6,5], [0,12]], "arrow": True},
            {"player": "F", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-6,0], [-6,5], [0,12]], "arrow": True}
        ]
    },
    {
        "id": 32, "num_id": 32, "key": "32",
        "name": "66 Protection - Choice", "play_name": "66 Protection - Choice",
        "card_title": "66 Choice", "formation": "3x1 RIGHT", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 3x1 Right - 66 Protection - Choice [Peel]",
        "personnel": "Kings (11)", "motion": "Peel",
        "description": "Slot receiver runs Choice option route (breaking in/out based on nickel leverage).",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [6,7], [3,8]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "ORANGE", "waypoints": [[14,0], [14,14]], "arrow": True}
        ]
    },
    {
        "id": 33, "num_id": 33, "key": "33",
        "name": "67 Protection - Dixie", "play_name": "67 Protection - Dixie",
        "card_title": "67 Dixie", "formation": "2x2 OPEN", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 2x2 Open - 67 Protection - Dixie",
        "personnel": "Kings (11)", "motion": "None",
        "description": "Inside receiver runs flat route; outside WR executes 5-yd slant behind flat defender.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,4], [5,9]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[8,-1], [12,1], [16,2]], "arrow": True}
        ]
    },
    {
        "id": 34, "num_id": 34, "key": "34",
        "name": "62 Protection - Stove", "play_name": "62 Protection - Stove",
        "card_title": "62 Stove Pop", "formation": "4x1 OVERLOAD", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Flush (10) 4x1 Overload - 62 Protection - Stove [Cut]",
        "personnel": "Flush (10)", "motion": "Cut",
        "description": "Quick pop pass to slot on Stove stop route backed by perimeter screen blocking.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-15,0], "H": [5,0], "Y": [9,-1], "F": [12,0], "Z": [15,-1], "QB": [0,-5]},
        "routes": [
            {"player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[5,0], [5,4], [4,3]], "arrow": True},
            {"player": "Z", "type": "BLOCK", "color": "WHITE", "waypoints": [[15,-1], [12,2]], "arrow": False}
        ]
    },
    {
        "id": 35, "num_id": 35, "key": "35",
        "name": "63 Protection - Poco", "play_name": "63 Protection - Poco",
        "card_title": "63 Poco", "formation": "3x1 TRIPS LEFT", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Kings (11) 3x1 Left - 63 Protection - Poco [Fly]",
        "personnel": "Kings (11)", "motion": "Fly",
        "description": "Quick post-corner route combination designed to exploit single-high safety leverage.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-10,-1], "Y": [-6,0], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,10], [-8,13], [-16,20]], "arrow": True},
            {"player": "H", "type": "ROUTE", "color": "ORANGE", "waypoints": [[-10,-1], [-10,12], [-4,18]], "arrow": True}
        ]
    },
    {
        "id": 36, "num_id": 36, "key": "36",
        "name": "66 Protection - Flinch", "play_name": "66 Protection - Flinch",
        "card_title": "66 Flinch Out", "formation": "2x2 BALANCED", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Ace (12) 2x2 Balanced - 66 Protection - Flinch",
        "personnel": "Ace (12)", "motion": "None",
        "description": "Stutter hitch-and-go by X WR paired with quick tight end out route.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,6], [-14,4], [-14,20]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[8,-1], [8,6], [12,6]], "arrow": True}
        ]
    },

    # 5. 3rd Down Dropback & Alert Pass Package
    {
        "id": 37, "num_id": 37, "key": "37",
        "name": "72 Protection - Slant Combo", "play_name": "72 Protection - Slant Combo",
        "card_title": "72 Slant Combo", "formation": "3x1 STACK", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 3x1 Stack - 72 Protection - Slant Combo [Boost]",
        "personnel": "Kings (11)", "motion": "Boost",
        "description": "7-man slide protection; slant-arrow combination attacking nickel linebacker alignment.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [6,-2], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [6,4], [-2,9]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[6,-2], [10,1], [14,3]], "arrow": True}
        ]
    },
    {
        "id": 38, "num_id": 38, "key": "38",
        "name": "73 Protection - Sluggo Seam", "play_name": "73 Protection - Sluggo Seam",
        "card_title": "73 Sluggo Seam", "formation": "2x2 SPREAD", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Kings (11) 2x2 Spread - 73 Protection - Sluggo Seam [Zip]",
        "personnel": "Kings (11)", "motion": "Zip",
        "description": "X runs Slant-and-Go (Sluggo); slot Y attacks seam down center of the field vs Cover 2.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,4], [-10,6], [-14,22]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[8,-1], [6,22]], "arrow": True}
        ]
    },
    {
        "id": 39, "num_id": 39, "key": "39",
        "name": "74 Protection - Charlie Snatch", "play_name": "74 Protection - Charlie Snatch",
        "card_title": "74 Snatch Sit", "formation": "3x1 WIDE", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Royal (01) 3x1 Wide - 74 Protection - Charlie Snatch [Find]",
        "personnel": "Royal (01)", "motion": "Find",
        "description": "Slot runs Snatch route (underneath sit at 8 yds) beneath deep clear-out routes.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5]},
        "routes": [
            {"player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [6,8], [4,7]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "ORANGE", "waypoints": [[14,0], [14,20]], "arrow": True}
        ]
    },
    {
        "id": 40, "num_id": 40, "key": "40",
        "name": "75 Protection - Hunt Seam", "play_name": "75 Protection - Hunt Seam",
        "card_title": "75 Hunt Seams", "formation": "3x1 RIGHT", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Kings (11) 3x1 Right - 75 Protection - Hunt Seam [Wrap]",
        "personnel": "Kings (11)", "motion": "Wrap",
        "description": "Dual inner slot receivers attack hash seams while boundary WRs hold cornerbacks.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [5,22]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[10,-1], [8,22]], "arrow": True}
        ]
    },
    {
        "id": 41, "num_id": 41, "key": "41",
        "name": "76 Pro - Z Level Dbl Out", "play_name": "76 Pro - Z Level Dbl Out",
        "card_title": "76 Dbl Out", "formation": "2x2 BALANCED", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 2x2 Balanced - 76 Pro - Z Level Dbl Out [FIP]",
        "personnel": "Kings (11)", "motion": "FIP",
        "description": "Pro protection; Z and slot execute high-low double out routes at 12 and 5 yards.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,12], [18,12]], "arrow": True},
            {"player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[8,-1], [8,5], [12,5]], "arrow": True}
        ]
    },
    {
        "id": 42, "num_id": 42, "key": "42",
        "name": "77 Pro - Cowboy Dbl Out", "play_name": "77 Pro - Cowboy Dbl Out",
        "card_title": "77 Cowboy Outs", "formation": "2x2 TIGHT", "play_type": "DEEP PASS",
        "category": "DEEP", "card_category": "PASS",
        "walsh_call": "Ace (12) 2x2 Tight - 77 Pro - Cowboy Dbl Out [Bug]",
        "personnel": "Ace (12)", "motion": "Bug",
        "description": "Both boundary receivers run deep 14-yard Out routes toward opposing sidelines.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "F": [-6,0], "Y": [6,0], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,14], [-18,14]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,14], [18,14]], "arrow": True}
        ]
    },
    {
        "id": 43, "num_id": 43, "key": "43",
        "name": "Kick 2 - Z Drag Pin", "play_name": "Kick 2 - Z Drag Pin",
        "card_title": "Kick Drag Pin", "formation": "3x1 TRIPS LEFT", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 3x1 Left - Kick 2 - Z Drag Pin",
        "personnel": "Kings (11)", "motion": "None",
        "description": "Kick slide protection; Z runs shallow drag under deep dig route to pin high safety.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-10,-1], "Y": [-6,0], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [12,3], [-10,5]], "arrow": True},
            {"player": "X", "type": "ROUTE", "color": "ORANGE", "waypoints": [[-14,0], [-14,12], [2,12]], "arrow": True}
        ]
    },
    {
        "id": 44, "num_id": 44, "key": "44",
        "name": "Kick 3 - Pinch", "play_name": "Kick 3 - Pinch",
        "card_title": "Kick 3 Pinch", "formation": "2x2 SPREAD", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "Kings (11) 2x2 Spread - Kick 3 - Pinch [Zip]",
        "personnel": "Kings (11)", "motion": "Zip",
        "description": "Inward curling routes at 10-12 yards compressing defensive zone coverage windows.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,11], [-10,10]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,11], [10,10]], "arrow": True}
        ]
    },

    # 6. Empty Formations, Draws & Screen Package
    {
        "id": 45, "num_id": 45, "key": "45",
        "name": "52 Protection - Shave", "play_name": "52 Protection - Shave",
        "card_title": "52 Shave Wheel", "formation": "EMPTY SPREAD", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "5 Wides (00) Empty Spread - 52 Protection - Shave [Bomb]",
        "personnel": "5 Wides (00)", "motion": "Bomb",
        "description": "5-man empty protection; shallow rub underneath paired with slot wheel route.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-15,0], "H": [-8,0], "Y": [4,0], "F": [9,0], "Z": [15,0], "QB": [0,-5]},
        "routes": [
            {"player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-8,0], [-12,2], [-14,20]], "arrow": True},
            {"player": "X", "type": "ROUTE", "color": "ORANGE", "waypoints": [[-15,0], [-15,4], [-2,5]], "arrow": True}
        ]
    },
    {
        "id": 46, "num_id": 46, "key": "46",
        "name": "53 Protection - Scrape", "play_name": "53 Protection - Scrape",
        "card_title": "53 Scrape", "formation": "EMPTY HEX", "play_type": "SHORT PASS",
        "category": "SHORT", "card_category": "PASS",
        "walsh_call": "5 Wides (00) Empty Hex - 53 Protection - Scrape [Hop]",
        "personnel": "5 Wides (00)", "motion": "Hop",
        "description": "Scrape route underneath LB zone dropped into intermediate hash area.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-15,0], "H": [-8,0], "Y": [4,0], "F": [9,0], "Z": [15,0], "QB": [0,-5]},
        "routes": [
            {"player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[4,0], [4,6], [-6,8]], "arrow": True},
            {"player": "Z", "type": "ROUTE", "color": "ORANGE", "waypoints": [[15,0], [15,14]], "arrow": True}
        ]
    },
    {
        "id": 47, "num_id": 47, "key": "47",
        "name": "Jailbreak LT", "play_name": "Jailbreak LT (Screen)",
        "card_title": "Jailbreak LT", "formation": "3x1 SHOTGUN", "play_type": "SCREEN PASS",
        "category": "SCREEN", "card_category": "SCREEN",
        "walsh_call": "Kings (11) 3x1 Shotgun - Jailbreak LT",
        "personnel": "Kings (11)", "motion": "None",
        "description": "OL releases left; X WR backpedals for quick catch behind offensive line screen convoy.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-12,-2], [-10,-1]], "arrow": True},
            {"player": "BST", "type": "SCREEN_LEAD", "color": "WHITE", "waypoints": [[-4,0], [-8,1], [-12,4]], "arrow": True}
        ]
    },
    {
        "id": 48, "num_id": 48, "key": "48",
        "name": "Speed Screen RT", "play_name": "Speed Screen RT (Screen)",
        "card_title": "Speed Screen RT", "formation": "2x2 SHOTGUN", "play_type": "SCREEN PASS",
        "category": "SCREEN", "card_category": "SCREEN",
        "walsh_call": "Kings (11) 2x2 Shotgun - Speed Screen RT [Fly]",
        "personnel": "Kings (11)", "motion": "Fly",
        "description": "Immediate perimeter throw to Z WR with slot receiver blocking out cornerback.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [12,-1], [10,0]], "arrow": True},
            {"player": "Y", "type": "BLOCK", "color": "WHITE", "waypoints": [[8,-1], [14,2]], "arrow": False}
        ]
    },
    {
        "id": 49, "num_id": 49, "key": "49",
        "name": "40 Draw", "play_name": "40 Draw (Draw Run)",
        "card_title": "40 Draw", "formation": "3x1 SHOTGUN", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Kings (11) 3x1 Shotgun - 40 Draw",
        "personnel": "Kings (11)", "motion": "None",
        "description": "Pass set by OL; QB delays handoff to HB cutting through interior Center/Guard gap.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [6,0], "Y": [10,-1], "Z": [14,0], "QB": [0,-5], "HB": [-3,-5]},
        "routes": [
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[-3,-5], [0,-4], [0,1], [0,8]], "arrow": True}
        ]
    },
    {
        "id": 50, "num_id": 50, "key": "50",
        "name": "42 Sprint Draw", "play_name": "42 Sprint Draw (Draw Run)",
        "card_title": "42 Sprint Draw", "formation": "2x2 SHOTGUN", "play_type": "RUN",
        "category": "RUN", "card_category": "RUN",
        "walsh_call": "Kings (11) 2x2 Shotgun - 42 Sprint Draw",
        "personnel": "Kings (11)", "motion": "None",
        "description": "QB initiates sprint-out right, handing off back to HB cutting left into opening.",
        "alignments": {"OL": [[-4,0], [-2,0], [0,0], [2,0], [4,0]], "X": [-14,0], "H": [-8,-1], "Y": [8,-1], "Z": [14,0], "QB": [0,-5], "HB": [3,-5]},
        "routes": [
            {"player": "QB", "type": "ROLLOUT", "color": "GREEN", "waypoints": [[0,-5], [3,-4]], "arrow": False},
            {"player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[3,-5], [1,-4], [-2,1], [-3,8]], "arrow": True}
        ]
    }
]

formatted_python = repr(plays)

code = f"""from fastapi import APIRouter

router = APIRouter()

PLAY_DATABASE = {formatted_python}

@router.get("")
@router.get("/")
async def get_playbook():
    return PLAY_DATABASE
"""

with open("d:/football coach/server/routes/playbook.py", "w", encoding="utf-8") as f:
    f.write(code)

print(f"Successfully generated and wrote {len(plays)} 2016 Cardinals plays to server/routes/playbook.py!")
