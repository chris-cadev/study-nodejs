
## Push y PR

```bash
git switch -c 06_mi-solucion
# ... escribe respuestas y simulacro ...
git add -A \&\& git commit -m "feat: 06 completado"
git push -u origin 06_mi-solucion
gh pr create --base 06_simulacro-entrevista --title "06 completado" --body "npm test pasa 4/4"
# CI verifica → ✅ mergea, ❌ arregla
```
