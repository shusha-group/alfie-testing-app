# Vercel Deployment Instructions

## Quick Deploy (Recommended)

1. **Visit**: https://vercel.com/new
2. **Import Git Repository**:
   - Select `shusha-group/alfie-testing-app`
   - Authorize Vercel if needed
3. **Configure**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./` (or `/` if prompted)
4. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Get live URL (e.g., `pickleball-scorekeeper.vercel.app`)

## Alternative: GitHub Actions Auto-Deploy

Add `.github/workflows/deploy.yml` to repo for automatic deployment on merge.

## Alternative: Vercel CLI (Manual)

```bash
# Login (opens browser)
vercel login

# Deploy
cd ~/.openclaw/workspace/.worktrees/shu-9
vercel --prod
```

## Expected Result

- **URL**: `https://pickleball-scorekeeper-[random].vercel.app`
- **Status**: ✅ Production deployment
- **Features**: PWA, offline capable, mobile optimized

---

**Deploy now**: https://vercel.com/new