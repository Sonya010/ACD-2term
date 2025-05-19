export function drawGraph(ctx, matrix, positions, isDirected) {
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                if (!isDirected && j < i) continue; 
                drawCurvedEdge(ctx, positions[i], positions[j], i, j, isDirected, positions);
            }
        }
    }
    

    positions.forEach((pos, idx) => {
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
        ctx.fillText(idx.toString(), pos.x, pos.y);
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
    const curveOffset = 40;
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
        const angleAtArrow = Math.atan2(endY - cpY, endX - cpX);
        drawArrow(ctx, arrowX, arrowY, angleAtArrow);
    }
}

function getOutwardAngle(pos, allPositions) {
    const center = {
        x: allPositions.reduce((sum, p) => sum + p.x, 0) / allPositions.length,
        y: allPositions.reduce((sum, p) => sum + p.y, 0) / allPositions.length
    };
    return Math.atan2(pos.y - center.y, pos.x - center.x);
}

function drawLoop(ctx, pos, isDirected, allPositions) {
    const radius = 18;
    const angle = getOutwardAngle(pos, allPositions); 
    const center = {
        x: pos.x + Math.cos(angle) * radius * 1.5,
        y: pos.y + Math.sin(angle) * radius * 1.5
    };

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    if (isDirected) {
        const arrowAngle = angle + Math.PI * 1.8;
        const arrowX = center.x + radius * Math.cos(arrowAngle);
        const arrowY = center.y + radius * Math.sin(arrowAngle);
        const tangentAngle = arrowAngle + Math.PI / 2;
        drawArrow(ctx, arrowX, arrowY, tangentAngle);
    }
}

function drawArrow(ctx, x, y, angle) {
    const size = 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
        x - size * Math.cos(angle - Math.PI / 6),
        y - size * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        x - size * Math.cos(angle + Math.PI / 6),
        y - size * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}

export function highlightTraversal(ctx, matrix, treeMatrix, steps, positions, isDirected, mode = 'bfs') {
    let step = 0;
    const visitedOrder = [];
    const visitedSet = new Set();

    const nodeColor = mode === 'dfs' ? '#ff8800' : '#0077ff'; 
    const edgeColor = mode === 'dfs' ? '#ff8800' : '#0077ff';

    function drawNextStep() {
        drawGraph(ctx, matrix, positions, isDirected);

        for (let i = 0; i <= step && i < steps.length; i++) {
            const [from, to] = steps[i];
            drawTraversalArrow(ctx, positions[from], positions[to], edgeColor);
        }

        if (step < steps.length) {
            const [from, to] = steps[step];

            if (!visitedSet.has(from)) {
                visitedSet.add(from);
                visitedOrder.push(from);
            }
            if (!visitedSet.has(to)) {
                visitedSet.add(to);
                visitedOrder.push(to);
            }
        }
        visitedOrder.forEach((v, idx) => {
            drawNumberedNode(ctx, positions[v], idx, nodeColor);
        });
        step++;
        if (step < steps.length) {
            setTimeout(drawNextStep, 800); 
        }
    }

    drawNextStep();
}

export function drawTraversalArrow(ctx, from, to, color) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const offset = 40;
    const controlX = (from.x + to.x) / 2 - dy / distance * offset;
    const controlY = (from.y + to.y) / 2 + dx / distance * offset;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
    ctx.stroke();

    const t = 0.9;
    const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * controlX + t * t * to.x;
    const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * controlY + t * t * to.y;

    const dxCurve = 2 * (1 - t) * (controlX - from.x) + 2 * t * (to.x - controlX);
    const dyCurve = 2 * (1 - t) * (controlY - from.y) + 2 * t * (to.y - controlY);
    const angle = Math.atan2(dyCurve, dxCurve);

    const size = 14;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(angle - Math.PI / 6), y - size * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - size * Math.cos(angle + Math.PI / 6), y - size * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawNumberedNode(ctx, pos, number, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), pos.x, pos.y);
}


