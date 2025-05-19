import { getRandomMatrix, makeUndirected } from "./matrix.js";
import { calculatePos } from './position.js';
import { drawGraph, highlightTraversal } from './draw.js';
import { bfsTraversal, dfsTraversal } from './traversal.js';

const canvas = document.getElementById('graph-canva');
const ctx = canvas.getContext('2d');

const seed = 4314;
const n = 11;
let isDirected = true;

const k_coefficient = 1.0 - 1 * 0.01 - 4 * 0.005 - 0.15;

let adjMatrix = getRandomMatrix(n, seed, k_coefficient);
let undirectedMatrix = makeUndirected(adjMatrix);

const positions = calculatePos(n, canvas.width, canvas.height);

drawGraph(ctx, adjMatrix, positions, isDirected);

function printMatrix(matrix, title) {
    console.log(`\n${title}`);
    matrix.forEach((row) => {
        console.log(row.join(" "));
    });
}

printMatrix(adjMatrix, "Directed Matrix:");
printMatrix(undirectedMatrix, "Undirected Matrix:");

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        isDirected = !isDirected;
        drawGraph(ctx, isDirected ? adjMatrix : undirectedMatrix, positions, isDirected);
    }

    if (e.code === 'KeyB') {
        const currentMatrix = isDirected ? adjMatrix : undirectedMatrix;
        const [tree, steps] = bfsTraversal(currentMatrix);
        highlightTraversal(ctx, currentMatrix, tree, steps, positions, isDirected, "bfs");
        printMatrix(tree, "BFS Tree Matrix:");
    }

    if (e.code === 'KeyD') {
        const currentMatrix = isDirected ? adjMatrix : undirectedMatrix;
        const [tree, steps] = dfsTraversal(currentMatrix);
        highlightTraversal(ctx, currentMatrix, tree, steps, positions, isDirected, "dfs");
        printMatrix(tree, "DFS Tree Matrix:");
    }
});
