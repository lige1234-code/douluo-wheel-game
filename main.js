var playerNameInput = document.getElementById('playerNameInput');

function generateRandomName() {
    const s = surnames[Math.floor(Math.random() * surnames.length)];
    const n = names[Math.floor(Math.random() * names.length)];
    return s + n;
}

function getPlayerName() {
    const input = playerNameInput.value.trim();
    return input || generateRandomName();
}

function initGame() {
    playerState = {
        name: getPlayerName(),
        level: 1,
        rank: '凡人',
        wuhun: '未觉醒',
        isTwin: false,
        aptitude: '未测试',
        training: '无',
        faction: '未加入',
        rings: [],
        boneCount: 0,
        soulPower: 10
    };

    currentStageIndex = 0;
    currentRotation = 0;
    isSpinning = false;

    logContent.innerHTML = `<div class="log-entry">🌌 斗罗历史的车轮滚滚向前。这一世，名为 <b>【${playerState.name}】</b> 的少年在偏远村落睁开双眼，体内流淌着未知的力量，百级成神之路自此开始……</div>`;
    
    spinBtn.style.display = 'inline-block';
    spinBtn.disabled = false;

    updateStatusUI();
    updateStage();
    saveGame();
}

spinBtn.addEventListener('click', spin);
restartBtn.addEventListener('click', initGame);

// 启动时尝试加载存档，没有则新开
window.onload = () => {
    const loaded = loadGame();
    if (!loaded) {
        initGame();
    }

    document.getElementById('exportBtn').addEventListener('click', exportToTxt);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importFromTxt(e.target.files[0]);
            e.target.value = '';
        }
    });
};
