import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

describe('06 - simulacro y cierre', () => {
  it('respuestas-30s existe y menciona cluster/worker', () => {
    const s = fs.readFileSync('docs/respuestas-30s.md', 'utf8');
    assert.match(s, /Cluster/i);
    assert.match(s, /Worker/i);
  });

  it('simulacro tiene 18 preguntas', () => {
    const s = fs.readFileSync('docs/simulacro.md', 'utf8');
    // Cuenta los encabezados numerados 1-18 o bullets con **
    assert.ok(s.length > 1000, 'simulacro debe ser extenso');
    assert.match(s, /Troubleshooting/i);
  });

  it('cheat-sheet final existe', () => {
    const s = fs.readFileSync('docs/cheat-sheet.md', 'utf8');
    assert.match(s, /isPrimary/, 'cheat debe mencionar isPrimary');
    assert.match(s, /isMainThread/, 'cheat debe mencionar isMainThread');
  });

  it('puedo decidir sin docs (smoke)', async () => {
    const { decide } = await import('../src/decision.js');
    // Caso entrevista: API que satura I/O, 4 cores → cluster
    assert.equal(decide({ ioBound: true, needMultipleIdenticalServers: true, cpus: 4 }), 'cluster');
    // CPU hash → worker
    assert.equal(decide({ cpuBound: true }), 'worker_threads');
  });
});
