export function analyzeGraph(matrix, isDirected) {
    const n = matrix.length;
        const degrees = [];
        const inDegrees = [];
        const outDegrees = [];
        let isolated = [];
        let pendant = [];

    for (let i = 0; i < n; i++) {
        let deg = 0, inDeg = 0, outDeg = 0;

        for (let j = 0; j < n; j++) {
            if (isDirected) {
                outDeg += matrix[i][j];
                inDeg += matrix[j][i];
            } else {
                deg += matrix[i][j];
            }
        }

        if (isDirected) {
            const total = inDeg + outDeg;
            degrees.push(total);
            inDegrees.push(inDeg);
            outDegrees.push(outDeg);
            if (total === 0) isolated.push(i);
            if (total === 1) pendant.push(i);
        } else {
            degrees.push(deg);
            if (deg === 0) isolated.push(i);
            if (deg === 1) pendant.push(i);
        }
    }


    let isRegular = degrees.every(d => d === degrees[0]);
    let regularityDegree = isRegular ? degrees[0] : null;

    return {
        isDirected,
        degrees,
        inDegrees: isDirected ? inDegrees : null,
        outDegrees: isDirected ? outDegrees : null,
        isolated,
        pendant,
        isRegular,
        regularityDegree
    };
}