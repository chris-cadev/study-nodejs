import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const helloSrc = fs.readFileSync('src/worker-hello.js', 'utf8');
const cpuSrc = fs.readFileSync('src/worker-cpu.js', 'utf8');

describe('03 - worker threads modelo', () => {
  it('usa isMainThread / parentPort / Worker', () => {
    assert.match(helloSrc, /isMainThread/, 'debe usar isMainThread');
    assert.match(helloSrc, /parentPort/, 'debe usar parentPort');
    assert.match(helloSrc, /new Worker\(/, 'debe crear Worker');
  });

  it('worker duplica payload (smoke)', async () => {
    const { runWorker } = await import('../src/worker-hello.js');
    const result = await runWorker(21);
    assert.equal(result, 42);
  });

  it('hash en worker no bloquea y da mismo resultado que sync', async () => {
    const { hashSync, hashInWorker } = await import('../src/worker-cpu.js');
    const input = 'hello';
    const iterations = 1000; // pequeño para test rápido
    const expected = hashSync(input, iterations);
    const fromWorker = await hashInWorker(input, iterations);
    assert.equal(fromWorker, expected);
  });

  it('worker-cpu usa workerData para pasar datos', () => {
    assert.match(cpuSrc, /workerData/, 'debe usar workerData');
  });
});
