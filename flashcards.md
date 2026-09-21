# Flashcards

> Copiar/pegar en https://quizlet.com → Create Set → Import → Tab + New line
> Formato: Pregunta<TAB>Respuesta — nivel al inicio.

## Nivel Bajo — Para no técnicos / intuición

[Bajo] ¿Cómo explicarías “graceful shutdown” a alguien no técnico?	Como cerrar una tienda sin echar a los clientes que ya están dentro: atiendes a los que entraron, no dejas entrar a más, y luego bajas la persiana.
[Bajo] ¿Qué es un healthcheck `/health` en analogía?	Como el cartel “ABIERTO” en la puerta: si lo quitas, el centro comercial (K8s) deja de mandar gente a esa tienda.
[Bajo] ¿Por qué guardar sesiones en memoria es frágil con varias cocinas (workers)?	Cada cocina tiene su libreta; si vuelves y te atiende otra cocina, no encuentra tu pedido → necesitas libreta central (Redis).

## Nivel Medio — Entrevista técnica

[Medio] ¿Qué hace `server.close()` en graceful shutdown?	Deja de aceptar conexiones nuevas pero deja terminar las existentes; luego `process.exit(0)`. Sin esto, `kill` corta a mitad y da 502.
[Medio] ¿Cómo implementas graceful en Node con cluster?	Worker: `process.on('SIGTERM', () => server.close(() => process.exit(0)))` y `SIGINT`; Primary: `cluster.on('exit', () => cluster.fork())` para reponer.
[Medio] ¿Qué responde `GET /health` y para qué sirve?	`{status:'ok', pid}` con 200. Lo usa K8s/PM2 para saber si el worker está vivo y sacarlo del balanceo si falla.
[Medio] ¿PM2 ` -i max` vs `cluster` nativo vs K8s replicas?	`cluster` nativo = demo/control total; PM2 `-i max` = prod en 1 VM con reload/monitor; K8s replicas = 1 proceso por pod + HPA, no uses cluster dentro del container.
[Medio] ¿Cuándo usarías PM2 y cuándo K8s?	VM sin orquestador → PM2; K8s/ECS → Deployment replicas; entrevista/demo → cluster nativo.

## Nivel Alto — Profundo / Troubleshooting

[Alto] ¿Qué pasa si no manejas `SIGTERM`/`SIGINT` en worker?	Deploy/reload corta requests en vuelo → `ECONNRESET`/502. En K8s el flujo es `SIGTERM → 30s grace → SIGKILL`, debes drenar y cerrar DB/Redis con timeout de 10s.
[Alto] ¿Por qué `visits` en memoria no suma global con cluster?	Cada worker tiene su heap aislado; `let visits=0` cuenta por worker, round-robin da 1,1,2,1 en lugar de 1,2,3,4 → externaliza a Redis.
[Alto] ¿Qué es sticky sessions y cuándo lo necesitas?	Con WebSocket/Socket.io, round-robin rompe la conexión stateful; necesitas sticky (mismo cliente → mismo worker) o Redis adapter.
[Alto] ¿Por qué es anti-patrón PM2 dentro de Docker en K8s?	Tres supervisores compiten (cluster + PM2 + K8s kubelet) — complejidad, logs duplicados, healthchecks confusos. Estándar 2025: 1 proceso por pod, escala con `replicas`.
