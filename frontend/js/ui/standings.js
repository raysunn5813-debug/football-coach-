import { REAL_NFL_LEAGUE } from '../engine/leagueData.js';

export function renderStandings() {
  const afcContainer = document.querySelector('#afc-divisions');
  const nfcContainer = document.querySelector('#nfc-divisions');
  
  if (!afcContainer || !nfcContainer) return;

  const divisions = REAL_NFL_LEAGUE.divisions;

  function buildDivisionHTML(divName, teamsArr, colorClass) {
      // Sort teams in this division by wins descending
      teamsArr.sort((a, b) => b.wins - a.wins);

      let html = `<div class="division-block ${colorClass}">
                    <div class="div-header">${divName.toUpperCase()}</div>
                    <div class="div-teams">`;
      
      teamsArr.forEach(team => {
          const isUser = team.abbrev === "NO";
          const userClass = isUser ? "user-team-highlight" : "";
          html += `
              <div class="team-row ${userClass}">
                  <span class="team-abbr">${team.abbrev}</span>
                  <span class="team-record">${team.wins}-${team.losses}</span>
              </div>
          `;
      });
      html += `</div></div>`;
      return html;
  }

  // Populate AFC
  afcContainer.innerHTML = 
      buildDivisionHTML('AFC East', divisions.AFCEast, 'afc-east-color') +
      buildDivisionHTML('AFC North', divisions.AFCNorth, 'afc-north-color') +
      buildDivisionHTML('AFC South', divisions.AFCSouth, 'afc-south-color') +
      buildDivisionHTML('AFC West', divisions.AFCWest, 'afc-west-color');

  // Populate NFC
  nfcContainer.innerHTML = 
      buildDivisionHTML('NFC East', divisions.NFCEast, 'nfc-east-color') +
      buildDivisionHTML('NFC North', divisions.NFCNorth, 'nfc-north-color') +
      buildDivisionHTML('NFC South', divisions.NFCSouth, 'nfc-south-color') +
      buildDivisionHTML('NFC West', divisions.NFCWest, 'nfc-west-color');
}
