import { REAL_NFL_LEAGUE } from '../engine/leagueData.js';

export function renderStatLeaders() {
  const container = document.getElementById('stats-grid');
  if (!container) return;

  const data = REAL_NFL_LEAGUE.statLeaders;

  function buildStatCard(title, headers, rowsHTML) {
    return `
      <div class="stat-card">
        <div class="stat-card-header">${title}</div>
        <table class="stat-table">
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>
    `;
  }

  let html = '';

  // Pass Yards
  const passHTML = data.passYards.map(p => `
    <tr>
      <td><div class="player-avatar">${p.avatar}</div></td>
      <td>
        <div class="stat-team-abbrev">${p.team}</div>
        <div class="stat-player-name">${p.name}</div>
      </td>
      <td>${p.compPct}</td>
      <td class="highlight-stat">${p.yards}</td>
      <td>${p.td}</td>
    </tr>
  `).join('');
  html += buildStatCard('PASS YARDS', ['', 'PLAYER', 'COMP%', 'YDS', 'TD'], passHTML);

  // Rush Yards
  const rushHTML = data.rushYards.map(p => `
    <tr>
      <td><div class="player-avatar">${p.avatar}</div></td>
      <td>
        <div class="stat-team-abbrev">${p.team}</div>
        <div class="stat-player-name">${p.name}</div>
      </td>
      <td>${p.att}</td>
      <td class="highlight-stat">${p.yards}</td>
      <td>${p.td}</td>
    </tr>
  `).join('');
  html += buildStatCard('RUSH YARDS', ['', 'PLAYER', 'ATT', 'YDS', 'TD'], rushHTML);

  // Rec Yards
  const recHTML = data.recYards.map(p => `
    <tr>
      <td><div class="player-avatar">${p.avatar}</div></td>
      <td>
        <div class="stat-team-abbrev">${p.team}</div>
        <div class="stat-player-name">${p.name}</div>
      </td>
      <td>${p.rec}</td>
      <td class="highlight-stat">${p.yards}</td>
      <td>${p.td}</td>
    </tr>
  `).join('');
  html += buildStatCard('RECEIVING YARDS', ['', 'PLAYER', 'REC', 'YDS', 'TD'], recHTML);

  // Sacks
  const sacksHTML = data.sacks.map(p => `
    <tr>
      <td><div class="player-avatar">${p.avatar}</div></td>
      <td>
        <div class="stat-team-abbrev">${p.team}</div>
        <div class="stat-player-name">${p.name}</div>
      </td>
      <td>${p.pos}</td>
      <td class="highlight-stat">${p.sacks}</td>
      <td>${p.tfl}</td>
    </tr>
  `).join('');
  html += buildStatCard('SACKS', ['', 'PLAYER', 'POS', 'SACKS', 'TFL'], sacksHTML);

  // Interceptions
  const intHTML = data.interceptions.map(p => `
    <tr>
      <td><div class="player-avatar">${p.avatar}</div></td>
      <td>
        <div class="stat-team-abbrev">${p.team}</div>
        <div class="stat-player-name">${p.name}</div>
      </td>
      <td>${p.pos}</td>
      <td class="highlight-stat">${p.int}</td>
      <td>${p.defl}</td>
    </tr>
  `).join('');
  html += buildStatCard('INTERCEPTIONS', ['', 'PLAYER', 'POS', 'INT', 'DEFL'], intHTML);

  // Tackles
  const takHTML = data.tackles.map(p => `
    <tr>
      <td><div class="player-avatar">${p.avatar}</div></td>
      <td>
        <div class="stat-team-abbrev">${p.team}</div>
        <div class="stat-player-name">${p.name}</div>
      </td>
      <td>${p.pos}</td>
      <td class="highlight-stat">${p.tackles}</td>
      <td>${p.solo}</td>
    </tr>
  `).join('');
  html += buildStatCard('TACKLES', ['', 'PLAYER', 'POS', 'TAK', 'SOLO'], takHTML);

  container.innerHTML = html;
}
