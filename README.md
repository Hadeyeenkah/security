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

## Local preview
Open `index.html` in your browser, or use any static file server.

## Notes
- `vercel.json` is included for clean URLs and consistent routing behavior.
- Pages like `admin.html` can be reached as `/admin` in production.
