import {getRandomMatrix, makeUndirected} from "./matrix.js";
import { calculatePos } from './position.js';
import { drawGraph } from './draw.js';

const canvas = document.getElementById('graph-canva'); 
const ctx = canvas.getContext('2d');

const seed = 4314;
const n = 10 + 1;
let isDirected = true;

let directedMatrix = getRandomMatrix(n, seed);
let undirectedMatrix = makeUndirected(directedMatrix);

const positions = calculatePos(n, canvas.width, canvas.height);

drawGraph(ctx, directedMatrix, positions, isDirected);

function printMatrix(matrix, title) {
    console.log(`\n${title}`);
    matrix.forEach(row => console.log(row.join("  ")));
}

printMatrix(directedMatrix, "Directed Matrix:");
printMatrix(undirectedMatrix, "Undirected Matrix:");

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        isDirected = !isDirected;
        drawGraph(ctx, isDirected ? directedMatrix : undirectedMatrix, positions, isDirected);
    }
});