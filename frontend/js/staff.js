/**
 * frontend/js/staff.js
 * Renders the Coach's Office & Staff Management Screen.
 * Includes Head Coach ratings (Offense/Defense split), Full Staff Roster (8 roles), Candidate Marketplace, and Play-Calling Delegation options.
 */

export async function renderStaffMarketplace() {
  const currentStaffContainer = document.querySelector('#staff-grid');
  const coachMarketContainer = document.querySelector('#marketplace-list');

  let staffData = null;
  try {
    const res = await fetch('/api/staff');
    staffData = await res.json();
  } catch (e) {
    console.warn('Backend staff API offline, using fallback data.', e);
  }

  const staff = staffData?.current_staff || {
    "HEAD_COACH": { name: "Coach Marcus Vance", role: "Head Coach", offense_rating: 84, defense_rating: 52, overall: 81, specialty: "Offensive Architect", salary: 3200000 },
    "OFFENSIVE_COORD": { name: "Klint Kubiak", role: "Offensive Coordinator", offense_rating: 86, defense_rating: 45, overall: 84, specialty: "Spread & Motion Passing", salary: 1400000 },
    "DEFENSIVE_COORD": { name: "Rex Ryan", role: "Defensive Coordinator", offense_rating: 42, defense_rating: 88, overall: 85, specialty: "Aggressive 46 Blitz", salary: 1500000 },
    "SPECIAL_TEAMS": { name: "Dave Fipp", role: "Special Teams Coord.", overall: 79, specialty: "Kick Return & Hangtime", salary: 750000 },
    "CHIEF_SCOUT": { name: "Will McClay", role: "Chief Scout", scouting_rating: 91, overall: 90, specialty: "Draft Potential Evaluation", salary: 900000 },
    "TEAM_DOCTOR": { name: "Dr. James Andrews", role: "Team Doctor", medical_rating: 94, overall: 93, specialty: "+40% ACL & Soft Tissue Recovery", salary: 800000 },
    "SPORTS_PSYCH": { name: "Dr. Clete McLeod", role: "Sports Psychologist", morale_rating: 88, overall: 87, specialty: "+15% 4th Quarter Comeback Energy", salary: 650000 },
    "DATA_ANALYST": { name: "Ernie Adams", role: "Data Analyst", analytics_rating: 95, overall: 94, specialty: "Predictive Tendency Matrix", salary: 850000 }
  };

  const currentMode = staffData?.delegation?.mode || 'CALL_OFFENSE';

  if (currentStaffContainer) {
    let staffHtml = `
      <!-- Play-Calling Delegation Panel -->
      <div style="padding:14px; background:rgba(15,23,42,0.9); border-radius:10px; border:1px solid rgba(59,130,246,0.4); margin-bottom:16px;">
        <div style="font-family:'Orbitron',sans-serif; font-size:13px; font-weight:700; color:#38bdf8; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          🎮 GAMEDAY PLAY-CALLING DELEGATION
        </div>
        <div style="font-size:11px; color:#94a3b8; margin-bottom:12px;">Choose who calls plays during live matches (User vs AI Coordinator):</div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <label style="display:flex; align-items:center; gap:8px; padding:8px 10px; background:rgba(30,41,59,0.8); border:1px solid ${currentMode==='CALL_OFFENSE'?'#38bdf8':'rgba(255,255,255,0.08)'}; border-radius:6px; cursor:pointer;">
            <input type="radio" name="delegation_mode" value="CALL_OFFENSE" ${currentMode==='CALL_OFFENSE'?'checked':''} onchange="window.setStaffDelegation('CALL_OFFENSE')">
            <span style="font-size:11px; color:#fff; font-weight:600;">🏈 User Offense / AI Defense</span>
          </label>

          <label style="display:flex; align-items:center; gap:8px; padding:8px 10px; background:rgba(30,41,59,0.8); border:1px solid ${currentMode==='CALL_DEFENSE'?'#38bdf8':'rgba(255,255,255,0.08)'}; border-radius:6px; cursor:pointer;">
            <input type="radio" name="delegation_mode" value="CALL_DEFENSE" ${currentMode==='CALL_DEFENSE'?'checked':''} onchange="window.setStaffDelegation('CALL_DEFENSE')">
            <span style="font-size:11px; color:#fff; font-weight:600;">🛡️ User Defense / AI Offense</span>
          </label>

          <label style="display:flex; align-items:center; gap:8px; padding:8px 10px; background:rgba(30,41,59,0.8); border:1px solid ${currentMode==='CALL_BOTH'?'#38bdf8':'rgba(255,255,255,0.08)'}; border-radius:6px; cursor:pointer;">
            <input type="radio" name="delegation_mode" value="CALL_BOTH" ${currentMode==='CALL_BOTH'?'checked':''} onchange="window.setStaffDelegation('CALL_BOTH')">
            <span style="font-size:11px; color:#fff; font-weight:600;">🎮 User Calls Both Units</span>
          </label>

          <label style="display:flex; align-items:center; gap:8px; padding:8px 10px; background:rgba(30,41,59,0.8); border:1px solid ${currentMode==='DELEGATE_BOTH'?'#38bdf8':'rgba(255,255,255,0.08)'}; border-radius:6px; cursor:pointer;">
            <input type="radio" name="delegation_mode" value="DELEGATE_BOTH" ${currentMode==='DELEGATE_BOTH'?'checked':''} onchange="window.setStaffDelegation('DELEGATE_BOTH')">
            <span style="font-size:11px; color:#fff; font-weight:600;">👔 Delegate Both (Head Coach Oversight)</span>
          </label>
        </div>
      </div>

      <!-- 8-Role Staff Grid -->
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
    `;

    for (const [key, member] of Object.entries(staff)) {
      const offRating = member.offense_rating ? `<span style="color:#60a5fa; font-weight:700;">OFF: ${member.offense_rating}</span>` : '';
      const defRating = member.defense_rating ? `<span style="color:#f87171; font-weight:700;">DEF: ${member.defense_rating}</span>` : '';
      const ratingBadges = [offRating, defRating].filter(Boolean).join(' | ');

      staffHtml += `
        <div style="padding:12px; background:rgba(15,23,42,0.8); border-radius:8px; border:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; gap:4px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; color:#fff; font-size:13px;">${member.name}</span>
            <span style="background:#0284c7; color:#fff; font-size:10px; font-family:'Orbitron',sans-serif; padding:2px 6px; border-radius:4px; font-weight:700;">OVR ${member.overall || 80}</span>
          </div>
          <div style="font-size:11px; color:#38bdf8; font-weight:600;">${member.role}</div>
          <div style="font-size:10px; color:#94a3b8; margin-top:2px;">${ratingBadges ? ratingBadges + ' — ' : ''}${member.specialty || ''}</div>
          <div style="font-size:10px; color:#64748b; margin-top:4px;">Salary: $${(member.salary || 1000000).toLocaleString()}/yr</div>
        </div>
      `;
    }

    staffHtml += `</div>`;
    currentStaffContainer.innerHTML = staffHtml;
  }

  if (coachMarketContainer) {
    const marketplace = staffData?.marketplace || [
      { id: "hc_02", name: "Bill Belichick", role: "Head Coach", title: "Defensive Mastermind", offense_rating: 68, defense_rating: 96, overall: 94, specialty: "Sub-package Matchup Eraser", salary: 4500000 },
      { id: "oc_02", name: "Ben Johnson", role: "Offensive Coordinator", offense_rating: 92, defense_rating: 50, overall: 90, specialty: "Creative Play-Action Concepts", salary: 2100000 }
    ];

    let marketHtml = `<div style="display:flex; flex-direction:column; gap:8px;">`;
    marketplace.forEach(c => {
      marketHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:rgba(15,23,42,0.8); border-radius:6px; border:1px solid rgba(59,130,246,0.3);">
          <div>
            <div style="font-weight:700; color:#fff; font-size:12px;">${c.name} <span style="font-size:10px; color:#38bdf8;">(${c.role})</span></div>
            <div style="font-size:10px; color:#94a3b8; margin-top:2px;">OFF: ${c.offense_rating || '?'} | DEF: ${c.defense_rating || '?'} · ${c.specialty}</div>
          </div>
          <button class="btn btn-primary" onclick="window.hireStaffCoach('${c.id}', '${c.role}')" style="padding:4px 10px; font-size:11px; font-weight:700;">HIRE</button>
        </div>
      `;
    });
    marketHtml += `</div>`;
    coachMarketContainer.innerHTML = marketHtml;
  }
}

window.setStaffDelegation = async function(mode) {
  try {
    await fetch('/api/staff/delegation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    });
    console.log('✅ Staff Play-Calling Delegation set to:', mode);
    renderStaffMarketplace();
  } catch (e) {
    console.error('Error updating staff delegation:', e);
  }
};

window.hireStaffCoach = async function(coach_id, role) {
  try {
    const res = await fetch('/api/staff/hire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coach_id, role })
    });
    const data = await res.json();
    alert(`👔 ${data.message || 'Staff hired!'}`);
    renderStaffMarketplace();
  } catch (e) {
    console.error('Error hiring staff:', e);
  }
};
