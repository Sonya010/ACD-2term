function printMatrixToConsole(matrix, title) {
    console.log(`\n${title}`);
    if (!matrix || matrix.length === 0) {
        console.log(" (empty or undefined matrix)");
        return;
    }
    matrix.forEach((row, rowIndex) => {
        const rowString = Array.isArray(row) ? row.join(" ") : " (invalid row data)";
        console.log(`Row ${rowIndex + 1}: ${rowString}`);
    });
}

function multiplyMatrices(matrixA, matrixB) {
    const n = matrixA.length;
    const result = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    return result;
}

function findPathsOfLength(matrix, length) {
    const n = matrix.length;
    const paths = [];

    if (length === 2) {
        for (let i = 0; i < n; i++) { 
            for (let j = 0; j < n; j++) { 
                for (let k = 0; k < n; k++) { 
                    if (matrix[i][k] === 1 && matrix[k][j] === 1) {
                        paths.push([i + 1, k + 1, j + 1]); 
                    }
                }
            }
        }
    } else if (length === 3) {
        for (let i = 0; i < n; i++) { 
            for (let j = 0; j < n; j++) { 
                for (let k = 0; k < n; k++) { 
                    if (matrix[i][k] === 1) {
                        for (let m = 0; m < n; m++) { 
                            if (matrix[k][m] === 1 && matrix[m][j] === 1) {
                                paths.push([i + 1, k + 1, m + 1, j + 1]);
                            }
                        }
                    }
                }
            }
        }
    }
    return paths;
}

function getReachabilityMatrix(matrix) {
    const n = matrix.length;
    const reach = matrix.map(row => [...row]);

    for (let i = 0; i < n; i++) {
        reach[i][i] = 1; 
    }

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (reach[i][k] === 1 && reach[k][j] === 1) {
                    reach[i][j] = 1;
                }
            }
        }
    }
    return reach;
}

function getStronglyConnectedComponents(reachabilityMatrix) {
    const n = reachabilityMatrix.length;
    const sccDeterminationMatrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (reachabilityMatrix[i][j] === 1 && reachabilityMatrix[j][i] === 1) {
                sccDeterminationMatrix[i][j] = 1;
            }
        }
    }

    const visited = Array(n).fill(false);
    const components = [];
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            const currentComponent = [];
            for (let j = 0; j < n; j++) {
                if (sccDeterminationMatrix[i][j] === 1) { 
                    currentComponent.push(j + 1); 
                    visited[j] = true; 
                }
            }
            if (currentComponent.length > 0) {
                components.push(currentComponent.sort((a, b) => a - b)); 
            }
        }
    }
    return { matrix: sccDeterminationMatrix, components: components };
}

function buildCondensationGraph(originalMatrix, sccList) {
    const numSCCs = sccList.length;
    if (numSCCs === 0) return { adjMatrix: [], nodes: [], sccList: [] };

    const condensationAdjMatrix = Array.from({ length: numSCCs }, () => Array(numSCCs).fill(0));
    const sccNodeLabels = sccList.map((comp, idx) => `S${idx}`); 

    const vertexToSccIndex = {};
    sccList.forEach((component, sccIndex) => {
        component.forEach(vertexOneBased => { 
            vertexToSccIndex[vertexOneBased - 1] = sccIndex; 
        });
    });

    const n_original = originalMatrix.length;
    for (let u_orig = 0; u_orig < n_original; u_orig++) { 
        for (let v_orig = 0; v_orig < n_original; v_orig++) { 
            if (originalMatrix[u_orig][v_orig] === 1) {
                const sccU_idx = vertexToSccIndex[u_orig];
                const sccV_idx = vertexToSccIndex[v_orig];

                if (sccU_idx !== undefined && sccV_idx !== undefined && sccU_idx !== sccV_idx) {
                    condensationAdjMatrix[sccU_idx][sccV_idx] = 1;
                }
            }
        }
    }
    return { adjMatrix: condensationAdjMatrix, nodes: sccNodeLabels, sccList: sccList };
}

export function analyzeAndProcessTask4(matrix) {
    console.log("\n--- Task 4 Analysis ---");
    const n = matrix.length;
    const analysisResults = {};

    analysisResults.inDegrees = Array(n).fill(0);
    analysisResults.outDegrees = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 1) {
                analysisResults.outDegrees[i]++;
                analysisResults.inDegrees[j]++;
            }
        }
    }
    console.log("\n1. Half-degrees of vertices (for Task 4 Graph):");
    for (let i = 0; i < n; i++) {
        console.log(`Vertex ${i + 1}: out-degree = ${analysisResults.outDegrees[i]}, in-degree = ${analysisResults.inDegrees[i]}`);
    }

    const A2 = multiplyMatrices(matrix, matrix);
    printMatrixToConsole(A2, "Matrix A^2 (Counts of paths of length 2):");
    analysisResults.pathsOfLength2 = findPathsOfLength(matrix, 2);
    console.log("\nList of Paths of length 2:");
    if (analysisResults.pathsOfLength2.length > 0) {
        analysisResults.pathsOfLength2.forEach(path => console.log(path.join(" -> ")));
    } else {
        console.log("No paths of length 2 found.");
    }

    const A3 = multiplyMatrices(A2, matrix);
    printMatrixToConsole(A3, "Matrix A^3 (Counts of paths of length 3):");
    analysisResults.pathsOfLength3 = findPathsOfLength(matrix, 3);
    console.log("\nList of Paths of length 3:");
    if (analysisResults.pathsOfLength3.length > 0) {
        analysisResults.pathsOfLength3.forEach(path => console.log(path.join(" -> ")));
    } else {
        console.log("No paths of length 3 found.");
    }

    analysisResults.reachabilityMatrix = getReachabilityMatrix(matrix);
    printMatrixToConsole(analysisResults.reachabilityMatrix, "3. Reachability Matrix (R):");

    const sccData = getStronglyConnectedComponents(analysisResults.reachabilityMatrix);
    analysisResults.strongConnectivityMatrix = sccData.matrix;
    analysisResults.sccList = sccData.components; 

    printMatrixToConsole(analysisResults.strongConnectivityMatrix, "4. Strong Connectivity Matrix (S):");
    console.log("\n5. Strongly Connected Components (SCCs):");
    if (analysisResults.sccList.length > 0) {
        analysisResults.sccList.forEach((component, idx) => {
            console.log(`SCC ${idx} (label S${idx}): {${component.join(", ")}}`); 
        });
    } else {
        console.log("No non-trivial SCCs found. Each node may be its own SCC if graph is not empty.");
    }

    analysisResults.condensationGraphData = buildCondensationGraph(matrix, analysisResults.sccList);
    printMatrixToConsole(analysisResults.condensationGraphData.adjMatrix, "6. Condensation Graph Adjacency Matrix:");
    console.log("Condensation Graph Nodes (SCC labels):", analysisResults.condensationGraphData.nodes);
    
    return analysisResults; 
}