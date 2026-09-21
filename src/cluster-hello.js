import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

const PORT = Number(process.env.PORT) || 3000;
const isTestRun = process.argv.some(a => a.includes('--test') || a.includes('.test.js'));

// ── TODO 1: Primary vs Worker ─────────────────────────────────────
// Usa la propiedad correcta de cluster para saber si estás en el primary.
// Pista: no uses `isMaster` (deprecado en Node 16), busca en docs 22/24/26 cuál es la actual.
// Escribe: if (cluster.isPrimary && !isTestRun) { ... } else if (!cluster.isPrimary) { ... }

if (cluster.isPrimary && !isTestRun) { // ← cambia este `false` por la condición del TODO 1
  // ── TODO 2: En primary ─────────────────────────────────────────
  // - calcula n = availableParallelism() ?? cpus().length
  // - haz `for (let i=0; i<n; i++) cluster.fork()`
  // - maneja `cluster.on('exit', () => cluster.fork())` para re-lanzar
} else if (!cluster.isPrimary) {
  
}

// ── TODO 3: En worker ────────────────────────────────────────────
// Crea un servidor que responda `hello from ${process.pid}\n` y haz listen en PORT.
// Pista:
//   const server = http.createServer((req, res) => {
//     res.writeHead(200); res.end(`hello from ${process.pid}\n`);
//   });
//   if (!isTestRun) server.listen(PORT, () => console.log(`Worker ${process.pid} listening`));

export function getExpectedForkCount() {
  // ── TODO 4: retorna número de CPUs ─────────────────────────────
  // Pista: typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length
  return 0;
}
