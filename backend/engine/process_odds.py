"""
process_odds.py
Processes historical Vegas odds from Excel sheets into structured DataFrames.
"""
import os
import sys
import pickle
from pathlib import Path
import pandas as pd

try:
    from backend.engine.DATE_NUMBER_TO_WEEK_NUMBER_data import DATE_NUMBER_TO_WEEK_NUMBER_2019, DATE_NUMBER_TO_WEEK_NUMBER_2018
except ImportError:
    from DATE_NUMBER_TO_WEEK_NUMBER_data import DATE_NUMBER_TO_WEEK_NUMBER_2019, DATE_NUMBER_TO_WEEK_NUMBER_2018

def check_for_pk(V_or_H_row):
    if V_or_H_row['Close'] == 'pk' and V_or_H_row['Open'] == 'pk':
        print('ERROR - Both Open and Close == pk')
    elif V_or_H_row['Close'] == 'pk':
        V_or_H_row['Close'] = V_or_H_row['Open']
    elif V_or_H_row['Open'] == 'pk':
        V_or_H_row['Open'] = V_or_H_row['Close']

def add_to_running_dict_df(running_dict, game):
    if len(running_dict) == 0:
        for key in game:
            running_dict[key] = []
    for key, val in game.items():
        running_dict[key].append(val)

NAME_TO_SHORTHAND = {
    'GreenBay': 'GB', 'Chicago': 'CHI', 'Atlanta': 'ATL', 'Minnesota': 'MIN',
    'Cleveland': 'CLE', 'SanFrancisco': 'SF', 'Philadelphia': 'PHI', 'Pittsburgh': 'PIT',
    'Indianapolis': 'IND', 'Buffalo': 'BUF', 'Baltimore': 'BAL', 'Jacksonville': 'JAX',
    'NYGiants': 'NYG', 'TampaBay': 'TB', 'NewOrleans': 'NO', 'Houston': 'HOU',
    'NewEngland': 'NE', 'Tennessee': 'TEN', 'Miami': 'MIA', 'KansasCity': 'KC',
    'LAChargers': 'LAC', 'Seattle': 'SEA', 'Denver': 'DEN', 'Dallas': 'DAL',
    'Carolina': 'CAR', 'Washington': 'WAS', 'Arizona': 'ARI', 'NYJets': 'NYJ',
    'Detroit': 'DET', 'Oakland': 'OAK', 'LARams': 'LA', 'Cincinnati': 'CIN'
}

YEAR = 2019
DATE_NUMBER_TO_WEEK_NUMBER = DATE_NUMBER_TO_WEEK_NUMBER_2019

def process_odds_data(year=2019):
    data_dir = Path("historical_odds")
    data_dir.mkdir(parents=True, exist_ok=True)

    data_path = data_dir / f"{year}_w_17.xlsx" if year == 2019 else data_dir / f"{year}.xlsx"

    if not data_path.exists():
        print(f"ERROR: Could not find {data_path}. Please ensure the file exists.")
        return None

    df = pd.read_excel(data_path)
    running_dict = {}
    
    for idx in range(0, len(df), 2):
        V_row = df.loc[idx]
        H_row = df.loc[idx + 1]
        
        if V_row['Team'] not in NAME_TO_SHORTHAND or H_row['Team'] not in NAME_TO_SHORTHAND:
            continue
            
        V_team = NAME_TO_SHORTHAND[V_row['Team']]
        H_team = NAME_TO_SHORTHAND[H_row['Team']]
        
        for V_or_H_row in [V_row, H_row]:
            check_for_pk(V_or_H_row)

        if V_row['Close'] < H_row['Close']:
            spread_open = V_row['Open']
            spread_close = V_row['Close']
            favorite = V_team
            over_under_open = H_row['Open']
            over_under_close = H_row['Close']
        else:
            spread_open = H_row['Open']
            spread_close = H_row['Close']
            favorite = H_team
            over_under_open = V_row['Open']
            over_under_close = V_row['Close']

        ml = (abs(V_row['ML']) + abs(H_row['ML'])) / 2

        date_key = str(int(V_row['Date']))
        if date_key not in DATE_NUMBER_TO_WEEK_NUMBER:
            continue
        week = DATE_NUMBER_TO_WEEK_NUMBER[date_key]

        game = {
            'home': H_team, 'away': V_team, 'favorite': favorite, 
            'spread_open': spread_open, 'spread_close': spread_close,
            'over_under_open': over_under_open, 'over_under_close': over_under_close, 
            'ML': ml, 'year': year, 'week': week,
            'final_real_home_score': H_row['Final'], 
            'final_real_away_score': V_row['Final'],
            'final_real_home_minus_away': H_row['Final'] - V_row['Final']
        }
        add_to_running_dict_df(running_dict, game)

    df_output = pd.DataFrame.from_dict(running_dict)
    print('DF Output generated successfully.')
    
    out_file = data_dir / f"compiled{year}.pkl"
    with open(out_file, 'wb') as file:
        pickle.dump(df_output, file)
    return df_output

if __name__ == "__main__":
    process_odds_data(YEAR)
