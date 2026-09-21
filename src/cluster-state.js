// Demo del trade-off: estado en memoria no se comparte entre workers
// Cada worker tiene su propio `visits`. Round-robin → conteo inconsistente.
// Solución: externaliza a Redis/DB.

let visits = 0;

export function handleVisit() {
  return ++visits;
}

export function getVisits() {
  return visits;
}

export function resetVisits() {
  visits = 0;
}

// Ejercicio: ejecuta 2 workers con este contador y haz 4 curls.
// Verás 1,1,2,1 en lugar de 1,2,3,4 — eso demuestra el problema.
