import sys
import os
sys.path.insert(0, r"d:\football coach")

import json

# Load existing playbook
from server.routes.playbook import PLAY_DATABASE

ari_21_to_36 = [
  {
    "id": "ari_21",
    "num_id": 21,
    "play_name": "80 Blunt Pass - Drive",
    "name": "80 Blunt Pass - Drive",
    "formation": "2-Back Under Center",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_title": "80 Blunt Drive",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "X": [-14, 0],
      "Z": [14, -1],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,15], [-4,18]], "arrow": True },
      { "player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[6,0], [6,6], [-10,8]], "arrow": True },
      { "player": "HB", "type": "ROUTE", "color": "YELLOW", "waypoints": [[0,-6], [4,-3], [10,-1]], "arrow": True },
      { "player": "QB", "type": "DROPBACK", "color": "WHITE", "waypoints": [[0,-2], [0,-6]], "arrow": False }
    ]
  },
  {
    "id": "ari_22",
    "num_id": 22,
    "play_name": "81 Waggle 4 - Bench",
    "name": "81 Waggle 4 - Bench",
    "formation": "2-Back Left",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "81 Waggle Bench",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [-6, 0],
      "X": [-14, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "FB": [-2, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,16], [18,16]], "arrow": True },
      { "player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[-6,0], [-6,5], [8,12]], "arrow": True },
      { "player": "QB", "type": "BOOTLEG", "color": "WHITE", "waypoints": [[0,-2], [3,-4], [6,-2]], "arrow": True }
    ]
  },
  {
    "id": "ari_23",
    "num_id": 23,
    "play_name": "82 Pass - Semi Pylon",
    "name": "82 Pass - Semi Pylon",
    "formation": "Singleback Ace",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_title": "82 Semi Pylon",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "TE2": [-6, 0],
      "X": [-14, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-10,10], [-16,20]], "arrow": True },
      { "player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,15], [18,22]], "arrow": True },
      { "player": "QB", "type": "DROPBACK", "color": "WHITE", "waypoints": [[0,-2], [0,-7]], "arrow": False }
    ]
  },
  {
    "id": "ari_24",
    "num_id": 24,
    "play_name": "83 Pass - Caddy",
    "name": "83 Pass - Caddy",
    "formation": "Heavy 2-Back",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_title": "83 Caddy Comeback",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "TE2": [8, 0],
      "X": [-14, 0],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,18], [-12,15]], "arrow": True },
      { "player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[6,0], [6,20]], "arrow": True },
      { "player": "QB", "type": "DROPBACK", "color": "WHITE", "waypoints": [[0,-2], [0,-7]], "arrow": False }
    ]
  },
  {
    "id": "ari_25",
    "num_id": 25,
    "play_name": "Trap Pass 4 - X-Ray",
    "name": "Trap Pass 4 - X-Ray",
    "formation": "Pro Right",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_title": "Trap Pass X-Ray",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "X": [-14, 0],
      "Z": [14, -1],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,12], [-4,18]], "arrow": True },
      { "player": "Z", "type": "ROUTE", "color": "ORANGE", "waypoints": [[14,-1], [14,10], [18,12]], "arrow": True },
      { "player": "QB", "type": "DROPBACK", "color": "WHITE", "waypoints": [[0,-2], [0,-6]], "arrow": False }
    ]
  },
  {
    "id": "ari_26",
    "num_id": 26,
    "play_name": "Part Pass 5 - Cab",
    "name": "Part Pass 5 - Cab",
    "formation": "2x2 Balance",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "Part Pass Cab",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [-6, 0],
      "X": [-14, 0],
      "Z": [14, 0],
      "TE2": [6, 0],
      "QB": [0, -2],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,18], [11,15]], "arrow": True },
      { "player": "QB", "type": "ROLLOUT", "color": "WHITE", "waypoints": [[0,-2], [-3,-4], [-6,-3]], "arrow": True }
    ]
  },
  {
    "id": "ari_27",
    "num_id": 27,
    "play_name": "Naked RT - Devil",
    "name": "Naked RT - Devil",
    "formation": "3x1 Right",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "Naked RT Devil",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "H": [6, -1],
      "Y": [10, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "HB": [-3, -5]
    },
    "routes": [
      { "player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[10,0], [12,1], [16,2]], "arrow": True },
      { "player": "H", "type": "ROUTE", "color": "ORANGE", "waypoints": [[6,-1], [6,8], [0,10]], "arrow": True },
      { "player": "QB", "type": "BOOTLEG", "color": "WHITE", "waypoints": [[0,-2], [4,-4], [7,-2]], "arrow": True }
    ]
  },
  {
    "id": "ari_28",
    "num_id": 28,
    "play_name": "88 Pass - Wheel Seam",
    "name": "88 Pass - Wheel Seam",
    "formation": "Shotgun Split",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_title": "88 Wheel Seam",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "H": [-6, -1],
      "Z": [14, 0],
      "QB": [0, -5],
      "HB": [3, -5]
    },
    "routes": [
      { "player": "HB", "type": "ROUTE", "color": "YELLOW", "waypoints": [[3,-5], [8,-3], [12,2], [12,20]], "arrow": True },
      { "player": "H", "type": "ROUTE", "color": "ORANGE", "waypoints": [[-6,-1], [-6,20]], "arrow": True }
    ]
  },
  {
    "id": "ari_29",
    "num_id": 29,
    "play_name": "62 Protection - Stick",
    "name": "62 Protection - Stick",
    "formation": "3x1 Trips Right",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "62 Stick",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "H": [6, -1],
      "Y": [10, 0],
      "Z": [14, 0],
      "QB": [0, -5],
      "HB": [-3, -5]
    },
    "routes": [
      { "player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[10,0], [10,6], [12,5]], "arrow": True },
      { "player": "Z", "type": "ROUTE", "color": "ORANGE", "waypoints": [[14,0], [14,20]], "arrow": True }
    ]
  },
  {
    "id": "ari_30",
    "num_id": 30,
    "play_name": "63 Protection - Hitch",
    "name": "63 Protection - Hitch",
    "formation": "2x2 Spread",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "63 Quick Hitch",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "H": [-8, -1],
      "Y": [8, -1],
      "Z": [14, 0],
      "QB": [0, -5],
      "HB": [3, -5]
    },
    "routes": [
      { "player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,8], [-14,6]], "arrow": True },
      { "player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[14,0], [14,8], [14,6]], "arrow": True }
    ]
  },
  {
    "id": "ari_31",
    "num_id": 31,
    "play_name": "62 Protection - Split 'Em",
    "name": "62 Protection - Split 'Em",
    "formation": "2x2 Tight",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_title": "62 Split 'Em",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "F": [-6, 0],
      "X": [-14, 0],
      "Z": [14, 0],
      "QB": [0, -5],
      "HB": [3, -5]
    },
    "routes": [
      { "player": "Y", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,0], [6,5], [1,15]], "arrow": True },
      { "player": "F", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-6,0], [-6,5], [-1,15]], "arrow": True }
    ]
  },
  {
    "id": "ari_32",
    "num_id": 32,
    "play_name": "66 Protection - Choice",
    "name": "66 Protection - Choice",
    "formation": "3x1 Right",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "66 Choice",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "H": [6, -1],
      "Y": [10, 0],
      "Z": [14, 0],
      "QB": [0, -5],
      "HB": [-3, -5]
    },
    "routes": [
      { "player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[6,-1], [6,6], [2,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_33",
    "num_id": 33,
    "play_name": "67 Protection - Dixie",
    "name": "67 Protection - Dixie",
    "formation": "2x2 Open",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "67 Dixie Slant",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "H": [-8, -1],
      "Y": [8, -1],
      "Z": [14, 0],
      "QB": [0, -5],
      "HB": [3, -5]
    },
    "routes": [
      { "player": "H", "type": "ROUTE", "color": "ORANGE", "waypoints": [[-8,-1], [-12,1], [-16,2]], "arrow": True },
      { "player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,5], [-4,10]], "arrow": True }
    ]
  },
  {
    "id": "ari_34",
    "num_id": 34,
    "play_name": "62 Protection - Stove",
    "name": "62 Protection - Stove",
    "formation": "4x1 Overload",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "62 Stove Screen",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "H": [4, -1],
      "Y": [8, 0],
      "F": [11, 0],
      "Z": [15, 0],
      "QB": [0, -5]
    },
    "routes": [
      { "player": "H", "type": "ROUTE", "color": "YELLOW", "waypoints": [[4,-1], [4,4], [4,3]], "arrow": True }
    ]
  },
  {
    "id": "ari_35",
    "num_id": 35,
    "play_name": "63 Protection - Poco",
    "name": "63 Protection - Poco",
    "formation": "3x1 Left",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_title": "63 Poco Post-Corner",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [14, 0],
      "H": [-6, -1],
      "Y": [-10, 0],
      "Z": [-14, 0],
      "QB": [0, -5],
      "HB": [3, -5]
    },
    "routes": [
      { "player": "Z", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,10], [-8,14], [-18,22]], "arrow": True }
    ]
  },
  {
    "id": "ari_36",
    "num_id": 36,
    "play_name": "66 Protection - Flinch",
    "name": "66 Protection - Flinch",
    "formation": "2x2 Balanced",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_title": "66 Flinch Hitch-Go",
    "card_category": "PASS",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "Y": [-6, 0],
      "TE2": [6, 0],
      "Z": [14, 0],
      "QB": [0, -5],
      "HB": [3, -5]
    },
    "routes": [
      { "player": "X", "type": "ROUTE", "color": "YELLOW", "waypoints": [[-14,0], [-14,6], [-14,5], [-14,18]], "arrow": True },
      { "player": "Y", "type": "ROUTE", "color": "ORANGE", "waypoints": [[-6,0], [-6,5], [-10,5]], "arrow": True }
    ]
  }
]

updated_database = list(PLAY_DATABASE[:20]) + list(ari_21_to_36) + list(PLAY_DATABASE[36:])

formatted_python = repr(updated_database)

code = f"""from fastapi import APIRouter

router = APIRouter()

PLAY_DATABASE = {formatted_python}

@router.get("")
@router.get("/")
async def get_playbook():
    return PLAY_DATABASE
"""

with open(r"d:\football coach\server\routes\playbook.py", "w", encoding="utf-8") as f:
    f.write(code)

print(f"Successfully updated PLAY_DATABASE with {len(updated_database)} plays (including ari_21 to ari_36)!")
