# EduForge Learning Hub
Status: Stage 1 scaffold plus TVET schema (002) and curriculum classifier engine with tests (homepage, departments, founder page, core SQL schema). Not yet installed, built or tested.
## Run
npm install && npm run dev
## Deploy
git init && git add . && git commit -m "Stage 1" && git branch -M main && git remote add origin <REPO_URL> && git push -u origin main
Import the repo in Vercel and set the variables from .env.example. GitHub Pages cannot host the backend, database or AI.
## Roadmap
Stages 2 to 11 of the master prompt are pending.

## Android APK (built automatically on GitHub)
Every push to main runs .github/workflows/android-apk.yml. Open the repository's Actions tab, open the latest run, and download "EduForge-APK" from Artifacts. It is a debug APK for sideloading (enable "install unknown apps" on the phone). A Play Store release needs a signing key.

## AI function (assistant and exam generator)
1. Supabase dashboard, Edge Functions, create a function named `ai`, paste `supabase/functions/ai/index.ts`, deploy.
2. Edge Functions, Secrets: add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`, `AI_DAILY_LIMIT`). The key never enters GitHub or the website.
3. Run `database/migrations/006_ai_usage.sql`.

## Android app updates
capacitor.config.json points the app at the live site, so website updates reach the app without a new APK. Rebuild the APK only when the native shell changes. If your Vercel address changes, edit server.url.
