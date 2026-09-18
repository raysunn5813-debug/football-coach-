export function renderFatigueGrowth() {
  const container = document.querySelector('#roster-growth-list');
  if (!container) return;

  const samplePlayers = [
    { name: "Derek Carr", pos: "QB", fatigue: 15, growth: "+1 Pass Acc" },
    { name: "Alvin Kamara", pos: "RB", fatigue: 28, growth: "+1 Speed" },
    { name: "Chris Olave", pos: "WR", fatigue: 12, growth: "+1 Catch" },
    { name: "Demario Davis", pos: "LB", fatigue: 22, growth: "+1 Tackle" },
    { name: "Tyrann Mathieu", pos: "S", fatigue: 18, growth: "+1 Awareness" }
  ];

  container.innerHTML = `
    <div class="fatigue-list space-y-3 p-3">
      ${samplePlayers.map(p => `
        <div class="flex items-center justify-between p-2 bg-slate-900 rounded border border-gray-800" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:10px; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:var(--radius-md);">
          <div>
            <div style="font-weight:bold; color:#fff; font-size:14px;">${p.name} <span style="font-size:12px; color:var(--text-muted);">(${p.pos})</span></div>
            <div style="font-size:12px; color:var(--accent);">Weekly Target: ${p.growth}</div>
          </div>
          <div style="width: 35%; text-align: right;">
            <span style="font-size:12px; font-weight:700; color: ${p.fatigue > 25 ? '#facc15' : '#4ade80'};">Fatigue: ${p.fatigue}%</span>
            <div style="width: 100%; background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; margin-top: 4px;">
              <div style="background: ${p.fatigue > 25 ? '#eab308' : '#22c55e'}; height: 6px; border-radius: 3px; width: ${p.fatigue}%"></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
