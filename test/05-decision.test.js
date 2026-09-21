import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

describe('05 - decision y troubleshooting', () => {
  it('decide cluster para I/O-bound multi-server', async () => {
    const { decide } = await import('../src/decision.js');
    assert.equal(decide({ ioBound: true, needMultipleIdenticalServers: true, cpus: 4 }), 'cluster');
    assert.equal(decide({ ioBound: true, needMultipleIdenticalServers: true, cpus: 1 }), 'single-process');
  });

  it('decide worker_threads para CPU-bound', async () => {
    const { decide } = await import('../src/decision.js');
    assert.equal(decide({ cpuBound: true }), 'worker_threads');
    assert.equal(decide({ cpuBound: true, needSharedMemory: true }), 'worker_threads-shared');
  });

  it('decide single-process si no hay carga', async () => {
    const { decide } = await import('../src/decision.js');
    assert.equal(decide({}), 'single-process');
  });

  it('explainTradeoff menciona memoria y estado', async () => {
    const { explainTradeoff } = await import('../src/decision.js');
    assert.match(explainTradeoff('cluster'), /memoria|estado/i);
    assert.match(explainTradeoff('worker_threads'), /bloquea|hilos/i);
  });

  it('docs/errores existe', () => {
    const errors = fs.readFileSync('docs/errores.md', 'utf8');
    assert.match(errors, /Cosas que NO debo decir/i);
  });
});
