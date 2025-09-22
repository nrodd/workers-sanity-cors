# workers-sanity-cors

> A Cloudflare Worker that automatically adds and removes Sanity CORS origins for preview deployments from GitHub PRs.

## 🚀 What it does
- On **PR open/update**, adds the preview deployment URL (from Cloudflare Workers GitHub App) to Sanity CORS.  
- On **PR close/merge**, removes that preview URL from Sanity CORS.  

## 🛠️ Setup

### 1. Clone and install
```bash
git clone https://github.com/YOURNAME/sanity-cors-sync.git
cd sanity-cors-sync
npm install