/**
 * playbook3d.js — Complete 50 Bill Walsh West Coast Offense Playbook
 *
 * PLAYBOOK is now sourced from shared/playbook.json (the single catalog also
 * loaded by server/routes/playbook.py) so client and server always agree on
 * play ids/names/roles. _EMBEDDED_PLAYBOOK_FALLBACK below is the same data
 * baked in as an offline fallback in case the fetch fails.
 */

export const FORMATIONS = {
  SHOTGUN_SPREAD: {
    'LT':  { x: -0.5, z: -3.0 },
    'LG':  { x: -0.5, z: -1.5 },
    'C':   { x: -0.5, z:  0.0 },
    'RG':  { x: -0.5, z:  1.5 },
    'RT':  { x: -0.5, z:  3.0 },
    'QB':  { x: -5.0, z:  0.0 },
    'RB':  { x: -5.0, z: -2.5 },
    'W1':  { x:  0.0, z: -21.0 },
    'W2':  { x:  0.0, z:  -9.0 },
    'TE':  { x:  0.0, z:   9.0 },
    'W3':  { x:  0.0, z:  21.0 }
  },
  DEFENSE_TAMPA2: {
    'DE1': { x:  1.0, z: -4.5 },
    'DT1': { x:  1.0, z: -1.5 },
    'DT2': { x:  1.0, z:  1.5 },
    'DE2': { x:  1.0, z:  4.5 },
    'WLB': { x:  4.5, z: -8.0 },
    'MLB': { x:  4.5, z:  0.0 },
    'SLB': { x:  4.5, z:  8.0 },
    'CB1': { x:  5.0, z: -21.0 },
    'CB2': { x:  5.0, z:  21.0 },
    'FS':  { x: 14.0, z:  -6.0 },
    'SS':  { x: 14.0, z:   6.0 }
  }
};

const _EMBEDDED_PLAYBOOK_FALLBACK = {
  "1": {
    "id": "1",
    "num_id": 1,
    "key": "1",
    "name": "I-Form Power 17",
    "play_name": "I-Form Power 17",
    "card_title": "Power 17",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Red Right - 17 Power",
    "description": "I-Form Power 17 (I-FORM) \u2014 Red Right - 17 Power",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            1,
            -4
          ],
          [
            3,
            1
          ],
          [
            3,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            4,
            1
          ]
        ],
        "arrow": false
      },
      {
        "player": "BSG",
        "type": "PULL",
        "color": "WHITE",
        "waypoints": [
          [
            -2,
            0
          ],
          [
            -1,
            -1.5
          ],
          [
            2,
            -0.5
          ],
          [
            3,
            2
          ]
        ],
        "arrow": false
      }
    ]
  },
  "i_form_power_17": {
    "id": "1",
    "num_id": 1,
    "key": "1",
    "name": "I-Form Power 17",
    "play_name": "I-Form Power 17",
    "card_title": "Power 17",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Red Right - 17 Power",
    "description": "I-Form Power 17 (I-FORM) \u2014 Red Right - 17 Power",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            1,
            -4
          ],
          [
            3,
            1
          ],
          [
            3,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            4,
            1
          ]
        ],
        "arrow": false
      },
      {
        "player": "BSG",
        "type": "PULL",
        "color": "WHITE",
        "waypoints": [
          [
            -2,
            0
          ],
          [
            -1,
            -1.5
          ],
          [
            2,
            -0.5
          ],
          [
            3,
            2
          ]
        ],
        "arrow": false
      }
    ]
  },
  "2": {
    "id": "2",
    "num_id": 2,
    "key": "2",
    "name": "I-Form Off-Tackle Bob",
    "play_name": "I-Form Off-Tackle Bob",
    "card_title": "Off-Tackle Bob",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Red Right Slot Z Opposite - 19 Bob",
    "description": "I-Form Off-Tackle Bob (I-FORM) \u2014 Red Right Slot Z Opposite - 19 Bob",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        -10,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "MOTION",
        "color": "GREEN",
        "waypoints": [
          [
            -10,
            -1
          ],
          [
            0,
            -1.5
          ],
          [
            8,
            -1.5
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -1,
            -4
          ],
          [
            5,
            1
          ],
          [
            7,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            6,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "i_form_off_tackle_bob": {
    "id": "2",
    "num_id": 2,
    "key": "2",
    "name": "I-Form Off-Tackle Bob",
    "play_name": "I-Form Off-Tackle Bob",
    "card_title": "Off-Tackle Bob",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Red Right Slot Z Opposite - 19 Bob",
    "description": "I-Form Off-Tackle Bob (I-FORM) \u2014 Red Right Slot Z Opposite - 19 Bob",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        -10,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "MOTION",
        "color": "GREEN",
        "waypoints": [
          [
            -10,
            -1
          ],
          [
            0,
            -1.5
          ],
          [
            8,
            -1.5
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -1,
            -4
          ],
          [
            5,
            1
          ],
          [
            7,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            6,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "3": {
    "id": "3",
    "num_id": 3,
    "key": "3",
    "name": "I-Form Quick Slant / Flat",
    "play_name": "I-Form Quick Slant / Flat",
    "card_title": "Quick Slant / Flat",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Brown Left - 3-Step Slant / Flat",
    "description": "I-Form Quick Slant / Flat (I-FORM) \u2014 Brown Left - 3-Step Slant / Flat",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            5
          ],
          [
            4,
            10
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -4,
            -3
          ],
          [
            -10,
            -1
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -12,
            -1
          ],
          [
            -12,
            8
          ],
          [
            -12,
            12
          ]
        ],
        "arrow": true
      }
    ]
  },
  "i_form_quick_slant_flat": {
    "id": "3",
    "num_id": 3,
    "key": "3",
    "name": "I-Form Quick Slant / Flat",
    "play_name": "I-Form Quick Slant / Flat",
    "card_title": "Quick Slant / Flat",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Brown Left - 3-Step Slant / Flat",
    "description": "I-Form Quick Slant / Flat (I-FORM) \u2014 Brown Left - 3-Step Slant / Flat",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            5
          ],
          [
            4,
            10
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -4,
            -3
          ],
          [
            -10,
            -1
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -12,
            -1
          ],
          [
            -12,
            8
          ],
          [
            -12,
            12
          ]
        ],
        "arrow": true
      }
    ]
  },
  "4": {
    "id": "4",
    "num_id": 4,
    "key": "4",
    "name": "I-Form Curl-Flat Concept",
    "play_name": "I-Form Curl-Flat Concept",
    "card_title": "Curl Flats",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Red Right - 12 Curl / HB Flat",
    "description": "I-Form Curl-Flat Concept (I-FORM) \u2014 Red Right - 12 Curl / HB Flat",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            -1
          ],
          [
            14,
            10
          ],
          [
            12,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            6,
            -2
          ],
          [
            12,
            0
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            10
          ],
          [
            -12,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "i_form_curl_flat_concept": {
    "id": "4",
    "num_id": 4,
    "key": "4",
    "name": "I-Form Curl-Flat Concept",
    "play_name": "I-Form Curl-Flat Concept",
    "card_title": "Curl Flats",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Red Right - 12 Curl / HB Flat",
    "description": "I-Form Curl-Flat Concept (I-FORM) \u2014 Red Right - 12 Curl / HB Flat",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            -1
          ],
          [
            14,
            10
          ],
          [
            12,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            6,
            -2
          ],
          [
            12,
            0
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            10
          ],
          [
            -12,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "5": {
    "id": "5",
    "num_id": 5,
    "key": "5",
    "name": "I-Form Play-Action Post",
    "play_name": "I-Form Play-Action Post",
    "card_title": "PA Slant Post",
    "formation": "I-FORM",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Brown Left - Run Pass 60 X Slant / Z Post",
    "description": "I-Form Play-Action Post (I-FORM) \u2014 Brown Left - Run Pass 60 X Slant / Z Post",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -12,
            -1
          ],
          [
            -12,
            10
          ],
          [
            0,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            4
          ],
          [
            2,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            0,
            -1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "i_form_play_action_post": {
    "id": "5",
    "num_id": 5,
    "key": "5",
    "name": "I-Form Play-Action Post",
    "play_name": "I-Form Play-Action Post",
    "card_title": "PA Slant Post",
    "formation": "I-FORM",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Brown Left - Run Pass 60 X Slant / Z Post",
    "description": "I-Form Play-Action Post (I-FORM) \u2014 Brown Left - Run Pass 60 X Slant / Z Post",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -12,
            -1
          ],
          [
            -12,
            10
          ],
          [
            0,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            4
          ],
          [
            2,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            0,
            -1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "6": {
    "id": "6",
    "num_id": 6,
    "key": "6",
    "name": "Shotgun Draw 45",
    "play_name": "Shotgun Draw 45",
    "card_title": "Gun Draw 45",
    "formation": "SHOTGUN",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Shotgun Right - 45 Lead Draw",
    "description": "Shotgun Draw 45 (SHOTGUN) \u2014 Shotgun Right - 45 Lead Draw",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            -3,
            -5
          ],
          [
            0,
            -4
          ],
          [
            1,
            1
          ],
          [
            1,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "QB",
        "type": "HANDOFF",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -5
          ],
          [
            0,
            -4
          ]
        ],
        "arrow": false
      }
    ]
  },
  "shotgun_draw_45": {
    "id": "6",
    "num_id": 6,
    "key": "6",
    "name": "Shotgun Draw 45",
    "play_name": "Shotgun Draw 45",
    "card_title": "Gun Draw 45",
    "formation": "SHOTGUN",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Shotgun Right - 45 Lead Draw",
    "description": "Shotgun Draw 45 (SHOTGUN) \u2014 Shotgun Right - 45 Lead Draw",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            -3,
            -5
          ],
          [
            0,
            -4
          ],
          [
            1,
            1
          ],
          [
            1,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "QB",
        "type": "HANDOFF",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -5
          ],
          [
            0,
            -4
          ]
        ],
        "arrow": false
      }
    ]
  },
  "7": {
    "id": "7",
    "num_id": 7,
    "key": "7",
    "name": "Shotgun Shallow Cross",
    "play_name": "Shotgun Shallow Cross",
    "card_title": "Shallow Cross",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - 322 Shallow Cross",
    "description": "Shotgun Shallow Cross (SHOTGUN) \u2014 Shotgun Spread - 322 Shallow Cross",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        8,
        -1
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -8,
            -1
          ],
          [
            -8,
            2
          ],
          [
            10,
            3
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            -1
          ],
          [
            8,
            10
          ],
          [
            2,
            12
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            12
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_shallow_cross": {
    "id": "7",
    "num_id": 7,
    "key": "7",
    "name": "Shotgun Shallow Cross",
    "play_name": "Shotgun Shallow Cross",
    "card_title": "Shallow Cross",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - 322 Shallow Cross",
    "description": "Shotgun Shallow Cross (SHOTGUN) \u2014 Shotgun Spread - 322 Shallow Cross",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        8,
        -1
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -8,
            -1
          ],
          [
            -8,
            2
          ],
          [
            10,
            3
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            -1
          ],
          [
            8,
            10
          ],
          [
            2,
            12
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            12
          ]
        ],
        "arrow": true
      }
    ]
  },
  "8": {
    "id": "8",
    "num_id": 8,
    "key": "8",
    "name": "Shotgun Texas Route",
    "play_name": "Shotgun Texas Route",
    "card_title": "Texas Concept",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Trips Right - HB Texas / Spacing",
    "description": "Shotgun Texas Route (SHOTGUN) \u2014 Shotgun Trips Right - HB Texas / Spacing",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        6,
        0
      ],
      "Y": [
        10,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -3,
            -5
          ],
          [
            2,
            -2
          ],
          [
            0,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            10,
            -1
          ],
          [
            10,
            5
          ],
          [
            14,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            6
          ],
          [
            4,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_texas_route": {
    "id": "8",
    "num_id": 8,
    "key": "8",
    "name": "Shotgun Texas Route",
    "play_name": "Shotgun Texas Route",
    "card_title": "Texas Concept",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Trips Right - HB Texas / Spacing",
    "description": "Shotgun Texas Route (SHOTGUN) \u2014 Shotgun Trips Right - HB Texas / Spacing",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        6,
        0
      ],
      "Y": [
        10,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -3,
            -5
          ],
          [
            2,
            -2
          ],
          [
            0,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            10,
            -1
          ],
          [
            10,
            5
          ],
          [
            14,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            6
          ],
          [
            4,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "9": {
    "id": "9",
    "num_id": 9,
    "key": "9",
    "name": "Shotgun Double Out",
    "play_name": "Shotgun Double Out",
    "card_title": "Double Outs",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Open - 18 Quick Out",
    "description": "Shotgun Double Out (SHOTGUN) \u2014 Shotgun Open - 18 Quick Out",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        8,
        -1
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            7
          ],
          [
            -18,
            7
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            7
          ],
          [
            18,
            7
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_double_out": {
    "id": "9",
    "num_id": 9,
    "key": "9",
    "name": "Shotgun Double Out",
    "play_name": "Shotgun Double Out",
    "card_title": "Double Outs",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Open - 18 Quick Out",
    "description": "Shotgun Double Out (SHOTGUN) \u2014 Shotgun Open - 18 Quick Out",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        8,
        -1
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            7
          ],
          [
            -18,
            7
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            7
          ],
          [
            18,
            7
          ]
        ],
        "arrow": true
      }
    ]
  },
  "10": {
    "id": "10",
    "num_id": 10,
    "key": "10",
    "name": "Shotgun Four Verticals",
    "play_name": "Shotgun Four Verticals",
    "card_title": "Four Verticals",
    "formation": "SHOTGUN",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - 366 All-Go",
    "description": "Shotgun Four Verticals (SHOTGUN) \u2014 Shotgun Spread - 366 All-Go",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -7,
        -1
      ],
      "Y": [
        7,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -7,
            -1
          ],
          [
            -5,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            7,
            -1
          ],
          [
            5,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            22
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_four_verticals": {
    "id": "10",
    "num_id": 10,
    "key": "10",
    "name": "Shotgun Four Verticals",
    "play_name": "Shotgun Four Verticals",
    "card_title": "Four Verticals",
    "formation": "SHOTGUN",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - 366 All-Go",
    "description": "Shotgun Four Verticals (SHOTGUN) \u2014 Shotgun Spread - 366 All-Go",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -7,
        -1
      ],
      "Y": [
        7,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -7,
            -1
          ],
          [
            -5,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            7,
            -1
          ],
          [
            5,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            22
          ]
        ],
        "arrow": true
      }
    ]
  },
  "11": {
    "id": "11",
    "num_id": 11,
    "key": "11",
    "name": "Pistol Inside Zone",
    "play_name": "Pistol Inside Zone",
    "card_title": "Inside Zone",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Blue Right - 14 Inside Zone",
    "description": "Pistol Inside Zone (PISTOL) \u2014 Pistol Blue Right - 14 Inside Zone",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "FB": [
        -3,
        -2
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            0,
            -4
          ],
          [
            -1,
            1
          ],
          [
            -1,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            -3,
            -2
          ],
          [
            -1,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "pistol_inside_zone": {
    "id": "11",
    "num_id": 11,
    "key": "11",
    "name": "Pistol Inside Zone",
    "play_name": "Pistol Inside Zone",
    "card_title": "Inside Zone",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Blue Right - 14 Inside Zone",
    "description": "Pistol Inside Zone (PISTOL) \u2014 Pistol Blue Right - 14 Inside Zone",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "FB": [
        -3,
        -2
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            0,
            -4
          ],
          [
            -1,
            1
          ],
          [
            -1,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            -3,
            -2
          ],
          [
            -1,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "12": {
    "id": "12",
    "num_id": 12,
    "key": "12",
    "name": "Pistol Toss Sweep",
    "play_name": "Pistol Toss Sweep",
    "card_title": "Toss Sweep",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Red Right - 68 Toss Sweep",
    "description": "Pistol Toss Sweep (PISTOL) \u2014 Pistol Red Right - 68 Toss Sweep",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "FB": [
        3,
        -2
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            5,
            -4
          ],
          [
            10,
            1
          ],
          [
            12,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            3,
            -2
          ],
          [
            8,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "pistol_toss_sweep": {
    "id": "12",
    "num_id": 12,
    "key": "12",
    "name": "Pistol Toss Sweep",
    "play_name": "Pistol Toss Sweep",
    "card_title": "Toss Sweep",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Red Right - 68 Toss Sweep",
    "description": "Pistol Toss Sweep (PISTOL) \u2014 Pistol Red Right - 68 Toss Sweep",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "FB": [
        3,
        -2
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            5,
            -4
          ],
          [
            10,
            1
          ],
          [
            12,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            3,
            -2
          ],
          [
            8,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "13": {
    "id": "13",
    "num_id": 13,
    "key": "13",
    "name": "Pistol Smash Concept",
    "play_name": "Pistol Smash Concept",
    "card_title": "Smash Corner",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Slot - 22 Smash / Corner",
    "description": "Pistol Smash Concept (PISTOL) \u2014 Pistol Slot - 22 Smash / Corner",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "H": [
        9,
        -1
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            5
          ],
          [
            12,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            9,
            -1
          ],
          [
            9,
            12
          ],
          [
            16,
            18
          ]
        ],
        "arrow": true
      }
    ]
  },
  "pistol_smash_concept": {
    "id": "13",
    "num_id": 13,
    "key": "13",
    "name": "Pistol Smash Concept",
    "play_name": "Pistol Smash Concept",
    "card_title": "Smash Corner",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Slot - 22 Smash / Corner",
    "description": "Pistol Smash Concept (PISTOL) \u2014 Pistol Slot - 22 Smash / Corner",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "H": [
        9,
        -1
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            5
          ],
          [
            12,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            9,
            -1
          ],
          [
            9,
            12
          ],
          [
            16,
            18
          ]
        ],
        "arrow": true
      }
    ]
  },
  "14": {
    "id": "14",
    "num_id": 14,
    "key": "14",
    "name": "Pistol Bootleg Waggle",
    "play_name": "Pistol Bootleg Waggle",
    "card_title": "Pistol Waggle",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Right - Fake 18 Waggle",
    "description": "Pistol Bootleg Waggle (PISTOL) \u2014 Pistol Right - Fake 18 Waggle",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -4,
            -5
          ],
          [
            -8,
            -3
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            4,
            3
          ],
          [
            -10,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            4,
            -4
          ],
          [
            10,
            0
          ]
        ],
        "arrow": true
      }
    ]
  },
  "pistol_bootleg_waggle": {
    "id": "14",
    "num_id": 14,
    "key": "14",
    "name": "Pistol Bootleg Waggle",
    "play_name": "Pistol Bootleg Waggle",
    "card_title": "Pistol Waggle",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Right - Fake 18 Waggle",
    "description": "Pistol Bootleg Waggle (PISTOL) \u2014 Pistol Right - Fake 18 Waggle",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -4,
            -5
          ],
          [
            -8,
            -3
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            4,
            3
          ],
          [
            -10,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            4,
            -4
          ],
          [
            10,
            0
          ]
        ],
        "arrow": true
      }
    ]
  },
  "15": {
    "id": "15",
    "num_id": 15,
    "key": "15",
    "name": "Pistol Post-Corner Deep Shot",
    "play_name": "Pistol Post-Corner Deep Shot",
    "card_title": "Post-Corner",
    "formation": "PISTOL",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Pistol Flex - 388 Post-Corner",
    "description": "Pistol Post-Corner Deep Shot (PISTOL) \u2014 Pistol Flex - 388 Post-Corner",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            10
          ],
          [
            10,
            13
          ],
          [
            16,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            12
          ],
          [
            -4,
            18
          ]
        ],
        "arrow": true
      }
    ]
  },
  "pistol_post_corner_deep_shot": {
    "id": "15",
    "num_id": 15,
    "key": "15",
    "name": "Pistol Post-Corner Deep Shot",
    "play_name": "Pistol Post-Corner Deep Shot",
    "card_title": "Post-Corner",
    "formation": "PISTOL",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Pistol Flex - 388 Post-Corner",
    "description": "Pistol Post-Corner Deep Shot (PISTOL) \u2014 Pistol Flex - 388 Post-Corner",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            10
          ],
          [
            10,
            13
          ],
          [
            16,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            12
          ],
          [
            -4,
            18
          ]
        ],
        "arrow": true
      }
    ]
  },
  "16": {
    "id": "16",
    "num_id": 16,
    "key": "16",
    "name": "Empty Quick Spacing",
    "play_name": "Empty Quick Spacing",
    "card_title": "Spacing",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 10 Spacing / Quick Hitch",
    "description": "Empty Quick Spacing (EMPTY) \u2014 Empty Spread - 10 Spacing / Quick Hitch",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -15,
            0
          ],
          [
            -15,
            5
          ],
          [
            -13,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -8,
            0
          ],
          [
            -8,
            5
          ],
          [
            -6,
            4
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            4,
            0
          ],
          [
            4,
            5
          ],
          [
            2,
            4
          ]
        ],
        "arrow": true
      },
      {
        "player": "F",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            9,
            0
          ],
          [
            12,
            2
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            15,
            0
          ],
          [
            15,
            5
          ],
          [
            13,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_quick_spacing": {
    "id": "16",
    "num_id": 16,
    "key": "16",
    "name": "Empty Quick Spacing",
    "play_name": "Empty Quick Spacing",
    "card_title": "Spacing",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 10 Spacing / Quick Hitch",
    "description": "Empty Quick Spacing (EMPTY) \u2014 Empty Spread - 10 Spacing / Quick Hitch",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -15,
            0
          ],
          [
            -15,
            5
          ],
          [
            -13,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -8,
            0
          ],
          [
            -8,
            5
          ],
          [
            -6,
            4
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            4,
            0
          ],
          [
            4,
            5
          ],
          [
            2,
            4
          ]
        ],
        "arrow": true
      },
      {
        "player": "F",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            9,
            0
          ],
          [
            12,
            2
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            15,
            0
          ],
          [
            15,
            5
          ],
          [
            13,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "17": {
    "id": "17",
    "num_id": 17,
    "key": "17",
    "name": "Empty Y-Cross",
    "play_name": "Empty Y-Cross",
    "card_title": "Y-Cross",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Trips Right - 32 Cross Y-Over",
    "description": "Empty Y-Cross (EMPTY) \u2014 Empty Trips Right - 32 Cross Y-Over",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -7,
        0
      ],
      "Y": [
        5,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            5,
            0
          ],
          [
            5,
            6
          ],
          [
            -10,
            10
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            14
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_y_cross": {
    "id": "17",
    "num_id": 17,
    "key": "17",
    "name": "Empty Y-Cross",
    "play_name": "Empty Y-Cross",
    "card_title": "Y-Cross",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Trips Right - 32 Cross Y-Over",
    "description": "Empty Y-Cross (EMPTY) \u2014 Empty Trips Right - 32 Cross Y-Over",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -7,
        0
      ],
      "Y": [
        5,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            5,
            0
          ],
          [
            5,
            6
          ],
          [
            -10,
            10
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            14
          ]
        ],
        "arrow": true
      }
    ]
  },
  "18": {
    "id": "18",
    "num_id": 18,
    "key": "18",
    "name": "Empty Stick Option",
    "play_name": "Empty Stick Option",
    "card_title": "Empty Stick",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 14 Stick / Option",
    "description": "Empty Stick Option (EMPTY) \u2014 Empty Spread - 14 Stick / Option",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -7,
        0
      ],
      "Y": [
        6,
        0
      ],
      "Z": [
        14,
        0
      ],
      "F": [
        10,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            6
          ],
          [
            8,
            6
          ]
        ],
        "arrow": true
      },
      {
        "player": "F",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            10,
            0
          ],
          [
            13,
            1
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_stick_option": {
    "id": "18",
    "num_id": 18,
    "key": "18",
    "name": "Empty Stick Option",
    "play_name": "Empty Stick Option",
    "card_title": "Empty Stick",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 14 Stick / Option",
    "description": "Empty Stick Option (EMPTY) \u2014 Empty Spread - 14 Stick / Option",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -7,
        0
      ],
      "Y": [
        6,
        0
      ],
      "Z": [
        14,
        0
      ],
      "F": [
        10,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            6
          ],
          [
            8,
            6
          ]
        ],
        "arrow": true
      },
      {
        "player": "F",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            10,
            0
          ],
          [
            13,
            1
          ]
        ],
        "arrow": true
      }
    ]
  },
  "19": {
    "id": "19",
    "num_id": 19,
    "key": "19",
    "name": "Empty Double Seams",
    "play_name": "Empty Double Seams",
    "card_title": "Double Seams",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 364 Double Seams",
    "description": "Empty Double Seams (EMPTY) \u2014 Empty Spread - 364 Double Seams",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -7,
        0
      ],
      "Y": [
        7,
        0
      ],
      "Z": [
        15,
        0
      ],
      "F": [
        11,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -7,
            0
          ],
          [
            -7,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            7,
            0
          ],
          [
            7,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_double_seams": {
    "id": "19",
    "num_id": 19,
    "key": "19",
    "name": "Empty Double Seams",
    "play_name": "Empty Double Seams",
    "card_title": "Double Seams",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 364 Double Seams",
    "description": "Empty Double Seams (EMPTY) \u2014 Empty Spread - 364 Double Seams",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -7,
        0
      ],
      "Y": [
        7,
        0
      ],
      "Z": [
        15,
        0
      ],
      "F": [
        11,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -7,
            0
          ],
          [
            -7,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            7,
            0
          ],
          [
            7,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "20": {
    "id": "20",
    "num_id": 20,
    "key": "20",
    "name": "Empty Slant-Wheel",
    "play_name": "Empty Slant-Wheel",
    "card_title": "Slant Wheel",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Flex - 378 Slant-Wheel",
    "description": "Empty Slant-Wheel (EMPTY) \u2014 Empty Flex - 378 Slant-Wheel",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        8,
        0
      ],
      "Z": [
        14,
        0
      ],
      "F": [
        4,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            4
          ],
          [
            5,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            12,
            3
          ],
          [
            14,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_slant_wheel": {
    "id": "20",
    "num_id": 20,
    "key": "20",
    "name": "Empty Slant-Wheel",
    "play_name": "Empty Slant-Wheel",
    "card_title": "Slant Wheel",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Flex - 378 Slant-Wheel",
    "description": "Empty Slant-Wheel (EMPTY) \u2014 Empty Flex - 378 Slant-Wheel",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        8,
        0
      ],
      "Z": [
        14,
        0
      ],
      "F": [
        4,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            4
          ],
          [
            5,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            12,
            3
          ],
          [
            14,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "21": {
    "id": "21",
    "num_id": 21,
    "key": "21",
    "name": "Goal Line Wedge Dive",
    "play_name": "Goal Line Wedge Dive",
    "card_title": "Wedge Dive",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Heavy Jumbo Right - 30 Wedge FB Dive",
    "description": "Goal Line Wedge Dive (GOAL LINE) \u2014 Heavy Jumbo Right - 30 Wedge FB Dive",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        -8,
        0
      ],
      "TE2": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            0,
            3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_wedge_dive": {
    "id": "21",
    "num_id": 21,
    "key": "21",
    "name": "Goal Line Wedge Dive",
    "play_name": "Goal Line Wedge Dive",
    "card_title": "Wedge Dive",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Heavy Jumbo Right - 30 Wedge FB Dive",
    "description": "Goal Line Wedge Dive (GOAL LINE) \u2014 Heavy Jumbo Right - 30 Wedge FB Dive",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        -8,
        0
      ],
      "TE2": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            0,
            3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "22": {
    "id": "22",
    "num_id": 22,
    "key": "22",
    "name": "Goal Line Power Pitch",
    "play_name": "Goal Line Power Pitch",
    "card_title": "Power Pitch",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Goal Line Left - 18 Toss Power",
    "description": "Goal Line Power Pitch (GOAL LINE) \u2014 Goal Line Left - 18 Toss Power",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        -8,
        0
      ],
      "TE2": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        -2,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -5,
            -3
          ],
          [
            -9,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_power_pitch": {
    "id": "22",
    "num_id": 22,
    "key": "22",
    "name": "Goal Line Power Pitch",
    "play_name": "Goal Line Power Pitch",
    "card_title": "Power Pitch",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Goal Line Left - 18 Toss Power",
    "description": "Goal Line Power Pitch (GOAL LINE) \u2014 Goal Line Left - 18 Toss Power",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        -8,
        0
      ],
      "TE2": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        -2,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -5,
            -3
          ],
          [
            -9,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "23": {
    "id": "23",
    "num_id": 23,
    "key": "23",
    "name": "Goal Line TE Pop Pass",
    "play_name": "Goal Line TE Pop Pass",
    "card_title": "TE Pop Pass",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Jumbo - Fake 30 TE Pop Pass",
    "description": "Goal Line TE Pop Pass (GOAL LINE) \u2014 Goal Line Jumbo - Fake 30 TE Pop Pass",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            6,
            1
          ],
          [
            4,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_te_pop_pass": {
    "id": "23",
    "num_id": 23,
    "key": "23",
    "name": "Goal Line TE Pop Pass",
    "play_name": "Goal Line TE Pop Pass",
    "card_title": "TE Pop Pass",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Jumbo - Fake 30 TE Pop Pass",
    "description": "Goal Line TE Pop Pass (GOAL LINE) \u2014 Goal Line Jumbo - Fake 30 TE Pop Pass",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            6,
            1
          ],
          [
            4,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "24": {
    "id": "24",
    "num_id": 24,
    "key": "24",
    "name": "Goal Line Sprint Corner Fade",
    "play_name": "Goal Line Sprint Corner Fade",
    "card_title": "Sprint Fade",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Right - Sprint 9 Fade",
    "description": "Goal Line Sprint Corner Fade (GOAL LINE) \u2014 Goal Line Right - Sprint 9 Fade",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Z": [
        12,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        2,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -2
          ],
          [
            4,
            -3
          ],
          [
            7,
            -2
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            12,
            0
          ],
          [
            12,
            5
          ],
          [
            15,
            9
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_sprint_corner_fade": {
    "id": "24",
    "num_id": 24,
    "key": "24",
    "name": "Goal Line Sprint Corner Fade",
    "play_name": "Goal Line Sprint Corner Fade",
    "card_title": "Sprint Fade",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Right - Sprint 9 Fade",
    "description": "Goal Line Sprint Corner Fade (GOAL LINE) \u2014 Goal Line Right - Sprint 9 Fade",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Z": [
        12,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        2,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -2
          ],
          [
            4,
            -3
          ],
          [
            7,
            -2
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            12,
            0
          ],
          [
            12,
            5
          ],
          [
            15,
            9
          ]
        ],
        "arrow": true
      }
    ]
  },
  "25": {
    "id": "25",
    "num_id": 25,
    "key": "25",
    "name": "Goal Line FB Flat Leak",
    "play_name": "Goal Line FB Flat Leak",
    "card_title": "FB Flat Leak",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Left - Heavy Rollout FB Leak",
    "description": "Goal Line FB Flat Leak (GOAL LINE) \u2014 Goal Line Left - Heavy Rollout FB Leak",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -3,
            0
          ],
          [
            -9,
            2
          ]
        ],
        "arrow": true
      },
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -2
          ],
          [
            -4,
            -3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_fb_flat_leak": {
    "id": "25",
    "num_id": 25,
    "key": "25",
    "name": "Goal Line FB Flat Leak",
    "play_name": "Goal Line FB Flat Leak",
    "card_title": "FB Flat Leak",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Left - Heavy Rollout FB Leak",
    "description": "Goal Line FB Flat Leak (GOAL LINE) \u2014 Goal Line Left - Heavy Rollout FB Leak",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -3,
            0
          ],
          [
            -9,
            2
          ]
        ],
        "arrow": true
      },
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -2
          ],
          [
            -4,
            -3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "26": {
    "id": "26",
    "num_id": 26,
    "key": "26",
    "name": "I-Form FB Lead 14",
    "play_name": "I-Form FB Lead 14",
    "card_title": "FB Lead 14",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Red Right - 14 Lead C",
    "description": "I-Form FB Lead 14 (I-FORM) \u2014 Red Right - 14 Lead C",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            0,
            -4
          ],
          [
            -2,
            1
          ],
          [
            -2,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -2,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "i_form_fb_lead_14": {
    "id": "26",
    "num_id": 26,
    "key": "26",
    "name": "I-Form FB Lead 14",
    "play_name": "I-Form FB Lead 14",
    "card_title": "FB Lead 14",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Red Right - 14 Lead C",
    "description": "I-Form FB Lead 14 (I-FORM) \u2014 Red Right - 14 Lead C",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            0,
            -4
          ],
          [
            -2,
            1
          ],
          [
            -2,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -2,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "27": {
    "id": "27",
    "num_id": 27,
    "key": "27",
    "name": "I-Form Wham Trap 15",
    "play_name": "I-Form Wham Trap 15",
    "card_title": "Wham Trap 15",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Green Right - 15 Wham",
    "description": "I-Form Wham Trap 15 (I-FORM) \u2014 Green Right - 15 Wham",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -1,
            -4
          ],
          [
            -1,
            1
          ],
          [
            -1,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -2,
            0
          ]
        ],
        "arrow": false
      }
    ]
  },
  "i_form_wham_trap_15": {
    "id": "27",
    "num_id": 27,
    "key": "27",
    "name": "I-Form Wham Trap 15",
    "play_name": "I-Form Wham Trap 15",
    "card_title": "Wham Trap 15",
    "formation": "I-FORM",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Green Right - 15 Wham",
    "description": "I-Form Wham Trap 15 (I-FORM) \u2014 Green Right - 15 Wham",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        12,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -1,
            -4
          ],
          [
            -1,
            1
          ],
          [
            -1,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            -2,
            0
          ]
        ],
        "arrow": false
      }
    ]
  },
  "28": {
    "id": "28",
    "num_id": 28,
    "key": "28",
    "name": "I-Form FB Screen",
    "play_name": "I-Form FB Screen",
    "card_title": "FB Screen",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Red Right - HB Fake / FB Screen 3",
    "description": "I-Form FB Screen (I-FORM) \u2014 Red Right - HB Fake / FB Screen 3",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            3,
            -3
          ],
          [
            6,
            -1
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -2,
            -3
          ]
        ],
        "arrow": false
      },
      {
        "player": "BSG",
        "type": "SCREEN_LEAD",
        "color": "WHITE",
        "waypoints": [
          [
            -2,
            0
          ],
          [
            2,
            -1
          ],
          [
            6,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "i_form_fb_screen": {
    "id": "28",
    "num_id": 28,
    "key": "28",
    "name": "I-Form FB Screen",
    "play_name": "I-Form FB Screen",
    "card_title": "FB Screen",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Red Right - HB Fake / FB Screen 3",
    "description": "I-Form FB Screen (I-FORM) \u2014 Red Right - HB Fake / FB Screen 3",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            3,
            -3
          ],
          [
            6,
            -1
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            -2,
            -3
          ]
        ],
        "arrow": false
      },
      {
        "player": "BSG",
        "type": "SCREEN_LEAD",
        "color": "WHITE",
        "waypoints": [
          [
            -2,
            0
          ],
          [
            2,
            -1
          ],
          [
            6,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "29": {
    "id": "29",
    "num_id": 29,
    "key": "29",
    "name": "I-Form Quick Out & Hitch",
    "play_name": "I-Form Quick Out & Hitch",
    "card_title": "Out & Hitch",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Blue Left - 18 Out / X Hitch",
    "description": "I-Form Quick Out & Hitch (I-FORM) \u2014 Blue Left - 18 Out / X Hitch",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            -1
          ],
          [
            -14,
            6
          ],
          [
            -18,
            6
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            6
          ],
          [
            13,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "i_form_quick_out_and_hitch": {
    "id": "29",
    "num_id": 29,
    "key": "29",
    "name": "I-Form Quick Out & Hitch",
    "play_name": "I-Form Quick Out & Hitch",
    "card_title": "Out & Hitch",
    "formation": "I-FORM",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Blue Left - 18 Out / X Hitch",
    "description": "I-Form Quick Out & Hitch (I-FORM) \u2014 Blue Left - 18 Out / X Hitch",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            -1
          ],
          [
            -14,
            6
          ],
          [
            -18,
            6
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            6
          ],
          [
            13,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "30": {
    "id": "30",
    "num_id": 30,
    "key": "30",
    "name": "I-Form PA Flea Flicker",
    "play_name": "I-Form PA Flea Flicker",
    "card_title": "PA Flea Flicker",
    "formation": "I-FORM",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Red Right - Play-Action Flea Flicker Deep",
    "description": "I-Form PA Flea Flicker (I-FORM) \u2014 Red Right - Play-Action Flea Flicker Deep",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            -1
          ],
          [
            14,
            10
          ],
          [
            2,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "PITCHBACK",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            0,
            -3
          ],
          [
            0,
            -5
          ]
        ],
        "arrow": false
      }
    ]
  },
  "i_form_pa_flea_flicker": {
    "id": "30",
    "num_id": 30,
    "key": "30",
    "name": "I-Form PA Flea Flicker",
    "play_name": "I-Form PA Flea Flicker",
    "card_title": "PA Flea Flicker",
    "formation": "I-FORM",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Red Right - Play-Action Flea Flicker Deep",
    "description": "I-Form PA Flea Flicker (I-FORM) \u2014 Red Right - Play-Action Flea Flicker Deep",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        -1
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            -1
          ],
          [
            14,
            10
          ],
          [
            2,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "PITCHBACK",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            0,
            -3
          ],
          [
            0,
            -5
          ]
        ],
        "arrow": false
      }
    ]
  },
  "31": {
    "id": "31",
    "num_id": 31,
    "key": "31",
    "name": "Shotgun Speed Option",
    "play_name": "Shotgun Speed Option",
    "card_title": "Speed Option",
    "formation": "SHOTGUN",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Shotgun Right - 18 Speed Option",
    "description": "Shotgun Speed Option (SHOTGUN) \u2014 Shotgun Right - 18 Speed Option",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "OPTION_RUN",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -5
          ],
          [
            4,
            -3
          ],
          [
            6,
            1
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "PITCH_PITCH",
        "color": "GREEN",
        "waypoints": [
          [
            -3,
            -5
          ],
          [
            1,
            -3
          ],
          [
            8,
            1
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_speed_option": {
    "id": "31",
    "num_id": 31,
    "key": "31",
    "name": "Shotgun Speed Option",
    "play_name": "Shotgun Speed Option",
    "card_title": "Speed Option",
    "formation": "SHOTGUN",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Shotgun Right - 18 Speed Option",
    "description": "Shotgun Speed Option (SHOTGUN) \u2014 Shotgun Right - 18 Speed Option",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "OPTION_RUN",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -5
          ],
          [
            4,
            -3
          ],
          [
            6,
            1
          ]
        ],
        "arrow": true
      },
      {
        "player": "HB",
        "type": "PITCH_PITCH",
        "color": "GREEN",
        "waypoints": [
          [
            -3,
            -5
          ],
          [
            1,
            -3
          ],
          [
            8,
            1
          ]
        ],
        "arrow": true
      }
    ]
  },
  "32": {
    "id": "32",
    "num_id": 32,
    "key": "32",
    "name": "Shotgun Double Slants",
    "play_name": "Shotgun Double Slants",
    "card_title": "Double Slants",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - 12 Double Slant",
    "description": "Shotgun Double Slants (SHOTGUN) \u2014 Shotgun Spread - 12 Double Slant",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Y": [
        8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            4
          ],
          [
            -4,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -8,
            -1
          ],
          [
            -8,
            4
          ],
          [
            0,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_double_slants": {
    "id": "32",
    "num_id": 32,
    "key": "32",
    "name": "Shotgun Double Slants",
    "play_name": "Shotgun Double Slants",
    "card_title": "Double Slants",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - 12 Double Slant",
    "description": "Shotgun Double Slants (SHOTGUN) \u2014 Shotgun Spread - 12 Double Slant",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Y": [
        8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            4
          ],
          [
            -4,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -8,
            -1
          ],
          [
            -8,
            4
          ],
          [
            0,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "33": {
    "id": "33",
    "num_id": 33,
    "key": "33",
    "name": "Shotgun Corner-Post",
    "play_name": "Shotgun Corner-Post",
    "card_title": "Corner-Post",
    "formation": "SHOTGUN",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Shotgun Open - 386 Corner-Post",
    "description": "Shotgun Corner-Post (SHOTGUN) \u2014 Shotgun Open - 386 Corner-Post",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        8,
        -1
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            10
          ],
          [
            18,
            14
          ],
          [
            4,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            12
          ],
          [
            -18,
            16
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_corner_post": {
    "id": "33",
    "num_id": 33,
    "key": "33",
    "name": "Shotgun Corner-Post",
    "play_name": "Shotgun Corner-Post",
    "card_title": "Corner-Post",
    "formation": "SHOTGUN",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Shotgun Open - 386 Corner-Post",
    "description": "Shotgun Corner-Post (SHOTGUN) \u2014 Shotgun Open - 386 Corner-Post",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        8,
        -1
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            10
          ],
          [
            18,
            14
          ],
          [
            4,
            22
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            12
          ],
          [
            -18,
            16
          ]
        ],
        "arrow": true
      }
    ]
  },
  "34": {
    "id": "34",
    "num_id": 34,
    "key": "34",
    "name": "Shotgun Drive Concept",
    "play_name": "Shotgun Drive Concept",
    "card_title": "Drive Concept",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Trips Right - 322 Drive",
    "description": "Shotgun Drive Concept (SHOTGUN) \u2014 Shotgun Trips Right - 322 Drive",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        6,
        0
      ],
      "Y": [
        10,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            2
          ],
          [
            -8,
            3
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            10,
            -1
          ],
          [
            10,
            10
          ],
          [
            -2,
            10
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_drive_concept": {
    "id": "34",
    "num_id": 34,
    "key": "34",
    "name": "Shotgun Drive Concept",
    "play_name": "Shotgun Drive Concept",
    "card_title": "Drive Concept",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Trips Right - 322 Drive",
    "description": "Shotgun Drive Concept (SHOTGUN) \u2014 Shotgun Trips Right - 322 Drive",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        6,
        0
      ],
      "Y": [
        10,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        -3,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            2
          ],
          [
            -8,
            3
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            10,
            -1
          ],
          [
            10,
            10
          ],
          [
            -2,
            10
          ]
        ],
        "arrow": true
      }
    ]
  },
  "35": {
    "id": "35",
    "num_id": 35,
    "key": "35",
    "name": "Shotgun HB Screen",
    "play_name": "Shotgun HB Screen",
    "card_title": "HB Screen",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - Delay HB Screen Left",
    "description": "Shotgun HB Screen (SHOTGUN) \u2014 Shotgun Spread - Delay HB Screen Left",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Y": [
        8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            3,
            -5
          ],
          [
            -2,
            -4
          ],
          [
            -6,
            -1
          ]
        ],
        "arrow": true
      },
      {
        "player": "BSG",
        "type": "SCREEN_LEAD",
        "color": "WHITE",
        "waypoints": [
          [
            -2,
            0
          ],
          [
            -5,
            -1
          ],
          [
            -8,
            3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "shotgun_hb_screen": {
    "id": "35",
    "num_id": 35,
    "key": "35",
    "name": "Shotgun HB Screen",
    "play_name": "Shotgun HB Screen",
    "card_title": "HB Screen",
    "formation": "SHOTGUN",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Shotgun Spread - Delay HB Screen Left",
    "description": "Shotgun HB Screen (SHOTGUN) \u2014 Shotgun Spread - Delay HB Screen Left",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        -8,
        -1
      ],
      "Y": [
        8,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -5
      ],
      "HB": [
        3,
        -5
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            3,
            -5
          ],
          [
            -2,
            -4
          ],
          [
            -6,
            -1
          ]
        ],
        "arrow": true
      },
      {
        "player": "BSG",
        "type": "SCREEN_LEAD",
        "color": "WHITE",
        "waypoints": [
          [
            -2,
            0
          ],
          [
            -5,
            -1
          ],
          [
            -8,
            3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "36": {
    "id": "36",
    "num_id": 36,
    "key": "36",
    "name": "Pistol Outside Zone",
    "play_name": "Pistol Outside Zone",
    "card_title": "Outside Zone",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Red Right - 18 Stretch",
    "description": "Pistol Outside Zone (PISTOL) \u2014 Pistol Red Right - 18 Stretch",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            4,
            -4
          ],
          [
            8,
            1
          ],
          [
            10,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "pistol_outside_zone": {
    "id": "36",
    "num_id": 36,
    "key": "36",
    "name": "Pistol Outside Zone",
    "play_name": "Pistol Outside Zone",
    "card_title": "Outside Zone",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Red Right - 18 Stretch",
    "description": "Pistol Outside Zone (PISTOL) \u2014 Pistol Red Right - 18 Stretch",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            4,
            -4
          ],
          [
            8,
            1
          ],
          [
            10,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "37": {
    "id": "37",
    "num_id": 37,
    "key": "37",
    "name": "Pistol Counter GT",
    "play_name": "Pistol Counter GT",
    "card_title": "Counter GT",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Heavy - Counter 35 GT",
    "description": "Pistol Counter GT (PISTOL) \u2014 Pistol Heavy - Counter 35 GT",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            2,
            -6
          ],
          [
            -3,
            -3
          ],
          [
            -4,
            4
          ]
        ],
        "arrow": true
      },
      {
        "player": "BSG",
        "type": "PULL",
        "color": "WHITE",
        "waypoints": [
          [
            2,
            0
          ],
          [
            0,
            -1.5
          ],
          [
            -3,
            1
          ]
        ],
        "arrow": false
      },
      {
        "player": "BST",
        "type": "PULL",
        "color": "WHITE",
        "waypoints": [
          [
            4,
            0
          ],
          [
            1,
            -2
          ],
          [
            -2,
            2
          ]
        ],
        "arrow": false
      }
    ]
  },
  "pistol_counter_gt": {
    "id": "37",
    "num_id": 37,
    "key": "37",
    "name": "Pistol Counter GT",
    "play_name": "Pistol Counter GT",
    "card_title": "Counter GT",
    "formation": "PISTOL",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Pistol Heavy - Counter 35 GT",
    "description": "Pistol Counter GT (PISTOL) \u2014 Pistol Heavy - Counter 35 GT",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        -6,
        0
      ],
      "X": [
        14,
        0
      ],
      "Z": [
        -14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            2,
            -6
          ],
          [
            -3,
            -3
          ],
          [
            -4,
            4
          ]
        ],
        "arrow": true
      },
      {
        "player": "BSG",
        "type": "PULL",
        "color": "WHITE",
        "waypoints": [
          [
            2,
            0
          ],
          [
            0,
            -1.5
          ],
          [
            -3,
            1
          ]
        ],
        "arrow": false
      },
      {
        "player": "BST",
        "type": "PULL",
        "color": "WHITE",
        "waypoints": [
          [
            4,
            0
          ],
          [
            1,
            -2
          ],
          [
            -2,
            2
          ]
        ],
        "arrow": false
      }
    ]
  },
  "38": {
    "id": "38",
    "num_id": 38,
    "key": "38",
    "name": "Pistol TE Delay Leak",
    "play_name": "Pistol TE Delay Leak",
    "card_title": "TE Delay Leak",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Slot - Bootleg TE Leak",
    "description": "Pistol TE Delay Leak (PISTOL) \u2014 Pistol Slot - Bootleg TE Leak",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            -4,
            4
          ],
          [
            -12,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            3,
            -5
          ],
          [
            6,
            -3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "pistol_te_delay_leak": {
    "id": "38",
    "num_id": 38,
    "key": "38",
    "name": "Pistol TE Delay Leak",
    "play_name": "Pistol TE Delay Leak",
    "card_title": "TE Delay Leak",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Slot - Bootleg TE Leak",
    "description": "Pistol TE Delay Leak (PISTOL) \u2014 Pistol Slot - Bootleg TE Leak",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "Y": [
        6,
        0
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            -4,
            4
          ],
          [
            -12,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "QB",
        "type": "ROLLOUT",
        "color": "ORANGE",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            3,
            -5
          ],
          [
            6,
            -3
          ]
        ],
        "arrow": true
      }
    ]
  },
  "39": {
    "id": "39",
    "num_id": 39,
    "key": "39",
    "name": "Pistol Dig/Settle",
    "play_name": "Pistol Dig/Settle",
    "card_title": "Dig Concept",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Trips - 24 Dig / Basic Cross",
    "description": "Pistol Dig/Settle (PISTOL) \u2014 Pistol Trips - 24 Dig / Basic Cross",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        6,
        0
      ],
      "Y": [
        10,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            10
          ],
          [
            2,
            10
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            5
          ],
          [
            10,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "pistol_dig_settle": {
    "id": "39",
    "num_id": 39,
    "key": "39",
    "name": "Pistol Dig/Settle",
    "play_name": "Pistol Dig/Settle",
    "card_title": "Dig Concept",
    "formation": "PISTOL",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Pistol Trips - 24 Dig / Basic Cross",
    "description": "Pistol Dig/Settle (PISTOL) \u2014 Pistol Trips - 24 Dig / Basic Cross",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "H": [
        6,
        0
      ],
      "Y": [
        10,
        -1
      ],
      "Z": [
        14,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            14,
            0
          ],
          [
            14,
            10
          ],
          [
            2,
            10
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            6,
            0
          ],
          [
            6,
            5
          ],
          [
            10,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "40": {
    "id": "40",
    "num_id": 40,
    "key": "40",
    "name": "Pistol Deep Wheel",
    "play_name": "Pistol Deep Wheel",
    "card_title": "HB Wheel Deep",
    "formation": "PISTOL",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Pistol Flex - 368 HB Wheel Deep",
    "description": "Pistol Deep Wheel (PISTOL) \u2014 Pistol Flex - 368 HB Wheel Deep",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            -6,
            -4
          ],
          [
            -12,
            2
          ],
          [
            -12,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            8
          ],
          [
            -4,
            12
          ]
        ],
        "arrow": true
      }
    ]
  },
  "pistol_deep_wheel": {
    "id": "40",
    "num_id": 40,
    "key": "40",
    "name": "Pistol Deep Wheel",
    "play_name": "Pistol Deep Wheel",
    "card_title": "HB Wheel Deep",
    "formation": "PISTOL",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Pistol Flex - 368 HB Wheel Deep",
    "description": "Pistol Deep Wheel (PISTOL) \u2014 Pistol Flex - 368 HB Wheel Deep",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -14,
        0
      ],
      "Z": [
        14,
        0
      ],
      "Y": [
        6,
        0
      ],
      "QB": [
        0,
        -4
      ],
      "HB": [
        0,
        -7
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            0,
            -7
          ],
          [
            -6,
            -4
          ],
          [
            -12,
            2
          ],
          [
            -12,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "X",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -14,
            0
          ],
          [
            -14,
            8
          ],
          [
            -4,
            12
          ]
        ],
        "arrow": true
      }
    ]
  },
  "41": {
    "id": "41",
    "num_id": 41,
    "key": "41",
    "name": "Empty QB Draw",
    "play_name": "Empty QB Draw",
    "card_title": "Empty QB Draw",
    "formation": "EMPTY",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Empty Spread - QB Draw 40",
    "description": "Empty QB Draw (EMPTY) \u2014 Empty Spread - QB Draw 40",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -5
          ],
          [
            0,
            -3
          ],
          [
            1,
            2
          ],
          [
            1,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_qb_draw": {
    "id": "41",
    "num_id": 41,
    "key": "41",
    "name": "Empty QB Draw",
    "play_name": "Empty QB Draw",
    "card_title": "Empty QB Draw",
    "formation": "EMPTY",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Empty Spread - QB Draw 40",
    "description": "Empty QB Draw (EMPTY) \u2014 Empty Spread - QB Draw 40",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -5
          ],
          [
            0,
            -3
          ],
          [
            1,
            2
          ],
          [
            1,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "42": {
    "id": "42",
    "num_id": 42,
    "key": "42",
    "name": "Empty Slant/Flat",
    "play_name": "Empty Slant/Flat",
    "card_title": "Slant / Flat",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 11 Quick Slant/Flat",
    "description": "Empty Slant/Flat (EMPTY) \u2014 Empty Spread - 11 Quick Slant/Flat",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            15,
            0
          ],
          [
            15,
            4
          ],
          [
            5,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "F",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            9,
            0
          ],
          [
            12,
            1
          ],
          [
            16,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_slant_flat": {
    "id": "42",
    "num_id": 42,
    "key": "42",
    "name": "Empty Slant/Flat",
    "play_name": "Empty Slant/Flat",
    "card_title": "Slant / Flat",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 11 Quick Slant/Flat",
    "description": "Empty Slant/Flat (EMPTY) \u2014 Empty Spread - 11 Quick Slant/Flat",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            15,
            0
          ],
          [
            15,
            4
          ],
          [
            5,
            9
          ]
        ],
        "arrow": true
      },
      {
        "player": "F",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            9,
            0
          ],
          [
            12,
            1
          ],
          [
            16,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "43": {
    "id": "43",
    "num_id": 43,
    "key": "43",
    "name": "Empty Curl/Wheel",
    "play_name": "Empty Curl/Wheel",
    "card_title": "Curl / Wheel",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Flex - 384 Curl/Wheel",
    "description": "Empty Curl/Wheel (EMPTY) \u2014 Empty Flex - 384 Curl/Wheel",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -15,
            0
          ],
          [
            -15,
            10
          ],
          [
            -13,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -8,
            0
          ],
          [
            -12,
            2
          ],
          [
            -15,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_curl_wheel": {
    "id": "43",
    "num_id": 43,
    "key": "43",
    "name": "Empty Curl/Wheel",
    "play_name": "Empty Curl/Wheel",
    "card_title": "Curl / Wheel",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Flex - 384 Curl/Wheel",
    "description": "Empty Curl/Wheel (EMPTY) \u2014 Empty Flex - 384 Curl/Wheel",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        4,
        0
      ],
      "F": [
        9,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -15,
            0
          ],
          [
            -15,
            10
          ],
          [
            -13,
            8
          ]
        ],
        "arrow": true
      },
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -8,
            0
          ],
          [
            -12,
            2
          ],
          [
            -15,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "44": {
    "id": "44",
    "num_id": 44,
    "key": "44",
    "name": "Empty Levels Concept",
    "play_name": "Empty Levels Concept",
    "card_title": "Levels Concept",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Trips Left - 16 Levels",
    "description": "Empty Levels Concept (EMPTY) \u2014 Empty Trips Left - 16 Levels",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -10,
        0
      ],
      "Y": [
        -5,
        0
      ],
      "F": [
        8,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -10,
            0
          ],
          [
            -10,
            5
          ],
          [
            4,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -5,
            0
          ],
          [
            -5,
            10
          ],
          [
            6,
            10
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_levels_concept": {
    "id": "44",
    "num_id": 44,
    "key": "44",
    "name": "Empty Levels Concept",
    "play_name": "Empty Levels Concept",
    "card_title": "Levels Concept",
    "formation": "EMPTY",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Empty Trips Left - 16 Levels",
    "description": "Empty Levels Concept (EMPTY) \u2014 Empty Trips Left - 16 Levels",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -10,
        0
      ],
      "Y": [
        -5,
        0
      ],
      "F": [
        8,
        0
      ],
      "Z": [
        15,
        0
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "H",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -10,
            0
          ],
          [
            -10,
            5
          ],
          [
            4,
            5
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -5,
            0
          ],
          [
            -5,
            10
          ],
          [
            6,
            10
          ]
        ],
        "arrow": true
      }
    ]
  },
  "45": {
    "id": "45",
    "num_id": 45,
    "key": "45",
    "name": "Empty Vertical Switch",
    "play_name": "Empty Vertical Switch",
    "card_title": "Vertical Switch",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 365 Switch Vertical",
    "description": "Empty Vertical Switch (EMPTY) \u2014 Empty Spread - 365 Switch Vertical",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        8,
        0
      ],
      "F": [
        15,
        0
      ],
      "Z": [
        15,
        -1
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "F",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            15,
            0
          ],
          [
            10,
            6
          ],
          [
            8,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            12,
            6
          ],
          [
            15,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "empty_vertical_switch": {
    "id": "45",
    "num_id": 45,
    "key": "45",
    "name": "Empty Vertical Switch",
    "play_name": "Empty Vertical Switch",
    "card_title": "Vertical Switch",
    "formation": "EMPTY",
    "play_type": "DEEP PASS",
    "category": "DEEP",
    "card_category": "PASS",
    "walsh_call": "Empty Spread - 365 Switch Vertical",
    "description": "Empty Vertical Switch (EMPTY) \u2014 Empty Spread - 365 Switch Vertical",
    "alignments": {
      "OL": [
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ]
      ],
      "X": [
        -15,
        0
      ],
      "H": [
        -8,
        0
      ],
      "Y": [
        8,
        0
      ],
      "F": [
        15,
        0
      ],
      "Z": [
        15,
        -1
      ],
      "QB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "F",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            15,
            0
          ],
          [
            10,
            6
          ],
          [
            8,
            20
          ]
        ],
        "arrow": true
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            12,
            6
          ],
          [
            15,
            20
          ]
        ],
        "arrow": true
      }
    ]
  },
  "46": {
    "id": "46",
    "num_id": 46,
    "key": "46",
    "name": "Goal Line QB Sneak",
    "play_name": "Goal Line QB Sneak",
    "card_title": "QB Sneak",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Goal Line Heavy - QB Sneak",
    "description": "Goal Line QB Sneak (GOAL LINE) \u2014 Goal Line Heavy - QB Sneak",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        -8,
        0
      ],
      "TE2": [
        8,
        0
      ],
      "QB": [
        0,
        -1
      ],
      "FB": [
        0,
        -3
      ],
      "HB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -1
          ],
          [
            0,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_qb_sneak": {
    "id": "46",
    "num_id": 46,
    "key": "46",
    "name": "Goal Line QB Sneak",
    "play_name": "Goal Line QB Sneak",
    "card_title": "QB Sneak",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Goal Line Heavy - QB Sneak",
    "description": "Goal Line QB Sneak (GOAL LINE) \u2014 Goal Line Heavy - QB Sneak",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        -8,
        0
      ],
      "TE2": [
        8,
        0
      ],
      "QB": [
        0,
        -1
      ],
      "FB": [
        0,
        -3
      ],
      "HB": [
        0,
        -5
      ]
    },
    "routes": [
      {
        "player": "QB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -1
          ],
          [
            0,
            2
          ]
        ],
        "arrow": true
      }
    ]
  },
  "47": {
    "id": "47",
    "num_id": 47,
    "key": "47",
    "name": "Goal Line HB Pitch Sweep",
    "play_name": "Goal Line HB Pitch Sweep",
    "card_title": "Pitch Sweep",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Goal Line Jumbo - 28 Pitch Sweep",
    "description": "Goal Line HB Pitch Sweep (GOAL LINE) \u2014 Goal Line Jumbo - 28 Pitch Sweep",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "TE2": [
        10,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        2,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            6,
            -3
          ],
          [
            11,
            2
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            2,
            -4
          ],
          [
            9,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "goal_line_hb_pitch_sweep": {
    "id": "47",
    "num_id": 47,
    "key": "47",
    "name": "Goal Line HB Pitch Sweep",
    "play_name": "Goal Line HB Pitch Sweep",
    "card_title": "Pitch Sweep",
    "formation": "GOAL LINE",
    "play_type": "RUN",
    "category": "RUN",
    "card_category": "RUN",
    "walsh_call": "Goal Line Jumbo - 28 Pitch Sweep",
    "description": "Goal Line HB Pitch Sweep (GOAL LINE) \u2014 Goal Line Jumbo - 28 Pitch Sweep",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "TE2": [
        10,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        2,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "HB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -6
          ],
          [
            6,
            -3
          ],
          [
            11,
            2
          ]
        ],
        "arrow": true
      },
      {
        "player": "FB",
        "type": "BLOCK",
        "color": "WHITE",
        "waypoints": [
          [
            2,
            -4
          ],
          [
            9,
            1
          ]
        ],
        "arrow": false
      }
    ]
  },
  "48": {
    "id": "48",
    "num_id": 48,
    "key": "48",
    "name": "Goal Line TE Corner Pop",
    "play_name": "Goal Line TE Corner Pop",
    "card_title": "TE Corner Pop",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Right - TE Corner Pop",
    "description": "Goal Line TE Corner Pop (GOAL LINE) \u2014 Goal Line Right - TE Corner Pop",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            8,
            4
          ],
          [
            13,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_te_corner_pop": {
    "id": "48",
    "num_id": 48,
    "key": "48",
    "name": "Goal Line TE Corner Pop",
    "play_name": "Goal Line TE Corner Pop",
    "card_title": "TE Corner Pop",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Right - TE Corner Pop",
    "description": "Goal Line TE Corner Pop (GOAL LINE) \u2014 Goal Line Right - TE Corner Pop",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            8,
            4
          ],
          [
            13,
            8
          ]
        ],
        "arrow": true
      }
    ]
  },
  "49": {
    "id": "49",
    "num_id": 49,
    "key": "49",
    "name": "Goal Line FB Option Pass",
    "play_name": "Goal Line FB Option Pass",
    "card_title": "FB Option Pass",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Heavy - FB Option Pass",
    "description": "Goal Line FB Option Pass (GOAL LINE) \u2014 Goal Line Heavy - FB Option Pass",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            4,
            -3
          ],
          [
            7,
            -1
          ]
        ],
        "arrow": false
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            8,
            5
          ],
          [
            2,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_fb_option_pass": {
    "id": "49",
    "num_id": 49,
    "key": "49",
    "name": "Goal Line FB Option Pass",
    "play_name": "Goal Line FB Option Pass",
    "card_title": "FB Option Pass",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Heavy - FB Option Pass",
    "description": "Goal Line FB Option Pass (GOAL LINE) \u2014 Goal Line Heavy - FB Option Pass",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "Y": [
        8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "FB",
        "type": "RUN_PATH",
        "color": "GREEN",
        "waypoints": [
          [
            0,
            -4
          ],
          [
            4,
            -3
          ],
          [
            7,
            -1
          ]
        ],
        "arrow": false
      },
      {
        "player": "Y",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            8,
            0
          ],
          [
            8,
            5
          ],
          [
            2,
            5
          ]
        ],
        "arrow": true
      }
    ]
  },
  "50": {
    "id": "50",
    "num_id": 50,
    "key": "50",
    "name": "Goal Line Rub Slant",
    "play_name": "Goal Line Rub Slant",
    "card_title": "Rub Slant",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Left - Rub Slant",
    "description": "Goal Line Rub Slant (GOAL LINE) \u2014 Goal Line Left - Rub Slant",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "X": [
        -12,
        0
      ],
      "Z": [
        -8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -12,
            0
          ],
          [
            -12,
            3
          ],
          [
            -2,
            6
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -8,
            0
          ],
          [
            -11,
            4
          ],
          [
            -11,
            7
          ]
        ],
        "arrow": true
      }
    ]
  },
  "goal_line_rub_slant": {
    "id": "50",
    "num_id": 50,
    "key": "50",
    "name": "Goal Line Rub Slant",
    "play_name": "Goal Line Rub Slant",
    "card_title": "Rub Slant",
    "formation": "GOAL LINE",
    "play_type": "SHORT PASS",
    "category": "SHORT",
    "card_category": "PASS",
    "walsh_call": "Goal Line Left - Rub Slant",
    "description": "Goal Line Rub Slant (GOAL LINE) \u2014 Goal Line Left - Rub Slant",
    "alignments": {
      "OL": [
        [
          -6,
          0
        ],
        [
          -4,
          0
        ],
        [
          -2,
          0
        ],
        [
          0,
          0
        ],
        [
          2,
          0
        ],
        [
          4,
          0
        ],
        [
          6,
          0
        ]
      ],
      "X": [
        -12,
        0
      ],
      "Z": [
        -8,
        0
      ],
      "QB": [
        0,
        -2
      ],
      "FB": [
        0,
        -4
      ],
      "HB": [
        0,
        -6
      ]
    },
    "routes": [
      {
        "player": "X",
        "type": "ROUTE",
        "color": "YELLOW",
        "waypoints": [
          [
            -12,
            0
          ],
          [
            -12,
            3
          ],
          [
            -2,
            6
          ]
        ],
        "arrow": true
      },
      {
        "player": "Z",
        "type": "ROUTE",
        "color": "ORANGE",
        "waypoints": [
          [
            -8,
            0
          ],
          [
            -11,
            4
          ],
          [
            -11,
            7
          ]
        ],
        "arrow": true
      }
    ]
  }
};

// Populate ari_01 through ari_50 catalog aliases for O(1) route lookups
for (let i = 1; i <= 50; i++) {
  const ariKey = `ari_${i.toString().padStart(2, '0')}`;
  if (_EMBEDDED_PLAYBOOK_FALLBACK[i.toString()] && !_EMBEDDED_PLAYBOOK_FALLBACK[ariKey]) {
    _EMBEDDED_PLAYBOOK_FALLBACK[ariKey] = _EMBEDDED_PLAYBOOK_FALLBACK[i.toString()];
  }
}

// Shared catalog is the source of truth; embedded object above is only the
// offline/fetch-failure fallback (top-level await blocks this module's
// consumers until the real catalog resolves or the fallback kicks in).
export let PLAYBOOK = _EMBEDDED_PLAYBOOK_FALLBACK;
try {
  const res = await fetch('/shared/playbook.json');
  if (res.ok) {
    PLAYBOOK = await res.json();
    console.log(`[Playbook3D] Loaded ${Object.keys(PLAYBOOK).length} plays from shared/playbook.json`);
  } else {
    console.warn('[Playbook3D] shared/playbook.json fetch failed, using embedded fallback catalog.');
  }
} catch (err) {
  console.warn('[Playbook3D] shared/playbook.json unreachable, using embedded fallback catalog.', err);
}

// playbookReady — always a resolved Promise because top-level await above
// guarantees PLAYBOOK is populated before any importer's .then() can run.
export const playbookReady = Promise.resolve();

