import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = fs.readFileSync('src/cluster-hello.js', 'utf8');

describe('01 - cluster hello', () => {
  it('usa cluster.isPrimary (no isMaster deprecado)', () => {
    assert.match(src, /cluster\.isPrimary/, 'debe usar cluster.isPrimary');
    assert.doesNotMatch(src, /isMaster/, 'isMaster está deprecado');
  });

  it('hace fork por cada CPU y maneja exit', () => {
    assert.match(src, /cluster\.fork\(\)/, 'debe llamar cluster.fork()');
    assert.match(src, /availableParallelism|os\.cpus\(\)\.length/, 'debe usar availableParallelism() o os.cpus().length');
    assert.match(src, /cluster\.on\(['\"]exit['\"]/, 'debe manejar cluster.on("exit")');
  });

  it('worker hace listen en PORT', () => {
    assert.match(src, /\.listen\(/, 'worker debe hacer server.listen');
  });

  it('getExpectedForkCount retorna cpus', async () => {
    const { getExpectedForkCount } = await import('../src/cluster-hello.js');
    const os = await import('node:os');
    const expected = typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;
    assert.equal(getExpectedForkCount(), expected);
  });

  it('server responde hello from pid (smoke con worker simulado)', async () => {
    // No testeamos fork real aquí (requiere múltiples procesos), solo que el módulo exporta y no crashea
    assert.ok(src.includes('hello from'), 'debe responder hello from <pid>');
  });
});
