# ThreadWeaver 🧵✨

Transform long-form content into engaging social media threads optimized for Twitter and LinkedIn with AI-powered suggestions.

## 🚀 Features

- **AI-Powered Thread Generation**: Convert blog posts, articles, and long-form content into engaging threads using GPT-4
- **Multi-Platform Support**: Optimized formatting for Twitter (280 chars) and LinkedIn (3000 chars)
- **Multiple Styles**: Professional, Casual, Storytelling, and Educational tones
- **Real-Time Editing**: Edit any tweet in the generated thread with live character count
- **Smart Content Extraction**: Extract content directly from URLs
- **Thread History**: View and manage all your previously generated threads
- **Subscription Tiers**: Free, Starter, Pro, and Agency plans with different limits

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google, GitHub)
- **AI**: OpenAI GPT-4 API
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/threadweaver.git
cd threadweaver
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random string for NextAuth
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth
- `GITHUB_ID` & `GITHUB_SECRET`: For GitHub OAuth

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Schema

The application uses the following main tables:

- **User**: User accounts with subscription information
- **Thread**: Generated threads with original content and AI output
- **Subscription**: Stripe subscription details
- **ThreadAnalytics**: Performance metrics for threads

## 🎨 Project Structure

```
threadweaver/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── threads/      # Thread generation & management
│   │   └── extract-url/  # URL content extraction
│   ├── dashboard/        # Dashboard pages
│   ├── auth/            # Authentication pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Shadcn/ui components
│   ├── thread-generator.tsx
│   ├── thread-preview.tsx
│   └── dashboard-client.tsx
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # NextAuth configuration
│   ├── openai.ts        # OpenAI integration
│   ├── store.ts         # Zustand store
│   └── subscription.ts  # Subscription logic
└── prisma/
    └── schema.prisma    # Database schema
```

## 🔐 Authentication

ThreadWeaver uses NextAuth.js with support for:
- Google OAuth
- GitHub OAuth

Configure OAuth providers in the `.env` file and enable them in your OAuth provider dashboards.

## 💰 Subscription Tiers

### Free Tier
- 5 threads per month
- Basic thread generation
- Twitter format only

### Starter ($12/month)
- 50 threads per month
- All platforms (Twitter, LinkedIn)
- Basic scheduling
- Thread templates

### Pro ($29/month)
- Unlimited threads
- Advanced AI optimization
- Team collaboration (3 users)
- Analytics dashboard

### Agency ($79/month)
- Everything in Pro
- White-label branding
- Client management
- API access

## 🤖 AI Integration

ThreadWeaver uses OpenAI's GPT-4 to:
1. Analyze long-form content
2. Identify key points and narrative flow
3. Split content into optimal tweet-sized chunks
4. Add engaging hooks and CTAs
5. Maintain tone and style consistency

## 📝 API Routes

- `POST /api/threads/generate` - Generate a new thread
- `GET /api/threads` - Get user's thread history
- `POST /api/extract-url` - Extract content from URL

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:
- Database connection
- NextAuth configuration
- OAuth credentials
- OpenAI API key
- Stripe keys (if using payments)

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio
npx prisma studio

# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@threadweaver.com or open an issue on GitHub.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for hosting
- Shadcn for beautiful UI components

---

Built with ❤️ by the ThreadWeaver team
