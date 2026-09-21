import { Worker } from 'node:worker_threads';
import os from 'node:os';

export class SimplePool {
  constructor(size = 2, workerUrl = new URL('./offload.js', import.meta.url)) {
    this.size = size;
    this.workerUrl = workerUrl;
  }

  run(payload) {
    // TODO: crea un Worker con el payload y resuelve con su mensaje
    return Promise.reject(new Error('not implemented'));
  }
}

export function getPoolSize() {
  // TODO: retorna número de CPUs disponibles
  return 0;
}
