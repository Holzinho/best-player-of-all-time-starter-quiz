# Best Player of All Time Quiz – Projekt-Snapshot

**Stand:** Aktuell im Repo vorhanden und funktionsfähig.

---

## Projektstruktur

```
best-player-of-all-time-starter-quiz/
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── LICENSE
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── public/
│   └── .gitkeep
└── src/
    └── app/
        ├── globals.css
        ├── layout.tsx
        └── page.tsx
```

---

## Alle Dateien (zum Kopieren)

### `package.json`

```json
{
  "name": "best-player-of-all-time-quiz",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "typescript": "^5.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

### `.env.example`

```env
# =============================================================================
# Best Player of All Time Quiz – Environment Variables
# =============================================================================
# Copy this file to .env and fill in your values:
#   cp .env.example .env
#
# Never commit .env to version control. See README for secure token handling.
# =============================================================================

# -----------------------------------------------------------------------------
# Application
# -----------------------------------------------------------------------------
# Base URL of your app (for links, redirects). Required for production.
NEXT_PUBLIC_APP_URL=http://localhost:3000

# -----------------------------------------------------------------------------
# Optional: External APIs (e.g. for player data, images)
# -----------------------------------------------------------------------------
# API_KEY=your_api_key_here

# -----------------------------------------------------------------------------
# Optional: Database (if you add persistence)
# -----------------------------------------------------------------------------
# DATABASE_URL=postgresql://user:password@localhost:5432/quiz

# -----------------------------------------------------------------------------
# Optional: Authentication / Secure Tokens
# -----------------------------------------------------------------------------
# Used for signing sessions, CSRF tokens, etc. Generate with: openssl rand -base64 32
# AUTH_SECRET=your_32_char_secret_here
```

### `Dockerfile`

```dockerfile
# =============================================================================
# Best Player of All Time Quiz – Production Dockerfile
# =============================================================================
# Build:  docker build -t best-player-quiz .
# Run:    docker run -p 3000:3000 --env-file .env best-player-quiz
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies & Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only for smaller image)
RUN npm ci

# Copy source
COPY . .

# Build (Next.js standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### `docker-compose.yml`

```yaml
# =============================================================================
# Best Player of All Time Quiz – Docker Compose (optional)
# =============================================================================
# Usage:  docker compose up -d
# Logs:   docker compose logs -f
# Stop:   docker compose down
# =============================================================================
# Requires: .env file in project root (cp .env.example .env)
# =============================================================================

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
```

### `.gitignore`

```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Build
.next
out
dist
build

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea
.vscode
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel
```

### `.dockerignore`

```dockerignore
# Dependencies
node_modules
.pnp
.pnp.js

# Build output
.next
out
dist

# Environment (never bake secrets into image)
.env
.env.*
!.env.example

# Git
.git
.gitignore

# IDE & OS
.idea
.vscode
.DS_Store

# Docs & misc
README.md
LICENSE
*.md

# Docker
Dockerfile
docker-compose*.yml
.dockerignore
```

### `eslint.config.mjs`

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals")];

export default eslintConfig;
```

### `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

### `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Best Player of All Time Quiz",
  description: "Test your knowledge of the greatest players ever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
```

### `src/app/page.tsx`

```tsx
export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Best Player of All Time Quiz</h1>
      <p>Willkommen! Die App läuft erfolgreich.</p>
      <p>
        <small>
          App URL: {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        </small>
      </p>
    </main>
  );
}
```

### `src/app/globals.css`

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
}
```

### `public/.gitkeep`

(Leere Datei – hält den Ordner im Git)

---

## Schnellstart

```bash
git clone <repo>
cd best-player-of-all-time-starter-quiz
cp .env.example .env
npm install
npm run dev
```

→ http://localhost:3000

---

## Verifizierte Befehle

| Befehl | Status |
|--------|--------|
| `npm install` | ✓ |
| `npm run dev` | ✓ |
| `npm run build` | ✓ |
| `npm start` | ✓ |
| `npm run lint` | ✓ |
| `docker build -t best-player-quiz .` | ✓ (Dockerfile valide) |
| `docker compose up -d` | ✓ (Compose valide) |
