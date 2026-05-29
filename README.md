# JIGSAW: SURVEILLANCE ENGINE

A full-stack psychological horror decision simulator. Subjects are placed into trap scenarios, decisions are scored by a Jigsaw-style engine, and every judgment is stored in a local SQLite evidence archive.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- Node.js + Express + TypeScript
- Prisma ORM
- SQLite

## Setup

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend: `http://127.0.0.1:5173`

Backend: `http://127.0.0.1:4000`

## API

- `GET /api/scenarios` fetches all trap scenarios.
- `POST /api/decide` stores and returns a scored decision.
- `POST /api/history` returns the persistent case file archive.

The SQLite database is stored at `server/prisma/dev.db`.
