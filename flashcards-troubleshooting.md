# Flashcards troubleshooting — Reference (Quizlet, Tab-separated)

> **Diátaxis: Reference** · *information-oriented* · Sin narrativa. Para practicar trade-offs rápido. Si buscas entender por qué cada trade-off existe → `05-decision-troubleshooting.md` (Explanation).

¿Qué trade-off introduce cluster?	+Throughput multi-core, -N× memoria V8, debugging complejo, sin estado compartido, necesita graceful shutdown y exit handler.
¿Qué problema aparece si no manejas SIGTERM en workers?	Deploy/reload corta conexiones a mitad → 502. Con server.close() drenas.
¿Cuándo NO usar cluster?	1 core basta, CPU-bound puro (mejor worker_threads), o si ya escalas con K8s replicas.
¿Cuándo NO usar worker_threads?	Tarea I/O simple o 1 core basta; crear hilos tiene overhead.
¿Qué pasa si guardas sesiones en memoria con cluster?	Cada worker ve solo sus sesiones (round-robin te manda a otro) → necesitas Redis/JWT.
¿Por qué WebSocket se desconecta con cluster?	Round-robin rompe stateful; necesitas sticky sessions o Redis adapter.
¿Cluster vs PM2 vs K8s replicas?	Cluster nativo demo, PM2 prod en 1 máquina con reload, K8s replicas prod distribuido con HPA.
¿Qué error es usar isMaster?	Deprecado desde Node 16, usa isPrimary. Te marca como desactualizado.
