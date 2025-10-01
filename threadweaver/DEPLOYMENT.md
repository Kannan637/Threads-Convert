# ThreadWeaver Deployment Guide

This guide will walk you through deploying ThreadWeaver to production.

## Prerequisites

Before deploying, ensure you have:

1. **Database**: PostgreSQL instance (Supabase, Railway, Neon, or any PostgreSQL provider)
2. **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/)
3. **OAuth Apps**: Set up Google and/or GitHub OAuth applications
4. **Stripe Account**: For payment processing (optional for MVP)
5. **Hosting**: Vercel account (recommended) or any Node.js hosting

## Step 1: Database Setup

### Option A: Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the connection string (use "URI" format)
5. Replace password placeholder with your actual password

### Option B: Other PostgreSQL Providers

- **Neon**: [neon.tech](https://neon.tech)
- **Railway**: [railway.app](https://railway.app)
- **PlanetScale**: [planetscale.com](https://planetscale.com)

## Step 2: OAuth Configuration

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret

### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (development)
   - `https://yourdomain.com/api/auth/callback/github` (production)
4. Copy Client ID and Client Secret

## Step 3: Stripe Setup (Optional)

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Create products and prices:
   ```bash
   # Use Stripe CLI or Dashboard
   # Create products: Starter ($12), Pro ($29), Agency ($79)
   ```
4. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy webhook signing secret

## Step 4: Environment Variables

Create `.env.production` or set in Vercel dashboard:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-random-32-char-string"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_your-stripe-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Step 5: Database Migration

Before deploying, run migrations:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 6: Deploy to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Deploy

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Step 7: Post-Deployment

### Verify Deployment

1. Visit your production URL
2. Test authentication with Google/GitHub
3. Generate a test thread
4. Check database for created records

### Set up Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Sentry** (optional): For error tracking
3. **PostHog** (optional): For product analytics

### Configure Domain

1. Add custom domain in Vercel dashboard
2. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
3. Update environment variables with new domain

## Step 8: Stripe Configuration (Production)

1. Switch from test mode to live mode in Stripe
2. Update webhook URL to production
3. Update price IDs in code:
   ```typescript
   // lib/subscription.ts
   stripePriceId: process.env.STRIPE_PRICE_ID_STARTER
   ```

## Troubleshooting

### Database Connection Issues

- Check DATABASE_URL format
- Ensure database allows external connections
- Verify SSL requirements (add `?sslmode=require` if needed)

### OAuth Redirect Issues

- Ensure redirect URIs match exactly (including trailing slashes)
- Check NEXTAUTH_URL is set correctly
- Verify OAuth apps are not in development mode

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### OpenAI Rate Limits

- Monitor usage in OpenAI dashboard
- Implement rate limiting in API routes
- Add error handling for quota exceeded

## Performance Optimization

### 1. Enable Caching

```typescript
// Add caching to OpenAI responses
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})
```

### 2. Database Optimization

```bash
# Add indexes for common queries
npx prisma db push
```

### 3. Image Optimization

Use Next.js Image component for all images

### 4. Edge Functions

Deploy API routes to edge for lower latency

## Monitoring & Maintenance

### Key Metrics to Track

1. Thread generation success rate
2. API response times
3. Database query performance
4. Error rates by endpoint
5. User authentication success rate

### Scheduled Tasks

Set up cron jobs for:
- Cleaning up old threads
- Subscription status checks
- Usage analytics aggregation

### Backup Strategy

1. **Database**: Daily automated backups (most providers include this)
2. **User Data**: Export critical data weekly
3. **Code**: Use Git for version control

## Security Checklist

- [ ] Environment variables secured
- [ ] Database uses SSL
- [ ] OAuth secrets rotated regularly
- [ ] Stripe webhooks validated
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] CSP headers set
- [ ] Input validation on all forms
- [ ] SQL injection protection (Prisma handles this)

## Cost Estimation

**Monthly costs for 1000 active users:**

- Vercel Pro: $20
- Database (Supabase): $25
- OpenAI API: $100-500 (depends on usage)
- Stripe fees: 2.9% + $0.30 per transaction
- Total: ~$150-550/month

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## Going to Production Checklist

- [ ] All environment variables set
- [ ] Database migrated
- [ ] OAuth configured for production URLs
- [ ] Stripe webhooks configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Terms of Service & Privacy Policy added
- [ ] Contact/support email configured
- [ ] Performance tested
- [ ] Security audit completed

---

**Need Help?** Open an issue on GitHub or contact support@threadweaver.com
