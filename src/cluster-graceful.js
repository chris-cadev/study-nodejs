import cluster from 'node:cluster';
import http from 'node:http';

const PORT = Number(process.env.PORT) || 3001;

export function createServer(port = PORT) {
  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', pid: process.pid }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`hello from ${process.pid}\n`);
  });

  return server;
}

// TODO: implementa graceful shutdown
//   Escucha SIGTERM y SIGINT y haz server.close(() => process.exit(0))
//   Pista: process.on('SIGTERM', () => server.close(() => process.exit(0)))

const isTestRun = process.argv.some(a => a.includes('--test') || a.includes('.test.js'));
if (!isTestRun && !cluster.isPrimary) {
  const s = createServer();
  s.listen(PORT, () => console.log(`Worker ${process.pid} graceful on ${PORT}`));
}
