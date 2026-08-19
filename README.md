# Luxusumzug Wien — Next.js blog (luxusumzug.at)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- SQLite + Drizzle ORM (`data/luxusumzug.db`)
- Session-based admin panel (`/admin/`)
- Docker Node server on port **2009**

Existing MDX files in `content/blog/` are imported once when the database is empty. After that, posts are edited in the admin UI.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:2009](http://localhost:2009). Admin: [http://localhost:2009/admin/login/](http://localhost:2009/admin/login/).

`.env` must define `ADMIN_EMAIL`, `ADMIN_PASSWORD` (min. 12 characters) and `SESSION_SECRET` (min. 32 characters). Do not commit `.env`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 2009 |
| `npm run build` | Production build (standalone) |
| `npm run start` | Start production server on port 2009 |
| `npm run check:types` | TypeScript check |
| `npm run clean` | Remove `.next`, `out`, local db and uploads |

## Docker

```bash
docker compose up -d --build
```

Site: [http://localhost:2009](http://localhost:2009)

SQLite lives in `./data`, cover images in `./public/uploads`.

## Hero image

Replace `public/images/hero-header.webp` with your own header photo (recommended ~2000px wide). Keep the same filename.

## GitHub setup

This project was rewritten from the MIT-licensed [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate). Point `origin` to **your** repository (do not push to the upstream boilerplate):

```bash
git remote remove origin
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

## License

MIT — see [LICENSE](./LICENSE).
