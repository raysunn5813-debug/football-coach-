"""
scratch/run_all_diagnostics.py
Master Diagnostic Suite: Executes all position group, play type, and special teams diagnostic scripts.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent

SCRIPTS = [
    ("SNAP & Play Classification Test", "test_snap_simulation.py"),
    ("Defense AI & Pursuit Test", "test_defense_simulation.py"),
    ("WR/TE Route & Catch Test", "test_receiver_simulation.py"),
    ("Quarterback Operations Test", "test_qb_simulation.py"),
    ("OL Blocking & Run Game Test", "test_oline_run_simulation.py"),
    ("Pass Rush & Blitz Test", "test_pass_rush_simulation.py"),
    ("Field Goal & XP Kicking Test", "test_kicking_simulation.py"),
    ("Punting & Punt Return Test", "test_punting_simulation.py"),
    ("Kickoff & Return Test", "test_kickoff_simulation.py"),
]

def run_suite():
    print("======================================================================")
    print("🏈 MASTER DIAGNOSTIC SUITE — GRIDIRON SIMULATION ENGINE")
    print("======================================================================\n")

    python_exe = sys.executable
    passed = 0
    failed = 0

    for name, filename in SCRIPTS:
        script_path = ROOT / filename
        print(f"▶️ Running [{name}] ({filename})...")
        res = subprocess.run([python_exe, str(script_path)], capture_output=True, text=True, encoding="utf-8")
        if res.returncode == 0:
            print(f"✅ PASSED: {name}")
            print(res.stdout)
            passed += 1
        else:
            print(f"❌ FAILED: {name}")
            print(res.stderr or res.stdout)
            failed += 1
        print("-" * 70)

    print("\n======================================================================")
    print(f"📊 SUMMARY: {passed} PASSED | {failed} FAILED | TOTAL: {len(SCRIPTS)}")
    print("======================================================================")

if __name__ == "__main__":
    run_suite()
