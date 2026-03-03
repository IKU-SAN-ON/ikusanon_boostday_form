# ikusanon_boostday_form

Next.js + Prisma application for collecting and viewing Boost Day availability data.

## Table of Contents
- [Versions](#versions)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [File Structure](#file-structure)
- [Browser Support](#browser-support)
- [Resources](#resources)
- [Reporting Issues](#reporting-issues)
- [FAQs](#faqs)
- [Licensing](#licensing)
- [Useful Links](#useful-links)

## Versions
- App: `0.1.0`
- Node.js: `>=20` (recommended)
- Package manager: `pnpm@10.30.1`
- Next.js: `16.1.6`
- React: `19.2.3`
- Prisma: `7.4.1`
- PostgreSQL: `15+` (Docker compose uses `postgres:15`)

## Quick Start
### 1) Install dependencies
```bash
pnpm install
```

### 2) Create environment file
Create `.env` in the project root (do not commit this file):

```env
DATABASE_URL=postgresql://...
POSTGRES_USER=<your_postgres_user>
POSTGRES_PASSWORD=<your_postgres_password>
POSTGRES_DB=<your_postgres_db>
```

A `.env.example` has been attached for reference.

### 3) Generate Prisma client and run migrations
```bash
pnpm prisma generate
pnpm prisma migrate dev # for development purpose
```

### 4) Start development server
```bash
pnpm run dev
```

Open: `http://localhost:3000`

### Optional: Run with Docker Compose
```bash
docker compose up --build
```

## Documentation

### Main Routes
- `GET /` — landing page
- `GET /input` — input entry page
- `GET /input/[token]` — token-based input page

### API Endpoints
Public endpoints
- `POST /api/v1/submit` — submit selected dates using token

Internal endpoints
- `POST /api/v1/internal/auth/tokengen` — generate token for a user (internal)
- `GET /api/v1/internal/boostday/viewall?year=<yyyy>&month=<1-12>` — fetch all users' dates for a month (internal)
- `GET /api/v1/internal/boostday/viewuser?userId=<id>&year=<yyyy>&month=<1-12>` — fetch one user’s dates (internal)

### Data Model (Prisma)
- `tokenSessions` table
	- `id`, `token`, `userId`, `expiresAt`
- `availabilities` table
	- `id`, `userId`, `date`, `createdAt`

View `prisma/schema.prisma` for details.

## File Structure
```text
.
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ public/
│  └─ images/
├─ src/
│  ├─ app/
│  │  ├─ api/v1/
│  │  │  ├─ internal/
│  │  │  │  ├─ auth/tokengen/route.ts
│  │  │  │  └─ boostday/
│  │  │  │     ├─ viewall/route.ts
│  │  │  │     └─ viewuser/route.ts
│  │  │  └─ submit/route.ts
│  │  ├─ input/
│  │  │  ├─ page.tsx
│  │  │  └─ [token]/
│  │  │     ├─ page.tsx
│  │  │     └─ InputPageClientSide.tsx
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  ├─ generated/prisma/
│  ├─ lib/
│  ├─ services/
│  └─ stores/
├─ docker-compose.yml
├─ Dockerfile
├─ next.config.ts
└─ package.json
```

## Browser Support
This project uses the following browser target from `package.json`:

- `> 1%`

For best compatibility, use current stable versions of:
- Chrome
- Edge
- Firefox
- Safari

## Resources
- Framework: Next.js App Router
- ORM: Prisma
- Database: PostgreSQL
- Validation: Zod
- State management: Zustand
- Date UI: react-day-picker
- Styling: Tailwind CSS + daisyUI

## Reporting Issues
When reporting an issue, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error logs (with secrets redacted)
- Environment details (OS, Node.js version, browser)

Please never paste secrets (for example: full database URLs, tokens, or passwords) into issues.

## FAQs
### Q: Where should I put environment variables?
In a local `.env` file in the project root.

### Q: I changed `schema.prisma`. What should I run?
Run Prisma commands to generate client and apply migrations.

### Q: Which endpoints are internal-only?
All routes under `/api/v1/internal/*` are intended for internal use.

## Licensing
No license file is currently included in this repository.

## Useful Links
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs/
- Zod: https://zod.dev/
- Zustand: https://zustand.docs.pmnd.rs/
- Tailwind CSS: https://tailwindcss.com/docs
- daisyUI: https://daisyui.com/docs/intro/
