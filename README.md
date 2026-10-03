# SaM Fit: No Excuses. Just Fitness.
React + Vite frontend, Express API, PostgreSQL via Prisma. Auth uses bcrypt and an httpOnly JWT cookie. AI runs only on the server.

## Built so far
Signup/login/logout, dashboard, food logger (any quantity), AI meal scan with review/edit/confirm, AI menu scan, food diary (edit/delete API), hydration, calorie/protein/water targets (Mifflin-St Jeor). API-only (no UI yet): profile/preferences, budget, progress, workouts, AI diet, AI coach, forgot/reset password.
## Not built yet
UI pages for fitness, progress, budget, AI coach, diet plan, profile, settings, notifications; email sending (reset link is printed in server logs); PDF menus; partner features.

## Setup
```
cp .env.example backend/.env      # fill values (see below)
cd backend && npm install
npx prisma migrate dev --name init   # first time; later schema changes: npx prisma migrate dev --name <change>
npm run seed                          # foods; SEED_DEMO=true adds demo@samfit.app / Demo@12345
npm run dev                           # http://localhost:4000
cd ../frontend && npm install && echo VITE_API_URL=http://localhost:4000 > .env && npm run dev   # http://localhost:5173
```
## AI
Set `AI_API_KEY` and `AI_MODEL` (a vision-capable Claude model name from console.anthropic.com) in backend env. Without them the AI routes return a clear "AI is not configured" error. Results are validated with zod and cached per image hash.
## Storage
Optional. Set `CLOUDINARY_*` to keep photos; without them photos are analysed but not stored.
## Deploy
1. Database: create a Neon or Supabase Postgres, copy its URL into `DATABASE_URL`.
2. Backend (Render): connect the repo, use `render.yaml`, set the env vars, then run `npx prisma migrate dev --name init` locally once and commit `backend/prisma/migrations`. Render then applies it with `migrate deploy`.
3. Frontend (Vercel/Netlify): root `frontend`, build `npm run build`, output `dist`, env `VITE_API_URL=<backend url>`. Then set backend `FRONTEND_URL` to the frontend URL (CORS and cookies).
## Checklist
Strong `JWT_SECRET`; HTTPS on both; `NODE_ENV=production`; AI key only on the server; test signup, 9-chapati log, meal scan, water; email provider for password reset.
