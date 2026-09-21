import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gracefulSrc = fs.readFileSync('src/cluster-graceful.js', 'utf8');
const stateSrc = fs.readFileSync('src/cluster-state.js', 'utf8');

// Filtra solo código (no comentarios ni TODOs)
function uncommentedCode(src) {
  return src.split('\n').filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('*')).join('\n');
}

describe('02 - cluster produccion', () => {
  it('tiene graceful shutdown en SIGTERM/SIGINT con server.close', () => {
    const code = uncommentedCode(gracefulSrc);
    assert.match(code, /process\.on\(['"]SIGTERM['"]/, 'debe manejar SIGTERM en código (no en comentario)');
    assert.match(code, /server\.close\(/, 'debe hacer server.close en código');
    assert.match(code, /process\.exit\(0\)/, 'debe salir limpio');
  });

  it('tiene healthcheck /health', () => {
    const code = uncommentedCode(gracefulSrc);
    assert.match(code, /\/health/, 'debe tener endpoint /health en código');
  });

  it('cluster-state demuestra estado aislado', async () => {
    const { handleVisit, getVisits, resetVisits } = await import('../src/cluster-state.js');
    resetVisits();
    assert.equal(handleVisit(), 1);
    assert.equal(handleVisit(), 2);
    assert.equal(getVisits(), 2);
    assert.ok(stateSrc.includes('visits'), 'debe usar variable visits');
  });

  it('createServer retorna un servidor funcional', async () => {
    const { createServer } = await import('../src/cluster-graceful.js');
    const server = createServer(0);
    assert.ok(server, 'debe retornar un servidor');
    assert.equal(typeof server.listen, 'function');
    assert.equal(typeof server.close, 'function');
  });
});
