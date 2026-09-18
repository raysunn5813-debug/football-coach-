import { REAL_NFL_LEAGUE } from '../engine/leagueData.js';

function renderTableRows(containerId, players, isBench = false) {
  const container = document.querySelector(containerId);
  if (!container) return;
  
  container.innerHTML = players.map(player => `
    <tr class="roster-row ${isBench ? 'bench-row' : ''}">
      <td style="font-weight: bold; color: var(--text-highlight);">${player.name}</td>
      <td><span class="pos-badge ${player.pos}">${player.pos}</span></td>
      <td style="color: ${isBench ? '#fde047' : '#4ade80'};">${player.status}</td>
      <td style="color: var(--text-muted);">${player.style}</td>
      <td style="font-weight: bold; color: var(--warning);">${player.ovr}</td>
      <td>${player.spd}</td>
      <td>${player.acc}</td>
      <td>${player.cat}</td>
      <td>${player.pwr}</td>
      <td>${player.passAcc}</td>
      <td>${player.tak}</td>
      <td>${player.str}</td>
    </tr>
  `).join('');
}

export async function loadRosterFromBackend() {
  try {
    const response = await fetch('/api/teams/saints/roster');
    if (!response.ok) throw new Error('Failed to fetch roster');
    
    const data = await response.json();
    
    // Update budget in HUD
    const budgetEl = document.getElementById('budget-display');
    if (budgetEl) budgetEl.textContent = `$${data.budget.toLocaleString()}`;

    // Render Starters & Bench
    renderTableRows('#starters-table-body', data.starters, false);
    renderTableRows('#bench-table-body', data.bench, true);
  } catch (err) {
    console.warn("Backend offline. Fallback to cached data.", err);
    // Fallback to local memory if server is down
    const saints = REAL_NFL_LEAGUE.saints;
    renderTableRows('#starters-table-body', saints.starters, false);
    renderTableRows('#bench-table-body', saints.bench, true);
  }
}

export function renderTeamRoster() {
    loadRosterFromBackend();
}
