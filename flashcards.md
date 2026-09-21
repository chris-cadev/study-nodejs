# Flashcards

> Copiar/pegar en https://quizlet.com → Create Set → Import → Tab + New line
> Formato: Pregunta<TAB>Respuesta — nivel al inicio.

## Nivel Bajo — Para no técnicos / intuición

[Bajo] ¿Cómo explicarías el pool de Workers a alguien no técnico?	Como tener 4 ayudantes fijos en la cocina en lugar de contratar uno nuevo por cada pedido; los reutilizas y no pagas el coste de buscar y formar cada vez.
[Bajo] ¿Por qué crear un Worker por pedido es caro?	Contratar y formar a alguien para un solo plato y despedirlo enseguida — pierdes tiempo y dinero; mejor tener equipo fijo.
[Bajo] ¿Qué hace un pool en una frase?	Mantiene N ayudantes listos (N = cores) y les reparte tareas sin crear/destruir hilos cada vez.

## Nivel Medio — Entrevista técnica

[Medio] ¿Por qué no crear un `new Worker` por request?	Overhead de crear hilo (memoria, V8) excede beneficio si son muchas tareas cortas — docs oficiales dicen “use a pool”.
[Medio] ¿Qué es `piscina` / `tinypool` y cuándo usarlos?	`piscina` (5k★, configurable min/max) y `tinypool` (fork minimal 38KB para Vitest, 12M descargas) — pools prod que evitan crear Worker por request, con N = availableParallelism().
[Medio] ¿Cómo funciona `SimplePool` del repo?	Crea `new Worker(url, {workerData})` por tarea y resuelve con `w.on('message')`, luego `w.terminate()`. Versión simple sin queue; prod usa `piscina` con `maxQueue`.
[Medio] ¿Qué es `availableParallelism()` vs `cpus().length` para pool size?	Igual que en cluster: `availableParallelism()` respeta cgroups/K8s limits, `cpus().length` miente en containers.
[Medio] ¿Cuándo usarías pool vs `new Worker` puntual?	Muchas tareas CPU cortas → pool N=cpus; 1 tarea larga puntual → `new Worker` directo.

## Nivel Alto — Profundo / Troubleshooting

[Alto] ¿Qué trade-off introduce un pool?	+ Reutiliza hilos, − complejidad, memory sharing con cuidado, `maxThreads`/`maxQueue` mal configurados causan thrashing o cola infinita.
[Alto] ¿Qué pasa si olvidas `w.terminate()` en SimplePool?	Fuga de hilos — cada `run` deja un Worker vivo, memoria crece y `getPoolSize()` miente.
[Alto] ¿Cómo probar que `fibInWorker` no bloquea?	`setInterval(()=>process.stdout.write('tick '),100)` mientras haces `hashSync` (pausa ticks) vs `hashInWorker` (ticks siguen).
[Alto] ¿Qué librería recomiendas en entrevista y por qué?	`piscina` si necesitas control fino, `tinypool` si quieres minimal (usada por Vitest) — ambas evitan el anti-patrón de Worker por request.
