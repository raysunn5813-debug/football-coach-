"""
evaluate_season.py
Runs season simulations, compares against Vegas lines, and outputs accuracy reports.
"""
import os
import pickle
import re
import statistics as stat
from math import sqrt
from os import listdir
from os.path import isfile, join

def add_to_running_dict_df(running_dict, game):
    if len(running_dict) == 0:
        for key in game:
            running_dict[key] = []
    for key, val in game.items():
        running_dict[key].append(val)

def extract_info(H_minus_A_history, H_plus_A_history, odds_row, home_spread_open, home_spread_close, percentile_break=.1):
    over_under_better_open = 1 if stat.median(H_plus_A_history) > odds_row.get('over_under_open', 45) else 0
    over_under_better_close = 1 if stat.median(H_plus_A_history) > odds_row.get('over_under_close', 45) else 0
    WL_better_than_vegas = 1
    better_ATS_open = 1 if stat.median(H_minus_A_history) > home_spread_open else 0
    better_ATS_close = 1 if stat.median(H_minus_A_history) > home_spread_close else 0
    AST_open_dif = abs(stat.median(H_minus_A_history) - home_spread_open)
    AST_close_dif = abs(stat.median(H_minus_A_history) - home_spread_close)
    OU_open_better_dif = abs(stat.median(H_plus_A_history) - odds_row.get('over_under_open', 45))
    OU_close_better_dif = abs(stat.median(H_plus_A_history) - odds_row.get('over_under_close', 45))
    final_total = stat.median(H_plus_A_history)
    return over_under_better_open, over_under_better_close, WL_better_than_vegas, better_ATS_open, better_ATS_close, AST_open_dif, AST_close_dif, OU_open_better_dif, OU_close_better_dif, final_total

def get_predicted_win_loss(H_minus_A_history, ml, home_spread_close, final_real_h_minus_a):
    n_wins = sum(1 for x in H_minus_A_history if x > 0)
    p_win = n_wins / len(H_minus_A_history) if H_minus_A_history else 0.5
    return 1 if p_win > 0.5 else 0, abs(p_win - 0.5)

def load_odds_history_df(year=2019):
    pkl_file = f"historical_odds/compiled{year}.pkl"
    if isfile(pkl_file):
        with open(pkl_file, 'rb') as f:
            return pickle.load(f)
    import pandas as pd
    return pd.DataFrame()

def get_all_file_paths(base_path='results_save'):
    if not os.path.exists(base_path):
        os.makedirs(base_path, exist_ok=True)
    return [join(base_path, f) for f in listdir(base_path) if isfile(join(base_path, f))]

def load_file_for_oddsrow(odds_row, excl_vs_before=True, n_sims=258):
    excl_str = '_excl' if excl_vs_before else ''
    H_team = odds_row['home']
    A_team = odds_row['away']
    fp_ = os.path.join("results_save", f"yr.{odds_row['year']}_wk.{odds_row['week']}{excl_str}_H.{H_team}_A.{A_team}_n.{n_sims}_results.pkl")
    with open(fp_, 'rb') as file:
        final_data = pickle.load(file)
    return final_data

def apply_home_team_advantage(odds_row, home_mod, excl_vs_before=False, n_sims=258, percentile_break=.1):
    excl_str = '_excl' if excl_vs_before else ''
    H_team = odds_row['home']
    A_team = odds_row['away']
    
    fp_ = os.path.join("results_save", f"yr.{odds_row['year']}_wk.{odds_row['week']}{excl_str}_H.{H_team}_A.{A_team}_n.{n_sims}_results.pkl")
    if not isfile(fp_):
        return
        
    with open(fp_, 'rb') as file:
        final_data = pickle.load(file)
        
    H_minus_A_history = final_data.get('H_minus_A_history', [])
    H_plus_A_history = final_data.get('H_plus_A_history', [])

    H_minus_A_history = [x + home_mod for x in H_minus_A_history]

    if odds_row.get('favorite') == odds_row.get('home'):
        home_spread_open = odds_row.get('spread_open', 0)
        home_spread_close = odds_row.get('spread_close', 0)
    else:
        home_spread_open = -1 * odds_row.get('spread_open', 0)
        home_spread_close = -1 * odds_row.get('spread_close', 0)

    over_under_better_open, over_under_better_close, WL_better_than_vegas, better_ATS_open, better_ATS_close, AST_open_dif, AST_close_dif, OU_open_better_dif, OU_close_better_dif, final_total = \
        extract_info(H_minus_A_history, H_plus_A_history, odds_row, home_spread_open, home_spread_close, percentile_break)

    if odds_row.get('final_real_home_minus_away', 0) > 0:
        H_win = 1
    elif odds_row.get('final_real_home_minus_away', 0) < 0:
        H_win = 0
    else:
        H_win = .5

    WL_better_than_vegas, p_dif_temp = get_predicted_win_loss(H_minus_A_history, odds_row.get('ML', 100), home_spread_close, odds_row.get('final_real_home_minus_away', 0))

    final_data = {
        'home': H_team, 'away': A_team,
        'home_spread_open': home_spread_open, 'home_spread_close': home_spread_close,
        'pred_spread_median': stat.median(H_minus_A_history) if H_minus_A_history else 0,
        'pred_spread_avg': stat.mean(H_minus_A_history) if H_minus_A_history else 0,
        'over_under_better_open': over_under_better_open, 'over_under_better_close': over_under_better_close,
        'WL_better_vegas': WL_better_than_vegas, 'better_ATS_open': better_ATS_open,
        'better_ATS_close': better_ATS_close, 'n_sims': n_sims, 'excl_vs_before': excl_vs_before,
        'True_H_win': H_win, 'True_H_minus_A': odds_row.get('final_real_home_minus_away', 0), 'True_total_score': final_total,
        'AST_open_dif': AST_open_dif, 'AST_close_dif': AST_close_dif,
        'OU_open_better_dif': OU_open_better_dif, 'OU_close_better_dif': OU_close_better_dif, 
        'H_minus_A_history': H_minus_A_history, 'H_plus_A_history': H_plus_A_history
    }

    fp_out = os.path.join("results_save", f"yr.{odds_row['year']}_wk.{odds_row['week']}_hm.{home_mod}{excl_str}_H.{H_team}_A.{A_team}_n.{n_sims}_results.pkl")
    with open(fp_out, 'wb') as file:
        pickle.dump(final_data, file)

def update_home_mod(home_mod=2):
    print(f'Updating data. Home_mod = {home_mod}')
    YEAR = 2019
    odds_data_df = load_odds_history_df(YEAR)
    for idx, row in odds_data_df.iterrows():
        apply_home_team_advantage(row, home_mod, n_sims=999)

def sim_season(year=2018, n_sims=258):
    YEAR = year
    odds_data_df = load_odds_history_df(YEAR)
    team_records = {}
    
    for idx, odds_row in odds_data_df.iterrows():
        H_team = odds_row['home']
        A_team = odds_row['away']
        
        for team in [H_team, A_team]:
            if team not in team_records:
                team_records[team] = 0
                
        try:
            week_data = load_file_for_oddsrow(odds_row, excl_vs_before=True, n_sims=n_sims)
        except Exception:
            continue
            
        # FIXED: Robust win calculation handling both pre-computed probabilities and raw histories
        if 'p_home_win' in week_data and 'p_away_win' in week_data:
            tot = week_data['p_home_win'] + week_data['p_away_win']
            p_home_win = week_data['p_home_win'] / tot if tot > 0 else 0.5
        elif 'H_minus_A_history' in week_data:
            n_home_wins = sum(1 for x in week_data['H_minus_A_history'] if x > 0)
            n_home_losses = sum(1 for x in week_data['H_minus_A_history'] if x < 0)
            total_decisive = n_home_wins + n_home_losses
            p_home_win = (n_home_wins / total_decisive) if total_decisive > 0 else 0.5
        else:
            p_home_win = 0.5

        team_records[H_team] += p_home_win
        team_records[A_team] += 1 - p_home_win

    if not team_records:
        print("No simulation files found in results_save/ for testing.")
        return

    sorted_records = {k: v for k, v in sorted(team_records.items(), key=lambda item: item[1])}
    
    team_actual_records_2019 = {
        'CIN': 2, 'MIA': 5, 'WAS': 3, 'NYG': 4, 'CAR': 5, 'JAX': 6, 'NYJ': 7, 'DET': 3, 'ARI': 5,
        'IND': 7, 'ATL': 7, 'OAK': 7, 'CHI': 8, 'DEN': 7, 'CLE': 6, 'HOU': 10, 'SEA': 11, 'PIT': 8,
        'PHI': 9, 'GB': 13, 'TEN': 9, 'BUF': 10, 'LAC': 5, 'LA': 9, 'MIN': 10, 'TB': 7, 'DAL': 8,
        'NO': 13, 'BAL': 14, 'KC': 12, 'SF': 13, 'NE': 12
    }

    team_actual_records = team_actual_records_2019
    difs = []
    
    for i, team in enumerate(sorted_records):
        dif = abs(team_actual_records.get(team, 0) - sorted_records[team])
        print(f"{32-i}\t{team}\t{round(sorted_records[team], 2)}\t{team_actual_records.get(team, 0)}\t, dif:\t{round(-dif, 2)}")
        difs.append(dif)
        
    if difs:
        print('Mean dif:', round(stat.mean(difs), 3))
        print('RMSE:', sqrt(stat.mean([dif * dif for dif in difs])))

def create_max_num_fp():
    file_paths = get_all_file_paths()
    fp_inits = {}
    fp_n = {}
    
    for fp in file_paths:
        if '_n.' not in fp:
            continue
            
        fp_initial = fp.split('_n.')[0]
        
        # FIXED: Regex extraction prevents truncating numbers or pulling string artifacts
        match = re.search(r'_n\.(\d+)_', fp)
        if not match:
            continue
            
        num_runs = int(match.group(1))
        
        if fp_initial not in fp_inits:
            with open(fp, 'rb') as file:
                data = pickle.load(file)
            fp_inits[fp_initial] = data
            fp_n[fp_initial] = num_runs

        elif num_runs > fp_n[fp_initial]:
            with open(fp, 'rb') as file:
                data = pickle.load(file)
            fp_inits[fp_initial] = data
            fp_n[fp_initial] = num_runs

    for fp_initial in fp_inits:
        new_fn = f"{fp_initial}_n.999_results.pkl"
        with open(new_fn, 'wb') as file:
            pickle.dump(fp_inits[fp_initial], file)

def analyze_fp():
    file_paths = get_all_file_paths()
    running_dict = {}
    for fp in file_paths:
        skip = True
        for wk in range(1, 11):
           if f"wk.{wk}_" in fp:
                skip = False

        if '2020' in fp or 'excl' in fp or 'n.999' not in fp or 'hm' in fp or 'wk.17' in fp:
            continue
            
        with open(fp, 'rb') as file:
            results = pickle.load(file)
            
        add_to_running_dict_df(running_dict, results)

    for key, list_ in running_dict.items():
        try:
            print(f"{key} : Average = {round(stat.mean(list_)*100,1)} , median = {round(stat.median(list_),3)} , n = {len(list_)}")
        except Exception:
            pass

if __name__ == '__main__':
    sim_season(year=2019, n_sims=999)
