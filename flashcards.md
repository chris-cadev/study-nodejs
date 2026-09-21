# Flashcards

> Copiar/pegar en https://quizlet.com → Create Set → Import → Tab + New line
> Formato: Pregunta<TAB>Respuesta — nivel al inicio.

## Nivel Bajo — Para no técnicos / intuición

[Bajo] ¿Cómo explicarías Worker Threads a alguien no técnico?	Como tener ayudantes en la misma cocina (mismo local) que amasan a mano sin bloquear al cocinero principal que atiende pedidos.
[Bajo] ¿Qué problema resuelve Worker Threads en una frase?	Que una tarea pesada (como calcular mucho) no congele toda la tienda; el ayudante la hace en paralelo y avisa cuando termina.
[Bajo] ¿Cuál es la diferencia entre proceso y hilo en analogía?	Proceso = local separado con su cocina; hilo = ayudante en el mismo local compartiendo mesa y herramientas.
[Bajo] ¿Qué pasa si no usas Worker para una tarea pesada?	Toda la tienda se pausa — nadie puede pedir hasta que termines de amasar.

## Nivel Medio — Entrevista técnica

[Medio] ¿Cuándo usarías `worker_threads` vs `cluster`?	`worker_threads` para CPU-bound (crypto, parse, fib) sin bloquear EventLoop; `cluster` para escalar I/O-bound (API) con procesos. Hilo vs proceso.
[Medio] ¿Qué hacen `isMainThread`, `parentPort`, `workerData` y `Worker`?	`isMainThread` dice si estás en el hilo principal; `parentPort.postMessage` responde al padre; `workerData` es el dato clonado que recibe el worker; `new Worker(file, {workerData})` lo crea.
[Medio] ¿Cómo se comunican main y worker?	Por mensajes: main hace `new Worker` y escucha `w.on('message', ...)`, worker hace `parentPort.postMessage(result)`. Datos se clonan (structured clone), no por referencia.
[Medio] ¿`workerData` se comparte o se clona?	Se clona. Para compartir memoria real necesitas `SharedArrayBuffer` + `Atomics`, no es automático.
[Medio] ¿Qué significa `w.on('error')` y `w.on('exit')`?	`error` captura throw dentro del worker; `exit` con código ≠0 indica fallo. Sin `on('error')`, el fallo se silencia.

## Nivel Alto — Profundo / Troubleshooting

[Alto] ¿Qué trade-off introduce worker_threads?	+ No bloquea loop, hilos ligeros, − complejidad, compartir memoria con cuidado, crear un Worker por request excede beneficio → usa pool.
[Alto] ¿Por qué `hashSync` bloquea pero `hashInWorker` no?	`hashSync` corre en el EventLoop principal; `hashInWorker` lo mueve a otro hilo, el loop sigue atendiendo `setInterval`/`request`.
[Alto] ¿Qué pasa si olvidas `parentPort.postMessage` en el worker?	El `Promise` en main nunca resuelve → timeout. El test `worker duplica` falla.
[Alto] ¿Worker Threads vs `child_process`?	`worker_threads` = hilos mismo proceso, memoria compartible, ideal CPU; `child_process` = procesos separados, memoria aislada, ideal para jobs heterogéneos (ej. un job + una API).
