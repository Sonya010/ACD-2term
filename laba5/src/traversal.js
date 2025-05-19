function findStartVertex(matrix) {
    const n = matrix.length;
    let minOut = Infinity;
    let start = 0;

    for (let i = 0; i < n; i++) {
        const outDegree = matrix[i].reduce((a, b) => a + b, 0);
        if (outDegree > 0 && outDegree < minOut) {
            minOut = outDegree;
            start = i;
        }
    }
    return start;
}

export function bfsTraversal(matrix) {
    const n = matrix.length;
    const visited = Array(n).fill(false);
    const tree = Array.from({ length: n }, () => Array(n).fill(0));
    const steps = [];
    const visitOrder = [];

    const queue = [];
    const start = findStartVertex(matrix);

    queue.push(start);
    visited[start] = true;
    visitOrder.push(start);

    while (queue.length > 0) {
        const u = queue.shift();
        for (let v = 0; v < n; v++) {
            if (matrix[u][v] && !visited[v]) {
                visited[v] = true;
                queue.push(v);
                tree[u][v] = 1;
                steps.push([u, v]);
                visitOrder.push(v);
            }
        }
    }

    const oldToNew = Array(n).fill(null);
    const newToOld = Array(visitOrder.length).fill(null);

    visitOrder.forEach((original, i) => {
        oldToNew[original] = i;
        newToOld[i] = original;
    });

    console.log("\nOld → New Vertex Numbering:");
    oldToNew.forEach((newNum, oldNum) => {
        console.log(`Old ${oldNum } → New ${newNum}`);
    });

    return [tree, steps];
}

export function dfsTraversal(matrix) {
    const n = matrix.length;
    const visited = Array(n).fill(false);
    const tree = Array.from({ length: n }, () => Array(n).fill(0));
    const steps = [];
    const visitOrder = [];

    function dfs(u) {
        visited[u] = true;
        visitOrder.push(u);

        for (let v = 0; v < n; v++) {
            if (matrix[u][v] && !visited[v]) {
                tree[u][v] = 1;
                steps.push([u, v]);
                dfs(v);
            }
        }
    }

    const start = findStartVertex(matrix);
    dfs(start);

    const oldToNew = Array(n).fill(null);
    const newToOld = Array(visitOrder.length).fill(null);

    visitOrder.forEach((original, i) => {
        oldToNew[original] = i;
        newToOld[i] = original;
    });

    console.log("\nOld → New Vertex Numbering:");
    oldToNew.forEach((newNum, oldNum) => {
        console.log(`Old ${oldNum } → New ${newNum}`);
    });

    return [tree, steps];
}
