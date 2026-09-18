from backend.routes.playbook import PLAY_DATABASE

print(f"✅ Backend playbook loaded: {len(PLAY_DATABASE)} plays")
if PLAY_DATABASE:
    print(f"🏈 First play: {PLAY_DATABASE[0]['id']} - {PLAY_DATABASE[0]['play_name']}")
    print(f"🏈 Last play: {PLAY_DATABASE[-1]['id']} - {PLAY_DATABASE[-1]['play_name']}")
else:
    print("❌ PLAY_DATABASE is empty!")
