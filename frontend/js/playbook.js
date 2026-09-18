import { gameSocketClient } from './gameSocket.js'; 

let PLAY_DATABASE = [];
let activeFormation = 'SHOTGUN';
let activeCategory = 'ALL';
let selectedPlay = null;

export async function loadPlaybookDatabase() {
  try {
    const response = await fetch('/api/playbook');
    if (!response.ok) throw new Error("Failed to fetch playbook");
    PLAY_DATABASE = await response.json();
    renderPlaybook();
  } catch (error) {
    console.error("Playbook API Error:", error);
    renderPlaybook();
  }
}

export function renderPlaybook() {
  const container = document.getElementById('play-grid-container') || document.getElementById('play-grid');
  const confirmBtn = document.getElementById('confirm-play-btn');

  if (!container) return;

  container.innerHTML = '';
  selectedPlay = null;
  if (confirmBtn) confirmBtn.disabled = true;

  const filteredPlays = PLAY_DATABASE.filter(play => {
    const matchFormation = (play.formation === activeFormation) || !activeFormation;
    const matchCategory = (activeCategory === 'ALL') || (play.category === activeCategory);
    return matchFormation && matchCategory;
  });

  if (filteredPlays.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:20px; text-align:center; color:#94a3b8;">No plays found for ${activeFormation} - ${activeCategory}</div>`;
    return;
  }

  filteredPlays.forEach(play => {
    const card = document.createElement('div');
    card.className = 'play-card';
    card.dataset.playId = play.id;
    card.innerHTML = `
      <div class="play-card-header">
        <span class="play-type-badge ${(play.category || play.play_type || 'RUN').toLowerCase()}">${play.category || play.play_type}</span>
        <h4>${play.name || play.play_name}</h4>
      </div>
      <div class="play-card-art">
        <div class="route-diagram">📈 [${play.name || play.play_name} Diagram]</div>
      </div>
      <p class="play-desc">${play.description || "West Coast Concept"}</p>
    `;

    card.addEventListener('click', () => selectPlayCard(card, play));
    container.appendChild(card);
  });
}

function selectPlayCard(cardElement, playObject) {
  document.querySelectorAll('.play-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');
  selectedPlay = playObject;

  const confirmBtn = document.getElementById('confirm-play-btn');
  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.textContent = `CALL: ${(playObject.name || playObject.play_name).toUpperCase()}`;
  }
}

export function initPlaybookControls() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFormation = e.target.dataset.formation;
      renderPlaybook();
    });
  });

  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.dataset.category;
      renderPlaybook();
    });
  });

  const confirmBtn = document.getElementById('confirm-play-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (!selectedPlay) return;

      const playbookOverlay = document.querySelector('.playbook-selection-area');
      if (playbookOverlay) {
        playbookOverlay.style.display = 'none';
      }

      // Pass the specific play_id during the PRE_SNAP handshake
      if (gameSocketClient) {
        gameSocketClient.sendCommand({ 
            command: 'PRE_SNAP',
            play_id: selectedPlay.id
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                gameSocketClient.sendCommand({ command: 'HIKE' });
            });
        });
      }
    });
  }
}

export function showPlaybookOverlay() {
  const playbookOverlay = document.querySelector('.playbook-selection-area');
  if (playbookOverlay) {
    playbookOverlay.style.display = 'block';
    renderPlaybook();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPlaybookDatabase();
  initPlaybookControls();
});
