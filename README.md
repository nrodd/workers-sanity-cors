# workers-sanity-cors

> A Cloudflare Worker that automatically manages Sanity CORS origins for preview deployments from GitHub PRs.

## 🚀 What it does

- **On deployment success**: Automatically adds the preview deployment URL to Sanity CORS allowlist
- **On PR close/merge**: Automatically removes the preview URL from Sanity CORS allowlist
- **Webhook verification**: Securely validates GitHub webhook signatures

## 📋 Prerequisites

- [Cloudflare Workers account](https://workers.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated
- [Sanity project](https://www.sanity.io/) with API access
- GitHub repository with webhook access

## 🛠️ Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/workers-sanity-cors.git
cd workers-sanity-cors
npm install
```

### 2. Configure environment variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```bash
# GitHub webhook secret (you'll create this in step 4)
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# Sanity project configuration
SANITY_PROJECT_ID=your_project_id_here
SANITY_TOKEN=your_sanity_token_here

# Your Workers domain (replace with your actual domain)
WORKERS_DOMAIN=your-domain.workers.dev
```

### 3. Generate TypeScript definitions

```bash
npx wrangler types
```

### 4. Deploy to Cloudflare Workers

```bash
npx wrangler deploy
```

Note the deployment URL - you'll need this for the GitHub webhook.

### 5. Set up Wrangler secrets

Instead of using `.env` for production, set secrets directly with Wrangler:

```bash
npx wrangler secret put GITHUB_WEBHOOK_SECRET
npx wrangler secret put SANITY_PROJECT_ID  
npx wrangler secret put SANITY_TOKEN
npx wrangler secret put WORKERS_DOMAIN
```

You can also configure these manually through the cloudflare workers admin settings.

### 6. Configure GitHub webhook

1. Go to your GitHub repository → Settings → Webhooks
2. Click "Add webhook"
3. Set **Payload URL** to: `https://your-worker-url.workers.dev/webhook`
4. Set **Content type** to: `application/json`
5. Set **Secret** to the same value you used for `GITHUB_WEBHOOK_SECRET`
6. Select individual events:
   - ✅ **Deployment statuses**
   - ✅ **Pull requests**
7. Ensure the webhook is **Active**
8. Click "Add webhook"

### 7. Get your Sanity credentials

#### Sanity Project ID
Find this in your Sanity project dashboard URL: `sanity.io/manage/personal/project/YOUR_PROJECT_ID`

#### Sanity Token
1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project
3. Go to API → Tokens
4. Create a new token with **Editor** permissions
5. Copy the token value

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run in development mode:
```bash
npm run dev
```

## 🔧 Development

### Local development
```bash
npm run dev
```

### Type checking
```bash
npx wrangler types  # Regenerate types
npm run test        # Run tests
```

### Project structure
```
src/
├── index.ts      # Main Worker entry point
├── github.ts     # GitHub webhook verification
└── sanity.ts     # Sanity CORS management

test/
└── index.spec.ts # Test suite
```

## 📚 How it works

1. **GitHub sends webhook** when deployments complete or PRs are opened/closed
2. **Worker verifies signature** using your webhook secret
3. **For successful deployments**: Extracts the deployment URL and adds it to Sanity CORS
4. **For closed PRs**: Constructs the PR preview URL and removes it from Sanity CORS

## 🔒 Security

- All secrets are stored as Wrangler secrets (not in code)
- GitHub webhook signatures are cryptographically verified
- CORS origins are managed through Sanity's secure API

## 📄 License

MIT
