function generateRandomName() {
    const s = surnames[Math.floor(Math.random() * surnames.length)];
    const n = names[Math.floor(Math.random() * names.length)];
    return s + n;
}

function initGame() {
    playerState = {
        name: generateRandomName(),
        level: 1,
        rank: '凡人',
        wuhun: '未觉醒',
        isTwin: false,
        aptitude: '未测试',
        training: '无',
        faction: '未加入',
        rings: [],
        boneCount: 0
    };

    currentStageIndex = 0;
    currentRotation = 0;
    isSpinning = false;

    logContent.innerHTML = `<div class="log-entry">🌌 斗罗历史的车轮滚滚向前。这一世，名为 <b>【${playerState.name}】</b> 的少年在偏远村落睁开双眼，体内流淌着未知的力量，百级成神之路自此开始……</div>`;
    
    spinBtn.style.display = 'inline-block';
    spinBtn.disabled = false;
    restartBtn.style.display = 'none';

    updateStatusUI();
    updateStage();
}

spinBtn.addEventListener('click', spin);
restartBtn.addEventListener('click', initGame);

window.onload = initGame;