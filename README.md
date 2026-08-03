# Luxusumzug Wien — static Next.js blog (luxusumzug.at)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- MDX blog posts (`content/blog/`)
- Static export (`output: 'export'`)
- Docker + Nginx on port **2009**

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:2009](http://localhost:2009).

Copy environment template:

```bash
cp .env.example .env
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 2009 |
| `npm run build` | Static export to `out/` |
| `npm run check:types` | TypeScript check |
| `npm run clean` | Remove `.next` and `out` |

## Docker

```bash
docker compose up -d --build
```

Site: [http://localhost:2009](http://localhost:2009)

## Content

Add posts as `.mdx` files in `content/blog/` with frontmatter:

```yaml
---
title: '...'
description: '...'
date: '2026-08-04'
slug: 'mein-artikel'
category: 'Ratgeber'
---
```

## GitHub setup

This project was rewritten from the MIT-licensed [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate). Point `origin` to **your** repository (do not push to the upstream boilerplate):

```bash
git remote remove origin
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

## License

MIT — see [LICENSE](./LICENSE).
