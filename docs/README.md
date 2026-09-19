# Documentación — Sistema Diátaxis

> Esta guía no está organizada por capítulos, sino por **para qué vienes**. Diátaxis separa 4 necesidades distintas porque se contradicen: lo que sirve para aprender no sirve para consultar.

```mermaid
quadrantChart
    title Diátaxis — dónde estás
    x-axis Para hacer --> Para entender
    y-axis Estudio --> Consulta
    quadrant-1 Tutorial
    quadrant-2 How-to
    quadrant-3 Reference
    quadrant-4 Explanation
    Tutorial: [0.2, 0.8]
    How-to: [0.8, 0.8]
    Reference: [0.2, 0.2]
    Howto: [0.8, 0.2]
    Explanation: [0.8, 0.2]
```

| Si vienes a... | Ve a... | Diátaxis | Qué esperar |
|---|---|---|---|
| **Aprender haciendo**, sin saber nada del tema, guiado paso a paso | `01-modelo-cluster.md`, `03-modelo-worker-threads.md`, `04-worker-threads-practica.md` | **Tutorial** · *learning-oriented* | Te llevamos de la mano. Un camino concreto, sin opciones, con éxito garantizado al final. No asume nada, no lista alternativas. |
| **Resolver una tarea concreta** que ya entiendes | `02-cluster-produccion.md` (escalar/graceful), `simulacro.md` (ensayar entrevista), `respuestas-30s.md` (responder en 30s) | **How-to** · *task-oriented* | Objetivo claro. Pasos flexibles, asume que sabes lo básico. Sin explicar por qué — solo cómo. |
| **Consultar un dato exacto** sin leer narrativa | `cheat-sheet.md`, `recursos.md`, `flashcards*.md` | **Reference** · *information-oriented* | Seco, exhaustivo, consistente. Tablas y listas. Sin sorpresas, sin historia. Versión precisa (Node 20+, `isPrimary`). |
| **Entender por qué y cuándo**, contexto y trade-offs | `cluster-vs-worker.md`, `errores.md`, `05-decision-troubleshooting.md`, `VERIFICACION.md` | **Explanation** · *understanding-oriented* | Discursivo. Por qué existe, cuándo NO usar, qué cambia respecto al pasado, opinión fundamentada. No da pasos. |

## Fundamentos aplicados (no solo carpetas)

1. **Un documento, un propósito.** No mezclamos referencia exhaustiva dentro de un tutorial ni pasos dentro de una explicación. Si un tutorial necesita un dato, enlaza a Reference; no lo duplica.
2. **Audiencia explícita.** Cada doc declara arriba `Diátaxis: X · Para quien ...` y `Cuándo usarlo / Cuándo NO`.
3. **Tono coherente al propósito.**
   - Tutorial: segunda persona, presente, "vamos a", sin ramificaciones, verificable (`npm test` verde).
   - How-to: título empieza por "Cómo…", imperativo, asume `01/03` hechos.
   - Reference: nominal, sin verbos de acción, orden alfabético o por API, sin "deberías".
   - Explanation: narrativo, contextual, compara, cita fuentes (ver `VERIFICACION.md`).
4. **Mermaid solo donde aclara modelo mental.** No decora referencia.

## Cómo usar estos docs según Diátaxis

- **Primera vez (estudias 6h):** sigue Tutorials `01 → 03 → 04` en orden. No saltes a How-to.
- **Tarea puntual (deploy, entrevista):** ve directo a How-to, no releas Tutorials.
- **Duda rápida (API, puerto, SIGTERM):** Reference, 30s.
- **Decidir arquitectura:** Explanation, lee trade-offs y luego How-to para ejecutar.

> Si encuentras un doc que mezcla propósitos (ej. un tutorial que lista todas las opciones de `cluster.schedulingPolicy`), es un bug de documentación — abre issue.

## Cómo funcionan los tests (mejor práctica para no abrumar)

- **Por defecto aislados:** cada branch `NN` solo corre su propio ejercicio con `npm test` → `node --test test/0N*.test.js`. En `01` ves 5 tests, en `02` ves 4 tests, no 27. Esto sigue el principio Tutorial: un concepto a la vez, sin ruido de regresión.
- **Regresión opcional:** `npm run test:all` → `node --test` (todos los tests acumulados hasta ese branch). Úsalo al final del día o en CI para verificar que no rompiste lo anterior.
- **GitHub Actions:** `verify.yml` corre `npm test` (aislado) en cada push/PR — verde significa que completaste el ejercicio de ese branch, no que todo el repo está verde. Para CI completo cambia a `npm run test:all` si prefieres.

## ¿Dónde está la solución? (sin branches `_resolved`)

- **Branches `_resolved` eliminados** como pediste: ya no hay `01_modelo-cluster_resolved`. La solución de `01` vive en el **siguiente branch** `02` (porque `02` está basado en el commit que resolvía `01`). Con tests aislados, no necesitas re-ejecutar lo anterior.
- **Cómo ver la solución sin avanzar de hora:**
  ```bash
  git diff 01_modelo-cluster..02_cluster-produccion -- src/cluster-hello.js
  # o el commit intermedio que resolvía 01 (aún en historial):
  git log --all --oneline --grep="01.*resolv"  # muestra a9ecbcd
  git show a9ecbcd:src/cluster-hello.js
  ```
- **Recomendación:** si prefieres chuleta explícita, puedes recrear `_resolved` con `git switch -c 01_modelo-cluster_resolved 02_cluster-produccion^` — pero para enseñanza, menos branches = menos ruido (decisión tomada: repo minimal con 7 branches).

### Guiño — cómo revisar la solución sin hacer trampa 😉

> *Pista para curiosos:* cada `0N` está en rojo a propósito (TDD). Si te atascas, no abras el siguiente branch todavía — mira el historial con ojos de detective:

```bash
# 1. El siguiente branch ya esconde la respuesta (no necesitas _resolved)
git diff 01_modelo-cluster..02_cluster-produccion -- src/cluster-hello.js | head -40

# 2. El commit que resolvía 01 sigue ahí, aunque la rama se borró
git log --all --oneline --grep="resolv"  # ← guiño: busca "resolv"
# a9ecbcd 01_modelo-cluster_resolved — solución completa cluster hello (oculto)
git show a9ecbcd --stat                  # qué tocó la solución
git show a9ecbcd:src/cluster-hello.js    # la solución sin cambiar de branch

# 3. Para comparar tu intento con la solución sin moverte:
git diff HEAD -- src/cluster-hello.js    # tu avance
git diff HEAD..a9ecbcd -- src/cluster-hello.js  # lo que te falta

# 4. ¿Quieres la chuleta como branch de nuevo? Recréala al vuelo:
git switch -c 01_modelo-cluster_resolved a9ecbcd  # guiño: aún existe, solo sin nombre
```

> Diátaxis diría: esto es **Reference** para el docente, no para el estudiante en modo Tutorial. Si estás en `01` aprendiendo, evita el guiño hasta que `npm test` te haya dicho 2-3 veces que no. El siguiente branch `02` ya te dará la solución de todas formas cuando avances — la trampa está en mirar antes de intentarlo.
