export function drawGraph(ctx, matrix, positions, isDirected) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.strokeStyle = '#414141';
    ctx.fillStyle = '#414141';
    ctx.lineWidth = 2;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                drawEdge(ctx, positions[i], positions[j], i, j, isDirected, positions);
            }
        }
    }

    positions.forEach((pos, idx) => {
        ctx.fillStyle = '#ffffff'; 
        ctx.strokeStyle = '#000'; 
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(idx.toString(), pos.x, pos.y);
    });
}

function drawEdge(ctx, start, end, i, j, isDirected, allPositions) {
    if (i === j) {
        drawLoop(ctx, start, allPositions, isDirected);
        return;
    }
    
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const nodeRadius = 15;
    const endX = end.x - (nodeRadius + 1) * Math.cos(angle);
    const endY = end.y - (nodeRadius + 1) * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(
        start.x + nodeRadius * Math.cos(angle),
        start.y + nodeRadius * Math.sin(angle)
    );
    ctx.lineTo(endX, endY);
    ctx.stroke();

    if (isDirected) {
        drawArrow(ctx, endX, endY, angle);
    }
}

function drawLoop(ctx, pos, allPositions, isDirected) {
    const radius = 18;
    const angle = getOutwardAngle(pos, allPositions);
    const center = {
        x: pos.x + Math.cos(angle) * radius * 1.3,
        y: pos.y + Math.sin(angle) * radius * 1.3
    };

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    if (isDirected) {
        const arrowAngle = angle + Math.PI * 1.9;
        
        const arrowX = center.x + radius * Math.cos(arrowAngle);
        const arrowY = center.y + radius * Math.sin(arrowAngle);
        
        const tangentAngle = arrowAngle + Math.PI / 2;
        
        drawArrow(ctx, arrowX, arrowY, tangentAngle);
    }
}

function getOutwardAngle(pos, allPositions) {
    const center = {
        x: allPositions.reduce((sum, p) => sum + p.x, 0) / allPositions.length,
        y: allPositions.reduce((sum, p) => sum + p.y, 0) / allPositions.length
    };
    return Math.atan2(pos.y - center.y, pos.x - center.x);
}

function drawArrow(ctx, x, y, angle) {
    const size = 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
        x - size * Math.cos(angle - Math.PI/6),
        y - size * Math.sin(angle - Math.PI/6)
    );
    ctx.lineTo(
        x - size * Math.cos(angle + Math.PI/6),
        y - size * Math.sin(angle + Math.PI/6)
    );
    ctx.closePath();
    ctx.fill();
}