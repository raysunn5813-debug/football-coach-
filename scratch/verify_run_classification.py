"""Verify run play classification logic from the technical report."""
import json
from pathlib import Path

TOKENS = ["RUN", "DIVE", "SWEEP", "PITCH", "COUNTER", "ZONE"]
ROOT = Path(__file__).resolve().parents[1]
catalog = json.load(open(ROOT / "shared" / "playbook.json", encoding="utf-8"))
plays = list(catalog.values())


def keyword_match(s: str) -> bool:
    s = str(s).upper()
    return any(tok in s for tok in TOKENS)


def is_run_schema(p: dict) -> bool:
    return p.get("play_type") == "RUN" or p.get("category") == "RUN"


runs = [p for p in plays if is_run_schema(p)]
passes = [p for p in plays if not is_run_schema(p)]

run_hit_name = [p for p in runs if keyword_match(p.get("name", ""))]
run_miss_name = [p for p in runs if not keyword_match(p.get("name", ""))]
run_hit_key = [p for p in runs if keyword_match(p.get("key", p.get("id", "")))]
run_miss_key = [p for p in runs if not keyword_match(p.get("key", p.get("id", "")))]
pass_false_pos = [p for p in passes if keyword_match(p.get("name", ""))]

# Pulling plays in catalog
pull_plays = []
for p in runs:
    routes = p.get("routes", [])
    pullers = [r for r in routes if r.get("type") == "PULL"]
    if pullers:
        pull_plays.append((p.get("name"), [r.get("player") for r in pullers]))

print("=== PLAYBOOK STATS ===")
print(f"Total plays: {len(plays)}")
print(f"Run plays (schema): {len(runs)}")
print(f"Pass/other plays: {len(passes)}")
print()
print("=== Issue A: keyword on play NAME (report claim) ===")
pct_miss = 100 * len(run_miss_name) / len(runs) if runs else 0
print(f"Run matched by name: {len(run_hit_name)}/{len(runs)} ({100 - pct_miss:.1f}%)")
print(f"Run MISSED by name:  {len(run_miss_name)}/{len(runs)} ({pct_miss:.1f}%)")
print("Missed examples:", [p.get("name") for p in run_miss_name[:12]])
print("Matched examples:", [p.get("name") for p in run_hit_name[:12]])
print()
print("=== WORSE: frontend sends play KEY on SNAP, not name ===")
print(f"Run matched by key/id: {len(run_hit_key)}/{len(runs)}")
print(f"Run MISSED by key/id:  {len(run_miss_key)}/{len(runs)}")
print("Sample keys sent on SNAP:", [p.get("key", p.get("id")) for p in runs[:8]])
print()
print("=== False positives (pass plays matching keywords in name) ===")
print(f"Count: {len(pass_false_pos)}")
for p in pass_false_pos:
    print(f"  - {p.get('name')} ({p.get('play_type')})")
print()
print(f"=== Pulling blocker plays: {len(pull_plays)} ===")
for name, pullers in pull_plays[:8]:
    print(f"  - {name}: {pullers}")
