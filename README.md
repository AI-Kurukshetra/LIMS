# NextGen LIMS

Laboratory Information Management System — Next.js (App Router), Supabase (auth + Postgres), role-based dashboards.

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase URL + anon key
npm run dev
```

Apply SQL migrations in Supabase (SQL Editor or CLI): `supabase/migrations/` in order.

## Publish to GitHub

Repo: [AI-Kurukshetra/LIMS](https://github.com/AI-Kurukshetra/LIMS)

```bash
git init
git add .
git commit -m "Initial commit: NextGen LIMS"
git branch -M main
git remote add origin https://github.com/AI-Kurukshetra/LIMS.git
git push -u origin main
```

Use a [Personal Access Token](https://github.com/settings/tokens) as the password if GitHub prompts for credentials.

## Deploy on Vercel

1. Push the repo to GitHub (above).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import **AI-Kurukshetra/LIMS**.
3. Framework: **Next.js** (auto-detected). Root directory: repo root. Build: `npm run build`, Output: default.
4. **Environment Variables** (required):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |

5. Deploy. After deploy, in **Supabase** → Authentication → URL configuration, add your Vercel URL to **Site URL** and **Redirect URLs** (e.g. `https://your-app.vercel.app/**`).

Never commit `.env.local` or service-role keys.

## License

Private / your org — adjust as needed.
