const spinBtn = document.getElementById('spinBtn');
const restartBtn = document.getElementById('restartBtn');
const logContent = document.getElementById('logContent');

function updateStatusUI() {
    document.getElementById('status-name').innerText = playerState.name;
    document.getElementById('status-level').innerText = playerState.level + " 级";
    document.getElementById('status-rank').innerText = playerState.rank;
    document.getElementById('status-wuhun').innerText = playerState.wuhun;
    document.getElementById('status-aptitude').innerText = playerState.aptitude;
    document.getElementById('status-training').innerText = playerState.training;
    document.getElementById('status-faction').innerText = playerState.faction;

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
    document.getElementById('stage-title').innerText = `阶段 ${currentStageIndex + 1}：${stage.title}`;
    spinBtn.innerText = stage.btnLabel;

    document.querySelectorAll('.step').forEach((el, idx) => {
        if (idx < currentStageIndex) {
            el.className = 'step completed';
        } else if (idx === currentStageIndex) {
            el.className = 'step active';
        } else {
            el.className = 'step';
        }
    });

    drawWheel(stage.getOptions());
}

function addLog(text, type = "normal") {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = text;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}