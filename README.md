# Best Player of All Time Quiz

A production-ready quiz app that uses the [Best Player of All Time](https://bestplayerofalltime.com) API. Reference implementation for football, basketball, and padel trivia.

**Live:** [quiz.bestplayerofalltime.com](https://quiz.bestplayerofalltime.com)

---

## What It Does

- **Start screen** – Choose sport, language, difficulty, and question count
- **Quiz flow** – One question at a time, shuffled answers, instant feedback
- **Explanations** – Each question shows an explanation after answering
- **Summary** – Final score with option to restart

The app fetches questions from the external API via a **secure server-side proxy**. The Bearer token is never exposed to the browser.

---

## Quick Start

```bash
git clone https://github.com/Holzinho/best-player-of-all-time-starter-quiz.git
cd best-player-of-all-time-starter-quiz

cp .env.example .env
# Edit .env: set QUIZ_API_BASE_URL and QUIZ_API_TOKEN

npm install
npm run dev
```

→ http://localhost:3000

---

## Environment Variables

### Required

| Variable | Description |
|----------|--------------|
| `QUIZ_API_BASE_URL` | API base URL, e.g. `https://bestplayerofalltime.com` |
| `QUIZ_API_TOKEN` | Bearer token. Request at [bestplayerofalltime.com/token-anfragen](https://bestplayerofalltime.com/token-anfragen) |

### Optional (client-safe)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | App name on start screen | "Best Player of All Time Quiz" |
| `NEXT_PUBLIC_DEFAULT_SPORT` | `football` \| `basketball` \| `padel` | `football` |
| `NEXT_PUBLIC_DEFAULT_LANG` | `en` \| `de` \| `fr` | `en` |
| `NEXT_PUBLIC_DEFAULT_COUNT` | Questions per quiz (1–50) | `10` |

---

## Secure Token Handling

**The Bearer token must never reach the browser.**

### Architecture

1. **Frontend** calls the internal route: `GET /api/questions?lang=de&sport=football&count=10`
2. **Internal route** (`src/app/api/questions/route.ts`) runs on the server
3. **Server** reads `QUIZ_API_TOKEN` from `process.env` (server-only)
4. **Server** calls the external API with `Authorization: Bearer <token>`
5. **Server** returns the response to the frontend

The token is never in:
- `NEXT_PUBLIC_*` env vars
- Client-side JavaScript
- HTML
- Network requests from the browser

### Verification

- Search the codebase for `QUIZ_API_TOKEN` – it only appears in the API route
- Inspect browser Network tab – requests to the external API are not visible; only `/api/questions` is called

---

## Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

1. Copy env template:
   ```bash
   cp .env.example .env
   ```

2. Add your API token to `.env`:
   ```
   QUIZ_API_BASE_URL=https://bestplayerofalltime.com
   QUIZ_API_TOKEN=your_token_here
   ```

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000

---

## Vercel Deployment

1. **Import** the repo: [vercel.com](https://vercel.com) → New Project → Import
2. **Environment variables**: Project Settings → Environment Variables
   - `QUIZ_API_BASE_URL` = `https://bestplayerofalltime.com`
   - `QUIZ_API_TOKEN` = your token
3. **Deploy** – each push to `main` triggers a deploy

### Vercel CLI

```bash
npm i -g vercel
vercel login
vercel          # Preview
vercel --prod   # Production
```

---

## Docker

### Pre-built Image (empfohlen)

Das Image ist auf GitHub Container Registry (ghcr.io) verfügbar:

```bash
# Neueste Version
docker pull ghcr.io/holzinho/best-player-of-all-time-starter-quiz:latest

# Oder feste Version (Semver)
docker pull ghcr.io/holzinho/best-player-of-all-time-starter-quiz:1.0.0

docker run -p 3000:3000 \
  -e QUIZ_API_BASE_URL=https://bestplayerofalltime.com \
  -e QUIZ_API_TOKEN=your_token \
  ghcr.io/holzinho/best-player-of-all-time-starter-quiz:latest
```

Mit `.env`-Datei:

```bash
docker pull ghcr.io/holzinho/best-player-of-all-time-starter-quiz:latest
docker run -p 3000:3000 --env-file .env ghcr.io/holzinho/best-player-of-all-time-starter-quiz:latest
```

### Verfügbare Image-Tags

| Tag | Beschreibung |
|-----|--------------|
| `:latest` | Neueste Version |
| `:1.0.0` | Feste Version (Semver) |

### Image selbst bauen

```bash
docker build -t best-player-quiz .
docker run -p 3000:3000 --env-file .env best-player-quiz
```

### Docker Compose

```bash
cp .env.example .env
# Edit .env with your token

docker compose up -d
```

---

## Project Structure

```
src/
├── app/
│   ├── api/questions/route.ts   # Secure proxy to external API
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── QuizFlow.tsx             # Main quiz state machine
│   ├── QuizStart.tsx            # Config + start CTA
│   ├── QuizQuestion.tsx         # Question card + answers
│   └── QuizSummary.tsx          # Final score
├── lib/
│   ├── quiz-config.ts           # Sports, languages, defaults
│   └── shuffle.ts               # Answer shuffle (preserves correct mapping)
└── types/
    └── quiz.ts                  # API types
```

---

## API Reference

The app uses the Best Player of All Time API:

- **Endpoint:** `GET /api/questions`
- **Auth:** Bearer token (via server-side proxy)
- **Params:** `lang`, `sport`, `difficulty`, `count`

See [bestplayerofalltime.com](https://bestplayerofalltime.com) for full API docs.

---

## License

MIT – see [LICENSE](LICENSE).
