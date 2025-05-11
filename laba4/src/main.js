import { getRandomMatrix, makeUndirected } from "./matrix.js";
import { calculatePos } from './position.js';
import { drawGraph } from './draw.js';
import { analyzeGraph as analyzeGraphTask2 } from './analysis(task2).js';
import { analyzeAndProcessTask4 } from './analysis(task4).js';

const canvas1 = document.getElementById('graph-canvas-1');
const ctx1 = canvas1.getContext('2d');
const graph1Title = document.getElementById('graph1-title');

const canvas2 = document.getElementById('graph-canvas-2');
const ctx2 = canvas2.getContext('2d');
const graph2Title = document.getElementById('graph2-title');


const canvas3 = document.getElementById('graph-canvas-3');
const ctx3 = canvas3.getContext('2d');
const graph3Title = document.getElementById('graph3-title');


const n1 = 4, n3_val = 1, n4_val = 4;

const seed = 4314;
const numVertices = 10 + n3_val; 


const k1 = 1.0 - n1 * 0.01 - n4_val * 0.01 - 0.3; 

let isDirectedGraph1 = true; 

let directedMatrixGraph1 = getRandomMatrix(numVertices, seed, k1);
let undirectedMatrixGraph1 = makeUndirected(directedMatrixGraph1);

const positionsGraph1 = calculatePos(numVertices, canvas1.width, canvas1.height);

function drawAndTitleGraph1() {
    drawGraph(ctx1, isDirectedGraph1 ? directedMatrixGraph1 : undirectedMatrixGraph1, positionsGraph1, isDirectedGraph1, "V");
    const titleText = `Graph 1: ${isDirectedGraph1 ? "Directed" : "Undirected"} (k1=${k1.toFixed(3)}) (Press Space to toggle)`;
    graph1Title.textContent = titleText;
}

function printMatrixConsole(matrix, title) {
    console.log(`\n${title}`);
    if (!matrix || matrix.length === 0) {
        console.log(" (empty or undefined matrix)");
        return;
    }
    matrix.forEach((row, i) => {
        const rowString = Array.isArray(row) ? row.join(" ") : " (invalid row data)";
        console.log(`Row ${i + 1}: ${rowString}`);
    });
}

function printAnalysisTask2Console(analysis) {
    console.log(`\n -- Analysis of ${analysis.isDirected ? "Directed" : "Undirected"} Graph (Task 2 style) --`);
    console.log("\nDegrees of vertices:");
    analysis.degrees.forEach((d, i) => {
        console.log(`Vertex ${i + 1}: degree = ${d}`);
    });

    if (analysis.isDirected) {
        console.log("\nOut- and In-degrees:");
        analysis.outDegrees.forEach((outDeg, i) => {
            const inDeg = analysis.inDegrees[i];
            console.log(`Vertex ${i + 1}: out-degree = ${outDeg}, in-degree = ${inDeg}`);
        });
    }

    if (analysis.isRegular) {
        console.log(`\nThe graph is regular (degree = ${analysis.regularityDegree})`);
    } else {
        console.log(`\nThe graph is not regular`);
    }
    console.log(`\nIsolated vertices: ${analysis.isolated.length > 0 ? analysis.isolated.map(v => v + 1).join(", ") : "none"}`);
    console.log(`Pendant vertices: ${analysis.pendant.length > 0 ? analysis.pendant.map(v => v + 1).join(", ") : "none"}`);
}

console.log("--- Initializing Graph 1 (Task 2 style) ---");
drawAndTitleGraph1(); 

printMatrixConsole(directedMatrixGraph1, `Directed Matrix (Graph 1, k1=${k1.toFixed(3)}):`);
printMatrixConsole(undirectedMatrixGraph1, `Undirected Matrix (Graph 1, k1=${k1.toFixed(3)}):`);

console.log("\n--- Initial Analysis for Graph 1 (Task 2 style) ---"); 
printAnalysisTask2Console(analyzeGraphTask2(directedMatrixGraph1, true)); 
printAnalysisTask2Console(analyzeGraphTask2(undirectedMatrixGraph1, false)); 


const k2 = 1.0 - n3_val * 0.005 - n4_val * 0.005 - 0.27; 
graph2Title.textContent = `Graph 2: Task 3 Directed Graph (k2=${k2.toFixed(3)})`;


const seedTask4 = seed + 1; 
let directedMatrixTask4 = getRandomMatrix(numVertices, seedTask4, k2);
const positionsGraph2 = calculatePos(numVertices, canvas2.width, canvas2.height);

console.log("\n--- Generating Task 4 Graph (Graph 2 on Canvas) ---");
printMatrixConsole(directedMatrixTask4, `Directed Matrix (Graph 2 / Task 3, k2=${k2.toFixed(3)}):`);
drawGraph(ctx2, directedMatrixTask4, positionsGraph2, true, "V");

const task4AnalysisResults = analyzeAndProcessTask4(directedMatrixTask4);

console.log("\n--- Generating Condensation Graph (Graph 3 on Canvas, from Graph 2) ---");
const condensationData = task4AnalysisResults.condensationGraphData;
const condensationMatrix = condensationData.adjMatrix;
const condensationNodeLabels = condensationData.nodes;
const numSccNodes = condensationMatrix.length;

graph3Title.textContent = `Graph 3: Condensation Graph (from Graph 2, ${numSccNodes} SCCs)`;

if (numSccNodes > 0) {
    const positionsCondensation = calculatePos(numSccNodes, canvas3.width, canvas3.height);
    drawGraph(ctx3, condensationMatrix, positionsCondensation, true, "", condensationNodeLabels);
} else {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx3.fillStyle = '#000';
    ctx3.textAlign = 'center';
    ctx3.font = '16px Arial';
    ctx3.fillText("No SCCs to form a condensation graph.", canvas3.width / 2, canvas3.height / 2);
    console.log("Condensation graph not drawn: No SCCs found or graph is trivial/empty.");
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        isDirectedGraph1 = !isDirectedGraph1;
        drawAndTitleGraph1(); 
    }
});