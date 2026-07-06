# TrackerGen

> A finance tracker that works from wherever you already are.

**Live Demo:** [trackergen30.pages.dev](https://trackergen30.pages.dev)

---

## The Problem

I kept losing track of where my money was going. Not because I didn't want to know — I just never found a system that stuck. The apps I tried either wanted full bank access, made me open a separate app every time I spent $5, or required me to maintain a spreadsheet like it was a part-time job.

I needed something simpler. I text all day, so why couldn't I just text my expenses? A quick message when I bought coffee, a glance at the dashboard at the end of the week. No added friction.

So I built TrackerGen.

---

## What Makes This Different

### Telegram-First Input

No app install required. Link your account to the Telegram bot and log expenses in plain English:

```
expense coffee 6.50 food
income paycheck 1200 work
```

The bot parses natural language on the fly — "coffee" maps to Food & Drink, "rent" to Housing, "salary" to Income. Inline buttons let you pick Income or Expense when you're not sure. A `/summary` command gives you your monthly totals from bed.

Transactions hit the dashboard instantly. No refresh, no sync button — they just appear.

### Dashboard That Shows You What Matters

Four cards at the top tell you your Net Change, Income, Expenses, and Savings Rate without scrolling. An area chart breaks down cash flow across 6 or 12 months. A category breakdown visualizes where every dollar went.

Add, edit, or delete entries with category tagging. Accidentally delete something? Undo is one click away. The dashboard polls every 10 seconds so you always see the latest.

### Onboarding That Sets You Up

New users walk through a quick wizard: set a monthly savings goal, decide if you want spending reminders, and pick your notification channel (Telegram, Discord, or none). It takes 30 seconds and you're in the dashboard.

---

## Screenshots

*Dashboard, Telegram bot flow, and onboarding — I'll drop these in once I grab them.*

![Landing Page Hero](screenshots/landing-hero.png)
*Landing page — dark theme, CTA-driven hero*

![Landing Page Features](screenshots/landing-features.png)
*Feature overview — tracking, trading, security, and integrations*

![Login Page](screenshots/login.png)
*Login — email/password, Google, GitHub OAuth*

![Pricing](screenshots/landing-pricing.png)
*Pricing and plan tiers*

---

## Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   React 19 Client     │     │   Telegram Bot        │
│   (Cloudflare Pages)  │     │   (Node.js + Bot API) │
│                       │     │                       │
│   trackergen2.pages.  │     │   Natural language     │
│   dev                 │     │   parsing, inline      │
│                       │     │   buttons, /summary    │
└─────────┬────────────┘     └───────────┬───────────┘
          │ HTTP/JSON (REST)             │
          │ (CSRF-protected)             │
          ▼                              ▼
┌──────────────────────────────────────────────┐
│            Express 5 API Server               │
│                                                │
│  /api/transactions  CRUD                      │
│  /api/auth/*        WorkOS auth + session     │
│  /api/profile/*     Onboarding, Telegram link │
│                                                │
│  Middleware: CORS · Cookie Parser · CSRF       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              MongoDB (Mongoose)               │
│                                                │
│  Transactions collection (indexed by user,    │
│  source, date)                                 │
│  UserProfile collection (settings, Telegram   │
│  link, onboarding state)                      │
└──────────────────────────────────────────────┘
```

**Key decisions:**
- **React + Vite** — fast dev iteration, modern tooling, edge-deployable static output
- **Express 5** — lightweight, well-understood, async error handling built in
- **WorkOS** — production-grade auth without building a credentials system from scratch; supports Google/GitHub OAuth and email out of the box
- **MongoDB** — flexible schema for evolving transaction data; fast indexed queries per user
- **Cloudflare Pages** — global edge CDN for static assets; sub-100ms load times worldwide
- **Telegram Bot API** — zero-install mobile interface; users already have Telegram, no second app needed
- **CSRF protection** — double-submit cookie pattern on all state-changing endpoints; protects session cookies from cross-site attacks

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | React 19, Vite 7, Tailwind CSS v4, Recharts | Modern, fast, component-driven UI with real-time charts |
| Backend | Node.js, Express 5, Mongoose | Lean API layer with async-native error handling |
| Database | MongoDB | Flexible document model, fast per-user queries |
| Auth | WorkOS | Enterprise auth without building it; Google + GitHub + email |
| Bot | Node Telegram Bot API | Zero-install mobile interface via existing chat app |
| Security | CSRF double-submit cookie, httpOnly cookies | Protects session-based auth from cross-site attacks |
| Deployment | Cloudflare Pages | Edge CDN for frontend; deploy from git |

---

## Project Structure

```
TrackerGen-/
├── client/                  # React 19 + Vite 7 frontend
│   ├── src/
│   │   ├── pages/           # home, login, signup, onboarding (4-step), dashboard
│   │   ├── components/      # Nav, Footer, Dashboard widgets (stat cards, charts, etc.)
│   │   └── lib/auth.js      # API client with CSRF token management
│   └── package.json
├── server/                  # Express 5 API
│   ├── routes/route.js      # REST endpoints: transactions CRUD, profile, Telegram link
│   ├── model/               # Mongoose schemas (Transaction, UserProfile)
│   ├── bot/bot.js           # Telegram bot — NLP parsing, inline buttons, /summary
│   ├── config/              # DB connection, auth helpers
│   └── server.js            # Entry point, WorkOS auth routes, CSRF setup
├── screenshots/             # App screenshots
├── architecture.drawio      # Full system diagram (open with draw.io)
└── README.md
```

---

## Getting Started

```bash
git clone https://github.com/CyrusL06/TrackerGen-.git
cd TrackerGen-

# Install everything
cd client && npm install
cd ../server && npm install

# Configure
cp server/.env.local.example server/.env.local
# Add your MongoDB URI, WorkOS keys, and Telegram bot token
```

**Run in two terminals:**

```bash
cd server && npm run dev    # API → localhost:3200
cd client && npm run dev    # Frontend → localhost:5173
```

**No WorkOS?** Set `AUTH_MODE=offline` in `.env.local`, provide `OFFLINE_USER_ID` and `OFFLINE_USER_EMAIL`, and the app authenticates as that user automatically — great for local development.

---

## Deployment

- **Frontend:** Push `client/` to Cloudflare Pages — auto-deploys from git, global edge CDN
- **Backend:** Deploy `server/` to Railway, Render, Fly.io, or any Node.js host with a MongoDB connection
- **Auth/API proxy:** Set Cloudflare Pages env var `API_ORIGIN` to your backend origin, for example `https://your-api-host.example.com`. The Pages Functions in `client/functions/` proxy `/api/*` and `/auth/*` through the frontend domain so Brave and other browsers treat auth cookies as same-origin.
- **WorkOS callback:** Set `WORKOS_REDIRECT_URI` to the frontend callback URL, for example `https://trackergen30.pages.dev/auth/callback`, and register that exact URL in WorkOS.

🔗 **Live:** [trackergen30.pages.dev](https://trackergen30.pages.dev)

---

## Security

- All state-changing endpoints protected by **double-submit CSRF tokens**
- Session cookies are **httpOnly** and **sameSite**-restricted
- WorkOS manages authentication server-side — no JWTs exposed to the client
- Input validation on every endpoint: amount limits, character caps, date format enforcement

---

## About This Project

I built TrackerGen because I wanted a finance tracker that met me where I was — not the other way around. I was tired of apps that required full bank integration or forced me into a rigid workflow. The Telegram integration came from a simple observation: I text more than I open apps, so why shouldn't I be able to text my expenses?

Working on this meant I had to figure out the whole stack — laying out the architecture, wiring up a real auth provider, getting something shipped to a CDN, and building a Telegram bot that shares a database with the web app. Every choice, from WorkOS to Cloudflare, was about making something I'd actually run in production, not just something that passed a rubric.

---

## Author

**Cyrus Lorenzo** — Computing & Information Systems student at Douglas College.

This is the kind of project I wanted to exist, so I made it. Live site, real users can sign up, Telegram bot works in production. It's not a template or a tutorial — it's something I designed, built, and put on the internet myself.

- GitHub: [@CyrusL06](https://github.com/CyrusL06)
- Portfolio: [cyruslorenzo.com](https://cyruslorenzo.com)
