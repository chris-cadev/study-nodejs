import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const offloadSrc = fs.readFileSync('src/offload.js', 'utf8');
const poolSrc = fs.readFileSync('src/pool.js', 'utf8');

describe('04 - offload y pool', () => {
  it('offload usa workerData y parentPort', () => {
    assert.match(offloadSrc, /workerData/, 'debe usar workerData');
    assert.match(offloadSrc, /parentPort\.postMessage/, 'debe responder con parentPort');
  });

  it('fib en worker da mismo resultado que sync', async () => {
    const { fibSync, fibInWorker } = await import('../src/offload.js');
    const n = 20; // pequeño para test rápido
    assert.equal(await fibInWorker(n), fibSync(n));
    assert.equal(await fibInWorker(10), 55);
  });

  it('pool expone getPoolSize = cpus', async () => {
    const { getPoolSize } = await import('../src/pool.js');
    const os = await import('node:os');
    assert.equal(getPoolSize(), os.cpus().length);
  });

  it('pool run resuelve via worker', async () => {
    const { SimplePool } = await import('../src/pool.js');
    const pool = new SimplePool(2);
    const result = await pool.run(10); // fib 10 = 55
    assert.equal(result, 55);
  });

  it('pool usa Worker', () => {
    assert.match(poolSrc, /new Worker\(/, 'debe usar Worker');
  });
});
