# Company Website

Static multi-page website deployed on Vercel.

## Deploy to Vercel

### One-time setup
1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project**.
3. Import this GitHub repository.
4. Use these settings:
   - **Framework Preset:** Other
   - **Build Command:** _(leave empty)_
   - **Output Directory:** _(leave empty)_
5. Click **Deploy**.

### Ongoing updates
Run these commands after changes:

```bash
git add .
git commit -m "Update site"
git push
```

Vercel will auto-deploy from `main`.

### One-command deploy from VS Code
You can deploy to production directly from VS Code without waiting for Git auto-deploy:

1. Open **Command Palette** → **Tasks: Run Task**.
2. Select **Deploy to Vercel (Production)**.

This uses the workspace task in `.vscode/tasks.json` and runs:

```bash
npx vercel --prod
```

If prompted, complete Vercel login/linking once in the terminal.

## Local preview
Open `index.html` in your browser, or use any static file server.

## Notes
- `vercel.json` is included for clean URLs and consistent routing behavior.
- Pages like `admin.html` can be reached as `/admin` in production.
