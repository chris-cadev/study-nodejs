# Respuestas de 30 segundos en entrevista

**Qué lograrás:** decir con naturalidad qué hace cada tecnología y cuándo NO usarla.

---

## 0. Comprueba dónde estás

```bash
git branch --show-current  # 06_simulacro-entrevista
npm test -- --test-name-pattern="respuestas-30s"
```

## 1. Escribe tus 4 respuestas

Reemplaza los TODOs por tus propias palabras:

**Cluster:** "Node usa 1 hilo/1 core; cluster crea 1 proceso por core que comparte puerto, Primary reparte con round-robin, si uno muere lo repone. En prod uso PM2 o K8s replicas."

**Worker Threads vs Cluster:** "Cluster = procesos aislados para escalar I/O; worker_threads = hilos mismo proceso para CPU con SharedArrayBuffer. I/O → cluster/PM2, CPU → worker."

**PM2:** "PM2 `-i max` levanta 1 worker por core, los vigila y hace reload sin downtime."

**Cuándo NO:** "No uso cluster si 1 core basta o ya escalo con K8s; no uso worker si la tarea es I/O simple."
