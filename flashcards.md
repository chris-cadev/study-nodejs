# Flashcards 01 — Cluster modelo (Quizlet-ready: Tab + Enter)

Copiar/pegar en https://quizlet.com → Create Set → Import → Tab + New line. Formato: `Pregunta<TAB>Respuesta`.

## Nivel Bajo — Para explicar a gente no técnica / intuición

[Bajo] ¿Cómo explicarías qué hace `node:cluster` a alguien no técnico?	Imagina un restaurante con 1 cocina (1 core) y 8 mesas esperando. Cluster abre 1 cocina por core (8 cocinas) que comparten la misma puerta; el encargado (Primary) reparte clientes, si una cocina se incendia abre otra.
[Bajo] ¿Qué problema resuelve cluster en una frase para tu abuela?	Que Node solo usa una cocina aunque tu ordenador tenga 8; cluster usa las 8 a la vez sin que los clientes esperen.
[Bajo] ¿Qué es el Primary y qué son los Workers en analogía?	Primary = encargado que no cocina, solo vigila y reparte. Workers = cocineros, cada uno con su cocina (V8/EventLoop) que sí atienden pedidos.
[Bajo] ¿Qué pasa si un Worker se cae?	El encargado se entera (evento exit) y abre otra cocina (fork) — el restaurante sigue abierto, solo pierdes una cocina un momento.
[Bajo] ¿Por qué no es magia “más cocinas = más rápido siempre”?	Si el cuello es la despensa (DB/red) no importa cuántas cocinas tengas; si es amasar a mano (CPU) mejor otra técnica (hilos).

## Nivel Medio — Entrevista técnica (qué, diferencia, cuándo)

[Medio] ¿Qué problema resuelve `node:cluster` técnicamente?	Node corre en 1 hilo/1 core. Cluster crea 1 proceso por core que comparte el puerto; Primary hace fork y reparte conexiones con round-robin. Sin cluster desaprovechas N-1 cores.
[Medio] ¿Qué hace `cluster.fork()` internamente?	`child_process.fork()`: crea proceso hijo OS con su propio V8 y EventLoop. Primary coordina, workers aceptan requests. No comparten memoria.
[Medio] ¿Por qué `listen(3000)` en todos los workers no da EADDRINUSE?	Node en `SCHED_RR` (default) hace que Primary acepte y distribuya el handle; no son 3 binds independientes. Con `SCHED_NONE` el SO reparte.
[Medio] ¿`cluster.isPrimary` vs `isMaster`?	`isPrimary` es el nombre actual (desde Node 16). `isMaster` es alias deprecado — decir `isMaster` delata docs viejos (EOL Node 20).
[Medio] ¿`availableParallelism()` vs `os.cpus().length`?	`availableParallelism()` (estable Node 19+, recomendado docs 22/24/26) respeta cgroups/containers; `cpus().length` cuenta cores físicos pero miente en Docker/K8s con limits.
[Medio] ¿Cuándo usarías cluster?	API HTTP I/O-bound que satura 1 core y deploy en VM sin orquestador (o demo de entrevista). N = availableParallelism().
[Medio] ¿Cuándo NO usarías cluster?	1 core basta, bottleneck es DB/red, CPU-bound puro (mejor worker_threads), o ya escalas con K8s replicas (1 proceso por pod + HPA).

## Nivel Alto — Profundo / Troubleshooting

[Alto] ¿Qué trade-off introduce cluster?	+ Throughput multi-core sin Nginx, − N× RAM (cada worker duplica V8), sin estado compartido, debugging N PIDs, necesita `SIGTERM→server.close` y `cluster.on('exit')`.
[Alto] ¿Qué pasa si guardas sesiones en memoria con cluster?	Cada worker tiene su heap; round-robin te manda a otro worker y pierdes sesión → necesitas Redis/DB o JWT stateless.
[Alto] ¿Cómo harías graceful shutdown en cluster?	Worker: `process.on('SIGTERM', () => server.close(() => process.exit(0)))`; Primary: `cluster.on('exit', () => cluster.fork())` para reponer. En K8s: `SIGTERM → 30s grace → SIGKILL`.
[Alto] ¿Por qué WebSocket se cae con cluster?	Round-robin rompe conexiones stateful; necesitas sticky sessions (mismo cliente → mismo worker) o Redis adapter.
[Alto] ¿Cluster vs PM2 vs K8s replicas — cuándo cada uno?	Cluster nativo = demo/control total; PM2 ` -i max` = prod en 1 máquina con reload/monitor; K8s replicas = prod distribuido con HPA — no uses PM2 dentro de Docker en K8s (3 supervisores).
