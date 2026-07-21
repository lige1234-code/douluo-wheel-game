const SAVE_KEY = 'douluo_save';

function saveGame() {
    const data = {
        playerState: { ...playerState },
        currentStageIndex: currentStageIndex,
        currentRotation: currentRotation,
        logs: logContent.innerHTML,
        saveTime: new Date().toLocaleString('zh-CN')
    };
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('保存失败', e);
    }
}

function loadGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);

        playerState = data.playerState;
        currentStageIndex = data.currentStageIndex;
        currentRotation = data.currentRotation;
        isSpinning = false;

        logContent.innerHTML = data.logs;

        if (currentStageIndex >= stages.length - 1) {
            spinBtn.style.display = 'none';
        } else {
            spinBtn.style.display = 'inline-block';
            spinBtn.disabled = false;
        }

        updateStatusUI();
        updateStage();
        addLog(`📂 【读取存档】已恢复${data.saveTime}的进度。`, "normal");
        return true;
    } catch (e) {
        console.warn('读取存档失败', e);
        return false;
    }
}

function exportToTxt() {
    const lines = [];
    lines.push('═══════════════════════════════════════');
    lines.push('  斗罗大陆：百级成神之路 - 魂师档案');
    lines.push('═══════════════════════════════════════');
    lines.push(`  导出时间：${new Date().toLocaleString('zh-CN')}`);
    lines.push('');
    lines.push('【魂师简谱】');
    lines.push(`  魂师尊名：${playerState.name}`);
    lines.push(`  当前魂力：${playerState.level} 级`);
    lines.push(`  当前境界：${playerState.rank}`);
    lines.push(`  传承武魂：${playerState.wuhun}`);
    lines.push(`  先天资质：${playerState.aptitude}`);
    lines.push(`  历练行迹：${playerState.training}`);
    lines.push(`  所属阵营：${playerState.faction}`);
    lines.push(`  魂力值：${playerState.soulPower}`);
    lines.push(`  魂骨数量：${playerState.boneCount}`);
    lines.push(`  双生武魂：${playerState.isTwin ? '是' : '否'}`);
    lines.push('');

    if (playerState.rings.length > 0) {
        lines.push('【已吸收魂环】');
        playerState.rings.forEach((ringKey, index) => {
            const cfg = ringColors[ringKey];
            lines.push(`  第${index + 1}魂环：${cfg.color}色 - ${cfg.desc}`);
        });
        lines.push('');
    }

    lines.push('【命运烙印】');
    const entries = logContent.querySelectorAll('.log-entry');
    entries.forEach((entry, i) => {
        lines.push(`  ${i + 1}. ${entry.innerText}`);
    });
    lines.push('');
    lines.push('═══════════════════════════════════════');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playerState.name}_斗罗档案.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog(`📤 【导出档案】魂师档案已导出为txt文件！`, "normal");
}

function importFromTxt(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const nameMatch = text.match(/魂师尊名：(.+)/);
        const levelMatch = text.match(/当前魂力：(\d+)\s*级/);
        const rankMatch = text.match(/当前境界：(.+)/);
        const wuhunMatch = text.match(/传承武魂：(.+)/);
        const aptitudeMatch = text.match(/先天资质：(.+)/);
        const trainingMatch = text.match(/历练行迹：(.+)/);
        const factionMatch = text.match(/所属阵营：(.+)/);
        const soulpowerMatch = text.match(/魂力值：(\d+)/);
        const boneMatch = text.match(/魂骨数量：(\d+)/);
        const twinMatch = text.match(/双生武魂：(是|否)/);

        if (!nameMatch) {
            addLog(`⚠️ 【导入失败】文件格式不正确，无法识别魂师档案。`, "critical");
            return;
        }

        playerState.name = nameMatch[1].trim();
        playerState.level = levelMatch ? parseInt(levelMatch[1]) : 1;
        playerState.rank = rankMatch ? rankMatch[1].trim() : '凡人';
        playerState.wuhun = wuhunMatch ? wuhunMatch[1].trim() : '未觉醒';
        playerState.aptitude = aptitudeMatch ? aptitudeMatch[1].trim() : '未测试';
        playerState.training = trainingMatch ? trainingMatch[1].trim() : '无';
        playerState.faction = factionMatch ? factionMatch[1].trim() : '未加入';
        playerState.soulPower = soulpowerMatch ? parseInt(soulpowerMatch[1]) : 10;
        playerState.boneCount = boneMatch ? parseInt(boneMatch[1]) : 0;
        playerState.isTwin = twinMatch ? twinMatch[1] === '是' : false;
        playerState.rings = [];

        // 尝试从文本中解析魂环
        const ringLines = text.match(/第\d+魂环：(.+?)色\s*-\s*(.+)/g);
        if (ringLines) {
            ringLines.forEach(line => {
                const colorMatch = line.match(/(.+?)色/);
                if (colorMatch) {
                    const colorMap = { '白': '白', '黄': '黄', '紫': '紫', '黑': '黑', '红': '红', '金': '金' };
                    if (colorMap[colorMatch[1].trim()]) {
                        playerState.rings.push(colorMap[colorMatch[1].trim()]);
                    }
                }
            });
        }

        // 根据等级推算关卡
        currentStageIndex = Math.min(Math.floor((playerState.level - 1) / 5), stages.length - 1);
        currentRotation = 0;
        isSpinning = false;

        logContent.innerHTML = '';
        addLog(`📥 【导入档案】成功恢复魂师【${playerState.name}】的档案！`, "normal");

        if (currentStageIndex >= stages.length - 1) {
            spinBtn.style.display = 'none';
        } else {
            spinBtn.style.display = 'inline-block';
            spinBtn.disabled = false;
        }

        updateStatusUI();
        updateStage();
        saveGame();
    };
    reader.readAsText(file);
}
