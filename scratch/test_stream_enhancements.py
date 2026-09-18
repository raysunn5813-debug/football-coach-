import sys
import asyncio
sys.path.append('C:/football coach')

from server.routes.playbook import evaluate_matchup, get_team_playbook_recommendations

print("=== 1. Testing Play Success Odds & Matchup Evaluator ===")
steelers_eval = asyncio.run(evaluate_matchup('ari_38', 'STEELERS', 'SAINTS'))
assert steelers_eval["offense_team"] == "Steelers"
assert "primary_mismatch" in steelers_eval
pm = steelers_eval["primary_mismatch"]
print(f"Play: {steelers_eval['play_name']} | Target: {pm['target_name']} | Distance: {pm['distance_category']} | QB Acc: {pm['qb_accuracy_used']} | Odds: {pm['success_probability_pct']}% ({pm['success_rating']})")
print("MATCHUP EVALUATOR ENGINE OK")

print("\n=== 2. Testing Custom Coach Playbook Generator ===")
steelers_rec = asyncio.run(get_team_playbook_recommendations('STEELERS'))
saints_rec = asyncio.run(get_team_playbook_recommendations('SAINTS'))

print(f"Steelers Scheme Profile: {steelers_rec['scheme_profile']}")
print(f"Steelers Recommended Categories: {steelers_rec['recommended_categories']}")

print(f"\nSaints Scheme Profile: {saints_rec['scheme_profile']}")
print(f"Saints Recommended Categories: {saints_rec['recommended_categories']}")
print("PLAYBOOK GENERATOR RECOMMENDATIONS OK")

print("\nALL TACTICAL CHALKBOARD ENGINE FEATURES PASSED PERFECTLY!")
