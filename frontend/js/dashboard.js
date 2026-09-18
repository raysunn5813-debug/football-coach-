/**
 * dashboard.js — Scheme Selection & Preview Logic
 */

// 1. Playbook Database (Can later be moved to your Python Backend)
export const SCHEME_DATA = {
    offense: {
        "Pro Style": {
            bonus: "+5% Pass Accuracy",
            bonusClass: "text-green-500",
            styleColor: "#4ade80",
            description: "Focuses on balanced short-to-intermediate passing concepts and inside zone runs."
        },
        "Spread": {
            bonus: "+8% WR Separation",
            bonusClass: "text-green-500",
            styleColor: "#4ade80",
            description: "Utilizes 3 and 4 receiver sets to stretch the defense horizontally and vertically."
        },
        "West Coast": {
            bonus: "+10% Short Pass Completion",
            bonusClass: "text-green-500",
            styleColor: "#4ade80",
            description: "Uses short, quick passes to act as an extension of the running game and control the clock."
        }
    },
    defense: {
        "46 Defense": {
            bonus: "+8% Pass Rush / Blitz",
            bonusClass: "text-green-500",
            styleColor: "#facc15",
            description: "Aggressive 8-in-the-box front designed to stop the run and overwhelm offensive lines."
        },
        "Tampa 2": {
            bonus: "+10% Interception Chance",
            bonusClass: "text-blue-500",
            styleColor: "#60a5fa",
            description: "A zone scheme relying on a fast middle linebacker to drop deep, forcing underneath throws."
        },
        "Legion of Boom": {
            bonus: "+15% Press Coverage",
            bonusClass: "text-blue-500",
            styleColor: "#60a5fa",
            description: "Physical Cover 1 and Cover 3 scheme relying on dominant, oversized defensive backs."
        }
    }
};

// 2. Update Function
export function updateSchemeCard(type, selectedScheme) {
    const data = SCHEME_DATA[type]?.[selectedScheme];
    if (!data) return;

    if (type === 'offense') {
        const offTitle = document.getElementById('offense-scheme-title');
        const offBonus = document.getElementById('offense-scheme-bonus');
        const offDesc = document.getElementById('offense-scheme-desc');

        if (offTitle) offTitle.textContent = `Offensive Scheme: ${selectedScheme}`;
        if (offBonus) {
            offBonus.textContent = data.bonus;
            if (data.bonusClass) offBonus.className = data.bonusClass;
            if (data.styleColor) offBonus.style.color = data.styleColor;
        }
        if (offDesc) offDesc.textContent = data.description;
    } else {
        const defTitle = document.getElementById('defense-scheme-title');
        const defBonus = document.getElementById('defense-scheme-bonus');
        const defDesc = document.getElementById('defense-scheme-desc');

        if (defTitle) defTitle.textContent = `Defensive Scheme: ${selectedScheme}`;
        if (defBonus) {
            defBonus.textContent = data.bonus;
            if (data.bonusClass) defBonus.className = data.bonusClass;
            if (data.styleColor) defBonus.style.color = data.styleColor;
        }
        if (defDesc) defDesc.textContent = data.description;
    }
}

// 3. Dynamic Team Synergy & Chemistry Calculator
export function calculateAndRenderSynergy(offenseScheme = "Pro Style", defenseScheme = "46 Defense") {
    const offBar = document.getElementById('chem-bar-off');
    const offStyle = document.getElementById('chem-style-off');
    const defBar = document.getElementById('chem-bar-def');
    const defStyle = document.getElementById('chem-style-def');
    const stBar = document.getElementById('chem-bar-st');
    const stStyle = document.getElementById('chem-style-st');
    const ovrBadge = document.getElementById('chemistry-overall-badge');

    // Dynamic chemistry values based on scheme alignment
    const offVal = offenseScheme === "Pro Style" ? 85 : (offenseScheme === "Spread" ? 88 : 82);
    const defVal = defenseScheme === "46 Defense" ? 84 : (defenseScheme === "Tampa 2" ? 80 : 86);
    const stVal = 78;
    const ovrVal = Math.round((offVal + defVal + stVal) / 3);

    if (offBar) offBar.style.width = `${offVal}%`;
    if (offStyle) offStyle.textContent = `${offVal}% (${offenseScheme})`;

    if (defBar) defBar.style.width = `${defVal}%`;
    if (defStyle) defStyle.textContent = `${defVal}% (${defenseScheme})`;

    if (stBar) stBar.style.width = `${stVal}%`;
    if (stStyle) stStyle.textContent = `${stVal}% (Balanced)`;

    if (ovrBadge) ovrBadge.textContent = `OVR ${ovrVal}%`;
}

// 4. Init Dashboard Scheme Event Listeners
export function initDashboardSchemes() {
    const offSelect = document.getElementById('offense-scheme-select') || document.getElementById('off-playbook-select');
    const defSelect = document.getElementById('defense-scheme-select') || document.getElementById('def-playbook-select');

    if (offSelect) {
        offSelect.addEventListener('change', (e) => {
            updateSchemeCard('offense', e.target.value);
            calculateAndRenderSynergy(e.target.value, defSelect ? defSelect.value : "46 Defense");
        });
        if (offSelect.value) {
            updateSchemeCard('offense', offSelect.value);
        }
    }

    if (defSelect) {
        defSelect.addEventListener('change', (e) => {
            updateSchemeCard('defense', e.target.value);
            calculateAndRenderSynergy(offSelect ? offSelect.value : "Pro Style", e.target.value);
        });
        if (defSelect.value) {
            updateSchemeCard('defense', defSelect.value);
        }
    }

    calculateAndRenderSynergy(
        offSelect ? offSelect.value : "Pro Style",
        defSelect ? defSelect.value : "46 Defense"
    );
}

export function renderPlaybookPreview(offenseScheme = "Pro Style", defenseScheme = "46 Defense") {
    initDashboardSchemes();
    updateSchemeCard('offense', offenseScheme);
    updateSchemeCard('defense', defenseScheme);
    calculateAndRenderSynergy(offenseScheme, defenseScheme);
}

// Auto-run on load
document.addEventListener('DOMContentLoaded', () => {
    initDashboardSchemes();

    const modal = document.getElementById('weekly-wrapup-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

