# Verificación de fidelidad

Contenido verificado contra docs oficiales Node 22/24/26 (2026-09-19):

- `isPrimary` (no `isMaster` deprecado v16) ✓
- `availableParallelism()` (estable Node 19+, recomendado docs 22/24/26) ✓
- `cluster.fork()` usa `child_process.fork()` ✓
- `SCHED_RR` default en Linux ✓
- Worker threads: isMainThread, parentPort, workerData, SharedArrayBuffer ✓
- Pool: piscina 5.2k★, tinypool 38KB ✓
- PM2 cluster mode: -i max, exec_mode cluster ✓
- Graceful: SIGTERM → server.close → exit(0) ✓
- K8s: 1 proceso por pod + HPA, no cluster dentro ✓
