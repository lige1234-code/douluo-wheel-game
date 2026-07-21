const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

function drawWheel(options) {
    const numSegments = options.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = (i + 1) * anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(156, 156);
        ctx.arc(156, 156, 156, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = wheelPalette[i % wheelPalette.length];
        ctx.fill();
        
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0d0e15';
        ctx.stroke();

        ctx.save();
        ctx.translate(156, 156);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Microsoft YaHei';
        ctx.shadowBlur = 3;
        ctx.shadowColor = "#000";
        
        let text = options[i];
        if (text.length > 11) {
            text = text.substring(0, 10) + "..";
        }
        ctx.fillText(text, 142, 4);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(156, 156, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#0d0e15';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffd700';
    ctx.stroke();
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    // 同步输入框中的名字
    const inputName = playerNameInput.value.trim();
    if (inputName) {
        playerState.name = inputName;
    }

    const stage = stages[currentStageIndex];
    const options = stage.getOptions();
    const numSegments = options.length;

    const winIndex = Math.floor(Math.random() * numSegments);

    const baseRotation = Math.ceil(currentRotation / 360) * 360;
    const winAngleOffset = 270 - (winIndex + 0.5) * (360 / numSegments);
    const targetRotation = baseRotation + 1800 + ((winAngleOffset % 360 + 360) % 360);
    
    currentRotation = targetRotation;
    canvas.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
        const selectedOption = options[winIndex];
        stage.onSelect(selectedOption);
        updateStatusUI();
        saveGame();

        isSpinning = false;
        
        if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            spinBtn.disabled = false;
            updateStage();
        }
    }, 4500);
}