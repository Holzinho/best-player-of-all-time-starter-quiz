# Best Player of All Time Quiz

Ein Quiz über die besten Spieler aller Zeiten. Next.js 15 + TypeScript.

---

## Quick Start (3 Schritte)

```bash
# 1. Repo klonen
git clone https://github.com/Holzinho/best-player-of-all-time-starter-quiz.git
cd best-player-of-all-time-starter-quiz

# 2. Env-Variablen setzen
cp .env.example .env
# .env bearbeiten und Werte eintragen (siehe unten)

# 3. Lokal starten
npm install
npm run dev
```

→ **http://localhost:3000**

---

## Lokales Setup

### Voraussetzungen

- **Node.js** 18+ (empfohlen: 20 LTS)
- **npm** oder **pnpm**

### Schritte

1. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

2. **Umgebungsvariablen**
   ```bash
   cp .env.example .env
   ```
   Öffne `.env` und trage die benötigten Werte ein (siehe [Env-Variablen](#umgebungsvariablen)).

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Produktions-Build testen**
   ```bash
   npm run build
   npm start
   ```

---

## Vercel Deployment

### Einmalige Einrichtung

1. **Projekt bei Vercel verbinden**
   - [vercel.com](https://vercel.com) → New Project → Import Git Repository
   - Repo auswählen und importieren

2. **Env-Variablen in Vercel setzen**
   - Project Settings → Environment Variables
   - Alle Variablen aus `.env.example` eintragen (Werte für Production)
   - `NEXT_PUBLIC_*` werden clientseitig exponiert – keine Secrets dort!

3. **Deploy**
   - Jeder Push auf `main` triggert automatisch einen Deploy
   - Oder manuell: `vercel --prod`

### Vercel CLI (optional)

```bash
npm i -g vercel
vercel login
vercel          # Preview
vercel --prod   # Production
```

---

## Docker

### Produktions-Image bauen und starten

```bash
# Image bauen
docker build -t best-player-quiz .

# Container starten (Port 3000)
docker run -p 3000:3000 --env-file .env best-player-quiz
```

Ohne `.env`-Datei (Werte direkt übergeben):

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
  best-player-quiz
```

### Docker Compose (optional)

```bash
# Mit .env aus dem Projektverzeichnis
docker compose up -d

# Logs anzeigen
docker compose logs -f
```

Siehe `docker-compose.yml` für die Konfiguration.

---

## Umgebungsvariablen

| Variable | Beschreibung | Erforderlich |
|----------|--------------|--------------|
| `NEXT_PUBLIC_APP_URL` | Basis-URL der App (z.B. `https://quiz.example.com`). Wird für Links und Redirects genutzt. | Ja (Production) |
| `API_KEY` | Optional: API-Key für externe Dienste (z.B. Spielerdaten). | Nein |
| `DATABASE_URL` | Optional: Datenbank-URL, falls Persistenz genutzt wird. | Nein |
| `AUTH_SECRET` | Optional: Geheimer Schlüssel für Sessions/CSRF. Mind. 32 Zeichen. | Nein (empfohlen bei Auth) |

### Client vs. Server

- **`NEXT_PUBLIC_*`**: Werden im Browser exponiert. **Keine Secrets** hier.
- **Ohne Präfix** (z.B. `API_KEY`, `AUTH_SECRET`): Nur serverseitig verfügbar, sicher für Secrets.

---

## Sichere Token-Behandlung

### Grundregeln

1. **`.env` nie committen** – steht in `.gitignore`.
2. **`.env.example`** – nur Platzhalter/Beispiele, keine echten Secrets.
3. **Secrets nur serverseitig** – keine API-Keys in `NEXT_PUBLIC_*`.

### Empfohlene Vorgehensweise

| Umgebung | Vorgehen |
|----------|----------|
| **Lokal** | `.env` lokal anlegen, Werte aus Passwort-Manager oder Team-Docs. |
| **Vercel** | Environment Variables in Project Settings setzen. |
| **Docker** | `--env-file .env` oder `-e VAR=value`; `.env` nicht ins Image kopieren. |

### Secret-Generierung

```bash
# 32-Byte Secret für AUTH_SECRET
openssl rand -base64 32
```

### Checkliste vor Production

- [ ] Keine Secrets in `NEXT_PUBLIC_*`
- [ ] `AUTH_SECRET` gesetzt, falls Auth genutzt wird
- [ ] `NEXT_PUBLIC_APP_URL` auf die echte Domain gesetzt
- [ ] `.env` nicht im Repo

---

## Projektstruktur

```
├── src/
│   └── app/           # Next.js App Router
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── .env.example       # Vorlage für Umgebungsvariablen
├── Dockerfile        # Produktions-Image
├── docker-compose.yml
├── next.config.ts
└── package.json
```

---

## Skripte

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Dev-Server (Hot Reload) |
| `npm run build` | Produktions-Build |
| `npm start` | Produktions-Server |
| `npm run lint` | ESLint |

---

## Lizenz

MIT – siehe [LICENSE](LICENSE).
