var spinBtn = document.getElementById('spinBtn');
var restartBtn = document.getElementById('restartBtn');
var logContent = document.getElementById('logContent');

function updateStatusUI() {
    playerNameInput.value = playerState.name;
    if (playerState.level > 1 || playerState.wuhun !== '未觉醒') {
        playerNameInput.readOnly = true;
        playerNameInput.style.opacity = '0.7';
    } else {
        playerNameInput.readOnly = false;
        playerNameInput.style.opacity = '1';
    }
    document.getElementById('status-level').innerText = playerState.level + " 级";
    document.getElementById('status-rank').innerText = playerState.rank;
    document.getElementById('status-wuhun').innerText = playerState.wuhun;
    document.getElementById('status-aptitude').innerText = playerState.aptitude;
    document.getElementById('status-training').innerText = playerState.training;
    document.getElementById('status-faction').innerText = playerState.faction;
    document.getElementById('status-soulpower').innerText = playerState.soulPower;

    const ringSlots = document.getElementById('ringSlots');
    if (playerState.rings.length === 0) {
        ringSlots.innerHTML = `<span style="color:#4b5563; font-size:11px;">尚无魂环</span>`;
    } else {
        ringSlots.innerHTML = '';
        playerState.rings.forEach((ringKey, index) => {
            const cfg = ringColors[ringKey];
            const dot = document.createElement('span');
            dot.className = 'ring-dot';
            dot.style.backgroundColor = cfg.bg;
            dot.style.color = cfg.color;
            dot.style.boxShadow = `0 0 8px ${cfg.bg}`;
            dot.title = `第${index+1}魂环: ${cfg.desc}`;
            dot.innerText = index + 1;
            ringSlots.appendChild(dot);
        });
    }
}

function updateStage() {
    const stage = stages[currentStageIndex];
    document.getElementById('stage-title').innerText = stage.title;
    spinBtn.innerText = stage.btnLabel;

    drawWheel(stage.getOptions());
}

function addLog(text, type = "normal") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = text;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}