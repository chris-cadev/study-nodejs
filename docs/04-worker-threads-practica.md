# 04 — Worker Threads con pool (sin bloquear el loop en prod)

Asume que hiciste `03` (ya creaste un Worker). **Vas a evitar crear un Worker por request usando un pool.**

**Qué lograrás:** mover `fib(35)` sin bloquear y usar `SimplePool` para no pagar el coste de crear hilos cada vez. Verificación: `npm test` 5/5 + `tick` sigue vivo.

---

## 0. Comprueba dónde estás

```bash
git branch --show-current  # 04_worker-threads-practica
npm test
# Esperas: 5 tests en rojo (✖ offload, ✖ pool) — es TDD, es normal.
# Si ves 5 verde, ya está resuelto (mira git diff 04..05).
```

> No ejecutes el benchmark todavía — aún no hay pool.

## 1. Abre y completa el esqueleto

```bash
cat src/offload.js  # verás 2 TODOs (fibInWorker + worker)
cat src/pool.js     # verás 2 TODOs (SimplePool + getPoolSize)
```

**TODO 1 — `src/offload.js` → `fibInWorker`:**
Abre `src/offload.js` y completa `fibInWorker(n)` como hiciste en `03`, pero ahora con `fibSync`:
```js
export function fibInWorker(n) {
  return new Promise((resolve, reject) => {
    const w = new Worker(new URL(import.meta.url), { workerData: n });
    w.on('message', resolve);
    w.on('error', reject);
    w.on('exit', (code) => { if (code !== 0) reject(new Error(`exit ${code}`)); });
  });
}
if (!isMainThread) {
  const result = fibSync(workerData);
  parentPort.postMessage(result);
}
```
*Necesitas:* `import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';` (ya está).

**TODO 2 — `src/pool.js` → `SimplePool`:**
Abre `src/pool.js` y completa `SimplePool.run(payload)` y `getPoolSize()`:
```js
export class SimplePool {
  run(payload) {
    return new Promise((resolve, reject) => {
      const w = new Worker(this.workerUrl, { workerData: payload });
      w.on('message', (msg) => { resolve(msg); w.terminate(); });
      w.on('error', (err) => { reject(err); w.terminate(); });
    });
  }
}
export function getPoolSize() {
  return typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;
}
```

**Pista:** no implementes queue sofisticada — para entrevista basta explicar "pool > crear Worker por request" (ver `cluster-vs-worker.md`).

> Si te atascas, `npm test` te dice qué falta (`workerData`, `parentPort`, `getPoolSize`). No mires `05` todavía.

## 2. Verifica

```bash
npm test
# Esperas: 5/5 verde (✔ offload, ✔ pool, ✔ getPoolSize)
```

**Solo cuando esté verde**, sigue.

## 3. Ejecuta y observa

```bash
# Siente el no-bloqueo:
node -e "
import { fibSync } from './src/offload.js';
import { fibInWorker } from './src/offload.js';
setInterval(()=>process.stdout.write('tick '),100);
console.time('sync'); fibSync(35); console.timeEnd('sync');
console.time('worker'); await fibInWorker(35); console.timeEnd('worker');
"
# Observa: `sync` pausa ticks, `worker` no.

# Prueba el pool:
node -e "
import { SimplePool } from './src/pool.js';
const pool = new SimplePool();
console.log('pool size', pool.size);
const r = await pool.run(10); console.log('fib 10 =', r); // 55
"
```

**Qué observar:**
- Crear un Worker por request es caro — `pool` reutiliza.
- `SharedArrayBuffer` + `Atomics` es avanzado, no lo necesitas para entrevista.

## 4. Siguiente paso

```bash
git diff  # mira tu pool
git switch 05_decision-troubleshooting  # hereda tu pool, empieza decisión
```
Si quieres ver la solución completa: `git diff 04_worker-threads-practica..05_decision-troubleshooting -- src/offload.js`.

> **Contexto mínimo:** en prod usa `piscina`/`tinypool` con `N = availableParallelism()`, `maxQueue ≈ maxThreads²`. Aquí usamos `SimplePool` para no añadir deps.

## Push y PR

```bash
git switch -c 04_mi-solucion
# ... escribe hasta verde ...
git add -A \&\& git commit -m "feat: 04 completado"
git push -u origin 04_mi-solucion
gh pr create --base 04_worker-threads-practica --title "04 completado" --body "npm test pasa"
# CI verifica → ✅ mergea, ❌ arregla
```
