# ThreadWeaver - Quick Start Guide

Get ThreadWeaver running locally in under 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- OpenAI API key
- OAuth credentials (Google and/or GitHub)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd threadweaver
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Minimal required configuration
DATABASE_URL="postgresql://user:password@localhost:5432/threadweaver"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-your-key-here"

# At least one OAuth provider
GOOGLE_CLIENT_ID="your-google-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open Application

Visit: http://localhost:3000

## OAuth Setup (Quick)

### Google OAuth (5 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID & Secret to `.env`

### GitHub OAuth (3 minutes)

1. Go to: https://github.com/settings/developers
2. New OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID & Secret to `.env`

## Get OpenAI Key (2 minutes)

1. Visit: https://platform.openai.com/api-keys
2. Create new secret key
3. Copy to `.env` as `OPENAI_API_KEY`

## Test It Out

1. **Sign In**: Click "Sign In" → Choose OAuth provider
2. **Create Thread**: 
   - Paste some long-form content (100+ chars)
   - Select platform (Twitter/LinkedIn)
   - Choose style (Professional, Casual, etc.)
   - Click "Generate Thread"
3. **View Results**: See your AI-generated thread!
4. **Edit**: Click any tweet to edit
5. **Export**: Copy to clipboard or download

## Common Issues

### "Database connection error"
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Test connection: `npx prisma db push`

### "OAuth redirect error"
- Verify redirect URLs match exactly
- Check OAuth credentials in `.env`
- Restart dev server after env changes

### "OpenAI API error"
- Verify API key is correct
- Check OpenAI account has credits
- Ensure no extra spaces in `.env`

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes

# Troubleshooting
rm -rf .next node_modules
npm install
npm run dev
```

## Default Ports

- Application: http://localhost:3000
- Database: postgresql://localhost:5432 (if local)

## Next Steps

1. ✅ Generate your first thread
2. 📚 Read full documentation in README.md
3. 🚀 Deploy to production (see DEPLOYMENT.md)
4. 💰 Set up Stripe for payments
5. 📊 Add analytics tracking

## Need Help?

- 📖 Full documentation: `README.md`
- 🚀 Deployment guide: `DEPLOYMENT.md`
- 📋 Project overview: `PROJECT_OVERVIEW.md`
- 🐛 Issues: GitHub Issues
- 💬 Questions: support@threadweaver.com

---

**You're ready to go!** 🎉 Start creating amazing threads!
