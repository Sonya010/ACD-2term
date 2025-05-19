export const randomGenerator = (seed, min = 0, max = 1) => {
    const modulus = 2 ** 31 - 2;
    const multiplier = 48271;
    return () => {
      seed = (multiplier * seed) % modulus;
      return seed / modulus * (max - min) + min;
    };
  };

export function getRandomMatrix(n, seed) { 
    let matrix = Array.from({ length: n }, () => Array(n).fill(0));
    let randomG = randomGenerator(seed, 0, 2.0);
    let k = 1.0 - 1 * 0.01 - 4 * 0.005 - 0.15; 

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = randomG() * k >= 1.0 ? 1 : 0;
        }
    }
    return matrix;
}

export function makeUndirected(matrix) {
  let n = matrix.length;
  let undirected = matrix.map(row => [...row]); 

  for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
          if (matrix[i][j] === 1 || matrix[j][i] === 1) {
              undirected[i][j] = undirected[j][i] = 1; 
          }
      }
  }
  return undirected;
}