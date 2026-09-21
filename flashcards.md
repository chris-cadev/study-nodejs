# Flashcards

> Copiar/pegar en https://quizlet.com → Create Set → Import → Tab + New line
> Formato: Pregunta<TAB>Respuesta — nivel al inicio.

## Nivel Bajo — Para no técnicos / intuición

[Bajo] ¿Cómo explicarías “simulacro de entrevista” a alguien no técnico?	Como ensayar una obra: practicas preguntas y respuestas en voz alta para que el día del estreno no te quedes en blanco.
[Bajo] ¿Qué es una “respuesta de 30 segundos”?	Contar en 30s qué hace una tecnología como si se lo contaras a un compañero, sin leer documentación, con naturalidad.
[Bajo] ¿Por qué practicar troubleshooting en voz alta?	Porque en entrevista no te piden código perfecto, sino que expliques cómo pensarías si algo se rompe.

## Nivel Medio — Entrevista técnica

[Medio] ¿Cómo responderías “¿Qué es cluster?” en 30s?	Node usa 1 hilo/1 core; cluster crea 1 proceso por core que comparte puerto, Primary reparte con round-robin, si uno muere lo repone. En prod uso PM2 o K8s replicas.
[Medio] ¿Cómo responderías “¿Cluster vs worker_threads?” en 30s?	Cluster = procesos aislados para escalar I/O; worker_threads = hilos mismo proceso para CPU con SharedArrayBuffer. I/O → cluster/PM2, CPU → worker.
[Medio] ¿Cómo responderías “¿Graceful shutdown?” en 30s?	`SIGTERM → server.close(() => process.exit(0))` para drenar requests, Primary hace `cluster.on('exit', fork)` para reponer. En K8s: 30s grace.
[Medio] ¿Cómo responderías “¿PM2 vs K8s?” en 30s?	PM2 `-i max` para 1 VM con reload; K8s replicas 1 proceso por pod con HPA para distribuido; no uses PM2 dentro de Docker en K8s.
[Medio] ¿Cómo practicarías el simulacro del repo?	`git switch 06`, cronometra 30-60s por pregunta en `docs/simulacro.md`, di la respuesta sin mirar `respuestas-30s.md`, luego compara con “Modelo”.

## Nivel Alto — Profundo / Troubleshooting

[Alto] ¿Qué busca el entrevistador con “mi app con cluster va igual y consume 4× RAM”?	Que sepas que cada worker duplica V8; si el cuello es DB/red, más workers no ayudan — perfila, no añadas cores a ciegas.
[Alto] ¿Qué busca con “WebSocket se cae con cluster”?	Que menciones sticky sessions o Redis adapter — round-robin rompe stateful.
[Alto] ¿Qué error delata “Cluster crea hilos”?	Confundir procesos (cluster, memoria aislada) con hilos (worker_threads, SharedArrayBuffer) — te cazan con `isPrimary` vs `isMainThread`.
[Alto] ¿Cómo sabes si estás listo para la entrevista sin releer la guía?	Sin docs, escribe `cluster-hello.js` de memoria, crea un Worker que duplica, decide cluster/worker/nada en 30s y dibuja primary/workers (ver Criterio de preparación en 06).
