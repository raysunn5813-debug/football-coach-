export function renderFreeAgents() {
    const tbody = document.getElementById('free-agents-tbody');
    if (!tbody) return;

    // Generate mock free agents
    const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'];
    const STYLES = {
        'QB': ['Field General', 'Scrambler', 'Strong Arm'],
        'RB': ['Power Back', 'Elusive', 'Receiving'],
        'WR': ['Deep Threat', 'Possession', 'Slot'],
        'TE': ['Blocking', 'Vertical Threat'],
        'OL': ['Pass Protector', 'Run Blocker'],
        'DL': ['Run Stopper', 'Pass Rusher'],
        'LB': ['Coverage', 'Thumper', 'Pass Rusher'],
        'CB': ['Man-to-Man', 'Zone', 'Slot'],
        'S':  ['Box Safety', 'Ball Hawk'],
        'K':  ['Accurate', 'Big Leg'],
        'P':  ['Directional', 'Big Leg']
    };

    const NAMES = [
        "Jamal Carter", "DeAndre Swift", "Marcus Johnson", "Darius Slayton", "Trevor Lawrence",
        "Ezekiel Elliott", "T.J. Watt", "Myles Garrett", "Aaron Donald", "Jalen Ramsey",
        "Tyreek Hill", "Davante Adams", "Stefon Diggs", "Justin Jefferson", "Travis Kelce",
        "George Kittle", "Trent Williams", "Zack Martin", "Quenton Nelson", "Lane Johnson",
        "Micah Parsons", "Fred Warner", "Bobby Wagner", "Roquan Smith", "Derwin James",
        "Minkah Fitzpatrick", "Justin Simmons", "Justin Tucker", "Harrison Butker", "Michael Dickson"
    ];

    const freeAgents = [];
    for (let i = 0; i < 400; i++) {
        const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
        const styleList = STYLES[pos];
        const style = styleList[Math.floor(Math.random() * styleList.length)];
        const name = NAMES[Math.floor(Math.random() * NAMES.length)] + (i > 29 ? ` ${i}` : "");
        const ovr = Math.floor(Math.random() * 20) + 70; // 70-89
        const age = Math.floor(Math.random() * 12) + 21; // 21-32
        const spd = Math.floor(Math.random() * 30) + 65;
        const acc = Math.floor(Math.random() * 30) + 65;
        const cat = Math.floor(Math.random() * 40) + 50;
        const tak = Math.floor(Math.random() * 40) + 50;
        const str = Math.floor(Math.random() * 40) + 50;
        const awr = Math.floor(Math.random() * 30) + 60;
        const salary = "$" + (Math.floor(Math.random() * 15) + 1).toFixed(1) + "M";

        freeAgents.push({
            name, pos, style, ovr, age, spd, acc, cat, tak, str, awr, salary
        });
    }

    // Sort by OVR descending
    freeAgents.sort((a, b) => b.ovr - a.ovr);

    // Initial render (first 10)
    function renderPage(pageIndex) {
        const start = pageIndex * 10;
        const end = start + 10;
        const pageAgents = freeAgents.slice(start, end);
        
        let html = '';
        pageAgents.forEach(agent => {
            html += `
                <tr>
                    <td style="font-weight:700; color:#e2e8f0;">${agent.name}</td>
                    <td style="color:#60a5fa; font-weight:700;">${agent.pos}</td>
                    <td>${agent.style}</td>
                    <td style="color:#fde68a; font-weight:800;">${agent.ovr}</td>
                    <td>${agent.age}</td>
                    <td>${agent.spd}</td>
                    <td>${agent.acc}</td>
                    <td>${agent.cat}</td>
                    <td>${agent.tak}</td>
                    <td>${agent.str}</td>
                    <td>${agent.awr}</td>
                    <td style="color:#34d399; font-weight:700;">${agent.salary}</td>
                    <td><button class="btn btn-primary" style="font-size: 10px; padding: 4px 8px;">SIGN</button></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        
        const info = document.getElementById('fa-pagination-info');
        if (info) {
            info.textContent = `Showing ${start + 1}-${Math.min(end, freeAgents.length)} of ${freeAgents.length} players`;
        }
    }

    let currentPage = 0;
    renderPage(currentPage);

    // Hook up pagination buttons if they aren't already
    const prevBtn = document.getElementById('fa-prev-btn');
    const nextBtn = document.getElementById('fa-next-btn');
    
    if (prevBtn) {
        // Clone to clear old listeners if any
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                renderPage(currentPage);
            }
        });
    }
    
    if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener('click', () => {
            if ((currentPage + 1) * 10 < freeAgents.length) {
                currentPage++;
                renderPage(currentPage);
            }
        });
    }
}
