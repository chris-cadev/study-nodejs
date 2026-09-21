# Por qué estas trampas delatan falta de criterio (y cómo evitarlas)

> **Diátaxis: Explanation** · *understanding-oriented* · No es lista de comandos ni tutorial. Explica **por qué** estas frases suenan mal en entrevista y qué confusión revelan. Si buscas qué decir en 30s → `respuestas-30s.md` (How-to); si buscas dato exacto → `cheat-sheet.md` (Reference).

## Cosas que NO debo decir — y por qué delatan

- **"Cluster crea hilos" → son procesos.** Revela que no distingues `cluster` (procesos, memoria aislada, V8 duplicado) vs `worker_threads` (hilos, `SharedArrayBuffer`). El entrevistador preguntará por `isPrimary` vs `isMainThread` y te atrapará.
- **"Con cluster va N veces más rápido"** → solo si el cuello es CPU de Node. Si es DB/red, más workers solo duplica memoria. Muestra que no has perfilado.
- **"Uso cluster dentro de Docker y K8s sin motivo"** → 3 supervisores (cluster + PM2 + K8s) compiten. El estándar 2025 es 1 proceso por pod + HPA — ver `VERIFICACION.md`.
- **"Worker threads comparten memoria automáticamente"** → solo con `SharedArrayBuffer` + `Atomics`, no por defecto. `workerData` se clona (structured clone).
- **"isMaster"** → deprecado desde Node 16, usa `isPrimary`. Delata docs viejos (ver `nodejs.org/api/cluster`).

## Confusiones comunes — contexto

- `cluster.schedulingPolicy` (RR en primary) vs **sticky sessions** (capa para WebSockets stateful) — no son lo mismo; RR no resuelve sticky.
- `fork()` no comparte objetos → cada worker su heap, IPC es `process.send()` serializado, no referencia.
- Crear 100 workers "por si acaso" → más workers que `availableParallelism()` empeora por context switch.
- Olvidar `w.on('error')` en Worker → throw silencioso, el main sigue vivo pero la tarea se pierde.

> Este doc no te dice cómo corregir el código paso a paso — eso es How-to (`02`, `04`). Te da el marco para **entender** por qué cada error es grave y qué preguntará el entrevistador después.
