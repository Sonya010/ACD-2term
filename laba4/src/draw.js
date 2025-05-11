export function drawGraph(ctx, matrix, positions, isDirected, nodeLabelPrefix = "V", customNodeLabels = null) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;

    if (positions.length !== matrix.length && matrix.length > 0) {
        console.warn(`Mismatch between positions array length (${positions.length}) and matrix size (${matrix.length}). Drawing might be incorrect.`);
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                if (!isDirected && j < i) continue; 
                if (positions[i] && positions[j]) {
                    drawCurvedEdge(ctx, positions[i], positions[j], i, j, isDirected, positions);
                } else {
                     console.error(`Error drawing edge: Position for node ${i+1} or ${j+1} is undefined.`);
                }
            }
        }
    }
    
    positions.forEach((pos, idx) => {
        if (!pos) {
            console.error(`Position for index ${idx} (node ${idx+1}) is undefined. Skipping node drawing.`);
            return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 14px Arial';
        
        let label;
        if (customNodeLabels && customNodeLabels[idx] !== undefined) {
            label = customNodeLabels[idx]; 
        } else {
            label = `${nodeLabelPrefix}${idx + 1}`;
        }
        ctx.fillText(label, pos.x, pos.y);
    });
}


function drawCurvedEdge(ctx, start, end, i, j, isDirected, allPositions) {
    const nodeRadius = 15;

    if (i === j) { 
        drawLoop(ctx, start, isDirected, allPositions);
        return;
    }
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);

    const offsetX = (dx / distance) * nodeRadius;
    const offsetY = (dy / distance) * nodeRadius;

    const startX = start.x + offsetX;
    const startY = start.y + offsetY;
    const endX = end.x - offsetX;
    const endY = end.y - offsetY;

    const mx = (startX + endX) / 2;
    const my = (startY + endY) / 2;
    const normalX = -dy / distance; 
    const normalY = dx / distance;
    const curveOffset = 30; 
    const cpX = mx + normalX * curveOffset;
    const cpY = my + normalY * curveOffset;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    ctx.stroke();

    if (isDirected) {
        const t = 0.93;
        const arrowX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * endX;
        const arrowY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * endY;
        
        const dX = 2 * (1 - t) * (cpX - startX) + 2 * t * (endX - cpX);
        const dY = 2 * (1 - t) * (cpY - startY) + 2 * t * (endY - cpY);
        const angleAtArrow = Math.atan2(dY, dX);
        drawArrow(ctx, arrowX, arrowY, angleAtArrow);
    }
}

function getOutwardAngle(pos, allPositions) {
    if (allPositions.length <= 1) return -Math.PI / 2;

    const centerX = allPositions.reduce((sum, p) => sum + p.x, 0) / allPositions.length;
    const centerY = allPositions.reduce((sum, p) => sum + p.y, 0) / allPositions.length;
    return Math.atan2(pos.y - centerY, pos.x - centerX);
}

function drawLoop(ctx, pos, isDirected, allPositions) {
    const loopRadius = 18; 
    const nodeOffsetFactor = 1.5; 

    const angle = getOutwardAngle(pos, allPositions); 
    
    const loopCenterX = pos.x + Math.cos(angle) * loopRadius * nodeOffsetFactor;
    const loopCenterY = pos.y + Math.sin(angle) * loopRadius * nodeOffsetFactor;

    ctx.beginPath();
    ctx.arc(loopCenterX, loopCenterY, loopRadius, 0, Math.PI * 2);
    ctx.stroke();

    if (isDirected) {
        const arrowPlacementAngle = angle - Math.PI / 4; 
        
        const arrowX = loopCenterX + loopRadius * Math.cos(arrowPlacementAngle);
        const arrowY = loopCenterY + loopRadius * Math.sin(arrowPlacementAngle);

        const tangentAngle = arrowPlacementAngle + Math.PI / 2; 
        drawArrow(ctx, arrowX, arrowY, tangentAngle);
    }
}

function drawArrow(ctx, x, y, angle) {
    const size = 8; 
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size / 2);
    ctx.lineTo(-size, size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}