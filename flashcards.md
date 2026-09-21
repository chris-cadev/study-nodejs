# Flashcards

> Copiar/pegar en https://quizlet.com → Create Set → Import → Tab + New line
> Formato: Pregunta<TAB>Respuesta — nivel al inicio.

## Nivel Bajo — Para no técnicos / intuición

[Bajo] ¿Cómo explicarías “elegir entre cluster y worker” a alguien no técnico?	Como elegir entre abrir más sucursales (más locales) vs contratar ayudantes en la misma cocina: sucursales para más clientes, ayudantes para tareas pesadas.
[Bajo] ¿Qué es un trade-off en una frase?	No hay gratis: ganas algo (más velocidad) pero pagas otra cosa (más memoria, más complejidad).
[Bajo] ¿Por qué a veces “no hacer nada” es la mejor decisión?	Si una sola cocina ya atiende bien, abrir 7 más solo gasta luz y complica — a veces single-process es suficiente.

## Nivel Medio — Entrevista técnica

[Medio] ¿Árbol de decisión para cluster vs worker vs single?	¿Satura 1 core? No → single. Sí → ¿I/O (API) o CPU (cálculo)? I/O → cluster/PM2/K8s replicas; CPU → worker_threads (+ pool si muchas tareas).
[Medio] ¿Cuándo elegirías `cluster` nativo vs PM2 vs K8s?	VM sin orquestador → PM2 `-i max`; K8s/ECS → 1 proceso por pod + HPA; demo/entrevista → `cluster` nativo.
[Medio] ¿Qué es `SCHED_RR` vs `SCHED_NONE`?	`SCHED_RR` (default, Node reparte round-robin en primary), `SCHED_NONE` (deja al SO). En Windows cambia a RR cuando libuv lo soporte.
[Medio] ¿Cuándo usarías pool vs `new Worker` puntual?	Muchas tareas CPU cortas → pool `N=availableParallelism()` (piscina/tinypool); 1 tarea larga → `new Worker` directo.
[Medio] ¿Por qué no PM2 dentro de Docker en K8s?	Tres supervisores compiten (Node cluster + PM2 + kubelet) — logs duplicados, healthchecks confusos. Estándar: 1 proceso por pod.

## Nivel Alto — Profundo / Troubleshooting

[Alto] ¿Qué trade-off introduce cluster que delata novato?	+ Throughput I/O, − N× RAM (V8 duplicado), sin estado compartido (sesiones → Redis), debugging N PIDs, necesita `SIGTERM→close` + `exit` handler.
[Alto] ¿Qué trade-off introduce worker_threads?	+ No bloquea loop, hilos ligeros, − complejidad, `SharedArrayBuffer` solo con `Atomics`, `w.on('error')` silencia fallos, pool requerido.
[Alto] ¿Cómo debuggeas “WebSocket se cae con cluster”?	Round-robin rompe sticky; necesitas `sticky` (mismo cliente → mismo worker) o Redis adapter para pub/sub entre workers.
[Alto] ¿Cómo debuggeas “mi app con cluster va igual y consume 4× RAM”?	Cada worker duplica V8 y heap; si el cuello es DB/red, más workers no ayudan — perfila con `clinic`/`autocannon`, considera worker o caché.
[Alto] ¿Qué pasa si creas workers > `availableParallelism()` sin pool?	Thrashing por context switch, cola infinita, latencia peor. Pool con `maxThreads` y `maxQueue` evita.
