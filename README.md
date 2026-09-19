# Study Node.js — Clusters + Worker Threads

Guía intensiva **6 horas, 6 branches** · Documentada con **Diátaxis** (no por temas, sino por para qué vienes).

> **Cómo navegar esta doc:** no leas lineal. Ve a `docs/README.md` y elige según tu necesidad: *aprender* (Tutorial) / *resolver tarea* (How-to) / *consultar dato* (Reference) / *entender por qué* (Explanation). Cada doc declara su tipo arriba y cumple un solo propósito.

Evolución **aditiva**: `main → 01 → 02 → 03 → 04 → 05 → 06` — cada salto solo añade archivos/líneas.

## Cómo estudiar

```bash
git branch --all                 # ver las 6 horas
git switch 01_modelo-cluster     # hora 1
npm test                         # rojo al inicio → completa el TODO → verde
# cuando esté verde:
git switch 02_cluster-produccion # hora 2 (hereda todo de 01)
npm test
# ... hasta 06
```

**Regla aditiva:** cada salto `NN → NN+1` solo añade `src/*.js`, `test/*.test.js` o líneas en `docs/`. Los `README.md` y flashcards no se reescriben, se heredan.

## Branches (mapeados a Diátaxis)

| Branch | Diátaxis principal | Título | Foco 60min |
|--------|---|---|---|
| `01_modelo-cluster` | **Tutorial** | Modelo mental Cluster | Aprendes cluster de cero, guiado, éxito garantizado |
| `02_cluster-produccion` | **How-to** | Cluster en producción | Cómo llevar cluster a prod: graceful, PM2 |
| `03_modelo-worker-threads` | **Tutorial** | Modelo Worker Threads | Aprendes worker_threads sin asumir cluster profundo |
| `04_worker-threads-practica` | **Tutorial** | Práctica Worker Threads | Offload CPU con pool, sin bloquear loop |
| `05_decision-troubleshooting` | **Explanation** | Decisión y troubleshooting | Entiendes cuándo usar cada uno y por qué |
| `06_simulacro-entrevista` | **How-to** | Simulacro + cheat sheet | Cómo responder en entrevista (Reference: `cheat-sheet.md`) |

Cada branch tiene **su propio `package.json`** (heredado + scripts añadidos). Ver `docs/README.md:1` para el sistema completo.

## TDD / PR automatizado

- Cada branch trae `test/*.test.js` que falla hasta que completes el `// TODO` en `src/` (`npm test` aislado → solo ese branch, `npm run test:all` → todo).
- Local: `npm test` (usa `node --test` nativo, sin deps).
- Remoto: al hacer `push` o abrir PR (`01 → 02`, `02 → 03`, ... o `NN → main`), GitHub Actions corre `verify.yml` y marca ✅/❌.
- Flujo sugerido: completa hora `NN` → `git commit` → `git push -u origin NN_titulo` → abre PR a `NN+1` → verifica verde → merge → `git switch NN+1`.

> **Guiño 😉 — ¿atascado?** No hay branches `_resolved` visibles (se borraron a propósito). La solución está escondida en el siguiente branch: `git diff 01_modelo-cluster..02_cluster-produccion -- src/cluster-hello.js` o `git log --all --oneline --grep="resolv"` → `git show <hash>:src/...`. Ver `docs/README.md:54` para la chuleta completa sin hacer trampa antes de intentar.

## Flashcards → Quizlet

Todos los `flashcards.md` están en formato **tab-separated** listo para Quizlet:

1. Abre https://quizlet.com/ → Create Set → Import
2. Copia/pega el contenido de `flashcards.md` (o `docs/flashcards-*.md`)
3. Elige separador **Tab** entre término y definición, **nueva línea** entre tarjetas
4. Import

> Formato: `Pregunta<TAB>Respuesta` — ya viene así. También funciona con "Custom separators" → Tab.

## Recursos por tipo Diátaxis

- **Reference:** `docs/cheat-sheet.md` + `docs/recursos.md` (datos exactos, sin narrativa)
- **Explanation:** `docs/cluster-vs-worker.md` + `docs/errores.md` + `docs/VERIFICACION.md` (por qué y trade-offs verificados 2025-26)
- **Tutorial/How-to:** cada branch `docs/01-*.md` a `docs/06-*.md` (paso a paso)

Docs oficiales: `nodejs.org/api/cluster.html` y `nodejs.org/api/worker_threads.html`

## Cheat sheet (Reference)

Ver `docs/cheat-sheet.md` — Reference puro: seco, sin pasos ni historia. Léelo 5min antes de la entrevista.

## Criterio de preparación

Estás listo si sin docs puedes: (1) escribir `cluster-hello.js` de memoria, (2) crear un `Worker` que no bloquea, (3) decidir cluster vs worker vs nada en 30s. Ver `06_simulacro-entrevista` para simulacro completo.
