// TODO: implementa decide() según los árboles de decisión
// - Si needMultipleIdenticalServers && ioBound && cpus>1 → 'cluster'
// - Si cpuBound && needSharedMemory → 'worker_threads-shared'
// - Si cpuBound → 'worker_threads'
// - Si no hay carga → 'single-process'

export function decide(opts = {}) {
  // TODO
  return 'unknown';
}

export function explainTradeoff(choice) {
  // TODO: retorna string que mencione trade-offs (memoria/estado para cluster, bloqueo/hilos para worker)
  return 'unknown';
}
