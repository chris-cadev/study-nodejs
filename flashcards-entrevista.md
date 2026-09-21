# Flashcards entrevista — Reference (Quizlet, Tab-separated)

> **Diátaxis: Reference** · *information-oriented* · Para repaso activo antes de entrevista. Pregunta<TAB>respuesta, sin pasos. Si buscas cómo responder narrativamente → `respuestas-30s.md` (How-to).

¿Por qué Node necesita cluster?	Node single-thread usa 1 core; cluster crea 1 proceso por core compartiendo puerto para usar todos los cores.
Cluster vs worker_threads vs child_process?	Cluster procesos idénticos I/O, worker_threads hilos mismo proceso CPU con memoria compartible, child_process procesos heterogéneos.
¿Por qué mismo puerto no da EADDRINUSE en cluster?	Primary pasa handle o SO hace RR; no son binds independientes.
¿Dónde guardas sesiones con cluster?	Redis/DB/JWT, no en memoria (cada worker su heap).
¿Cómo haces graceful shutdown?	process.on('SIGTERM', ()=> server.close(()=> process.exit(0))) + primary refork en exit.
¿Qué es PM2 cluster_mode?	Cluster gestionado: -i max, monitoreo, reload zero-downtime, logs centralizados.
¿Cuándo usar worker_threads?	CPU-bound (crypto, sort, parse) para no bloquear event loop; con pool si muchas tareas.
¿Qué trade-off introduce worker_threads?	+no bloquea, -complejidad, compartir memoria requiere SharedArrayBuffer+Atomics.
¿Cómo explicarías cluster en 30s?	Node 1 hilo 1 core → cluster 1 proceso por core compartiendo puerto, RR, refork si muere; en prod PM2/K8s.
¿Cómo explicarías worker_threads en 30s?	Hilos en mismo proceso que hacen CPU sin bloquear loop, comunican por postMessage.
