import { Worker } from 'node:worker_threads';

export function runWorker(payload) {
  // TODO 1: crea un Worker pasando el payload al worker
  // TODO 2: escucha mensajes, errores y salida y resuelve/rechaza
  return Promise.reject(new Error('not implemented'));
}

// TODO 3: en el worker thread, duplica el dato recibido y responde
