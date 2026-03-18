# Maintainer Guide

Anleitung für Maintainer dieses Repositories.

---

## Automatische Veröffentlichung

GitHub Actions baut und veröffentlicht das Docker-Image automatisch:

| Aktion | Ergebnis |
|--------|----------|
| Push auf `main` | Image wird als `:latest` gepusht |
| Tag `v1.0.0` pushen | Image als `:latest`, `:v1.0.0`, `:1.0.0` + GitHub Release |

---

## Neues Release erstellen (Semver)

```bash
# Version in package.json erhöhen
npm run version:patch   # 0.1.0 → 0.1.1
npm run version:minor   # 0.1.0 → 0.2.0
npm run version:major   # 0.1.0 → 1.0.0

# Tag pushen – triggert Build + Release
git push origin --tags
```

Oder manuell:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Einmalig: Package öffentlich machen

Damit das Docker-Image ohne Login pullbar ist:

1. GitHub → **Packages** (rechts in der Repo-Ansicht)
2. Package `best-player-of-all-time-starter-quiz` öffnen
3. **Package settings** → **Change visibility** → **Public**
