import { Worker } from 'node:worker_threads';

export function fibSync(n) {
  if (n <= 1) return n;
  return fibSync(n - 1) + fibSync(n - 2);
}

export function fibInWorker(n) {
  // TODO: lanza un Worker que calcule fibSync y devuelva el resultado
  return Promise.reject(new Error('not implemented'));
}

// TODO: en el worker thread, calcula y responde
