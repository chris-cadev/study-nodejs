import { Worker } from 'node:worker_threads';
import { createHash } from 'node:crypto';

export function hashSync(input, iterations = 100000) {
  let out = input;
  for (let i = 0; i < iterations; i++) out = createHash('sha256').update(out).digest('hex');
  return out;
}

export function hashInWorker(input, iterations = 100000) {
  // TODO: lanza un Worker que haga hashSync y devuelva el resultado
  return Promise.reject(new Error('not implemented'));
}

// TODO: en el worker thread, haz hashSync con el dato recibido y responde
