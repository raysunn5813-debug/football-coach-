import sys
import os
sys.path.insert(0, r"d:\football coach")

import json

ari_01_to_03 = [
  {
    "id": "ari_01",
    "num_id": 1,
    "play_name": "22 Dbl",
    "name": "22 Dbl",
    "formation": "2-Back Pro Right",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "22 Dbl",
    "card_category": "RUN",
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
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [1,-1], [1,8]], "arrow": True },
      { "player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [2,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_02",
    "num_id": 2,
    "play_name": "23 Dbl",
    "name": "23 Dbl",
    "formation": "2-Back Pro Left",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "23 Dbl",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [-6, 0],
      "X": [14, 0],
      "Z": [-14, -1],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-1,-1], [-1,8]], "arrow": True },
      { "player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [-2,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_03",
    "num_id": 3,
    "play_name": "36 Power",
    "name": "36 Power",
    "formation": "Singleback Ace",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "36 Power",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "F": [-6, 0],
      "X": [-14, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [3,-2], [5,2], [5,10]], "arrow": True },
      { "player": "F", "type": "BLOCK", "color": "WHITE", "waypoints": [[-6,0], [4,-1], [6,2]], "arrow": False }
    ]
  }
]

ari_04_to_20 = [
  {
    "id": "ari_04",
    "num_id": 4,
    "play_name": "37 Power",
    "name": "37 Power",
    "formation": "2-Back Heavy",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "37 Power",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [-6, 0],
      "X": [14, 0],
      "Z": [-14, 0],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-3,-2], [-5,2], [-5,10]], "arrow": True },
      { "player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [-6,1]], "arrow": False },
      { "player": "BSG", "type": "PULL", "color": "WHITE", "waypoints": [[2,0], [0,-1], [-4,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_05",
    "num_id": 5,
    "play_name": "34 Pike ISO",
    "name": "34 Pike ISO",
    "formation": "2-Back Tight",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "34 Pike ISO",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "TE2": [-6, 0],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [2,-3], [2,8]], "arrow": True },
      { "player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [2,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_06",
    "num_id": 6,
    "play_name": "35 Pike ISO",
    "name": "35 Pike ISO",
    "formation": "2-Back Heavy",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "35 Pike ISO",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [-6, 0],
      "TE2": [6, 0],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-2,-3], [-2,8]], "arrow": True },
      { "player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [-2,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_07",
    "num_id": 7,
    "play_name": "38 Truck Perimeter",
    "name": "38 Truck Perimeter",
    "formation": "Heavy Stack",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "38 Truck",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "TE2": [8, 0],
      "TE3": [10, 0],
      "QB": [0, -2],
      "HB": [0, -5]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-5], [5,-3], [11,2], [12,10]], "arrow": True }
    ]
  },
  {
    "id": "ari_08",
    "num_id": 8,
    "play_name": "39 Truck Sweep",
    "name": "39 Truck Sweep",
    "formation": "Jumbo Goal Line",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "39 Truck Sweep",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-6,0], [-4,0], [-2,0], [0,0], [2,0], [4,0], [6,0] ],
      "Y": [-8, 0],
      "TE2": [-10, 0],
      "QB": [0, -2],
      "FB": [-2, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-6,-3], [-11,2], [-12,10]], "arrow": True },
      { "player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[-2,-4], [-9,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_09",
    "num_id": 9,
    "play_name": "34 Part Counter",
    "name": "34 Part Counter",
    "formation": "2-Back Split",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "34 Part Counter",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "FB": [-2, -4],
      "HB": [2, -4]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[2,-4], [0,-5], [2,-2], [2,8]], "arrow": True },
      { "player": "BSG", "type": "PULL", "color": "WHITE", "waypoints": [[-2,0], [0,-1], [2,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_10",
    "num_id": 10,
    "play_name": "35 Part Counter",
    "name": "35 Part Counter",
    "formation": "2-Back Split",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "35 Part Counter",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "FB": [2, -4],
      "HB": [-2, -4]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[-2,-4], [0,-5], [-2,-2], [-2,8]], "arrow": True },
      { "player": "BSG", "type": "PULL", "color": "WHITE", "waypoints": [[2,0], [0,-1], [-2,1]], "arrow": False }
    ]
  },
  {
    "id": "ari_11",
    "num_id": 11,
    "play_name": "26 Zone Outside",
    "name": "26 Zone Outside",
    "formation": "3x1 Trips Right",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "26 Zone Right",
    "card_category": "RUN",
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
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[-3,-5], [2,-3], [7,1], [9,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_12",
    "num_id": 12,
    "play_name": "27 Zone Outside",
    "name": "27 Zone Outside",
    "formation": "3x1 Trips Left",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "27 Zone Left",
    "card_category": "RUN",
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
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[3,-5], [-2,-3], [-7,1], [-9,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_13",
    "num_id": 13,
    "play_name": "26 Slash Cutback",
    "name": "26 Slash Cutback",
    "formation": "2x2 Balanced",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "26 Slash",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [-14, 0],
      "Y": [-6, 0],
      "Z": [14, 0],
      "TE2": [6, 0],
      "QB": [0, -2],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [3,-3], [1,1], [1,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_14",
    "num_id": 14,
    "play_name": "27 Stretch Wide Zone",
    "name": "27 Stretch Wide Zone",
    "formation": "3x1 Right",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "27 Stretch",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [14, 0],
      "Y": [-6, 0],
      "H": [-10, 0],
      "Z": [-14, 0],
      "QB": [0, -2],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-5,-3], [-10,1], [-12,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_15",
    "num_id": 15,
    "play_name": "26 Safety Combo",
    "name": "26 Safety Combo",
    "formation": "2-Back Pro",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "26 Safety",
    "card_category": "RUN",
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
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [2,-3], [4,1], [4,8]], "arrow": True },
      { "player": "FB", "type": "BLOCK", "color": "WHITE", "waypoints": [[0,-4], [3,0]], "arrow": False }
    ]
  },
  {
    "id": "ari_16",
    "num_id": 16,
    "play_name": "27 Safety Combo",
    "name": "27 Safety Combo",
    "formation": "Singleback Ace",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "27 Safety",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [-6, 0],
      "TE2": [6, 0],
      "X": [-14, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-2,-3], [-4,1], [-4,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_17",
    "num_id": 17,
    "play_name": "25 Blunt A-Gap",
    "name": "25 Blunt A-Gap",
    "formation": "2-Back Tight",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "25 Blunt",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "TE2": [-6, 0],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [-1,-3], [-1,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_18",
    "num_id": 18,
    "play_name": "24 Blunt Interior",
    "name": "24 Blunt Interior",
    "formation": "2-Back Tight",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "24 Blunt",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "TE2": [-6, 0],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [1,-3], [1,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_19",
    "num_id": 19,
    "play_name": "29 Blunt Perimeter Sweep",
    "name": "29 Blunt Perimeter Sweep",
    "formation": "3x1 Right",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "29 Blunt Sweep",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "X": [14, 0],
      "H": [6, 0],
      "Y": [10, 0],
      "Z": [14, 0],
      "QB": [0, -2],
      "HB": [0, -5]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-5], [-4,-3], [-9,1], [-11,8]], "arrow": True }
    ]
  },
  {
    "id": "ari_20",
    "num_id": 20,
    "play_name": "T38 Taxi Tackle Wrap",
    "name": "T38 Taxi Tackle Wrap",
    "formation": "2-Back Heavy",
    "play_type": "RUN",
    "category": "RUN",
    "card_title": "T38 Taxi",
    "card_category": "RUN",
    "alignments": {
      "OL": [ [-4,0], [-2,0], [0,0], [2,0], [4,0] ],
      "Y": [6, 0],
      "TE2": [8, 0],
      "QB": [0, -2],
      "FB": [0, -4],
      "HB": [0, -6]
    },
    "routes": [
      { "player": "HB", "type": "RUN_PATH", "color": "GREEN", "waypoints": [[0,-6], [4,-3], [8,1], [9,8]], "arrow": True },
      { "player": "BST", "type": "PULL", "color": "WHITE", "waypoints": [[-4,0], [-2,-1], [6,1]], "arrow": False }
    ]
  }
]

# Read existing playbook
from server.routes.playbook import PLAY_DATABASE

updated_database = list(ari_01_to_03) + list(ari_04_to_20)

for play in PLAY_DATABASE[20:]:
    num = play.get("num_id", play.get("id"))
    new_play = dict(play)
    new_play["id"] = f"ari_{int(num):02d}"
    new_play["num_id"] = int(num)
    updated_database.append(new_play)

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

print(f"Successfully updated PLAY_DATABASE with {len(updated_database)} plays (including ari_01 to ari_20)!")
