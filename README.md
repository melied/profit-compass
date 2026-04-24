# Profit Compass — Online Income Idea Generator

A full-stack MVP that guides users through a 7-question discovery flow and generates personalized, AI-powered online income opportunities ranked by feasibility.

---

## Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | Next.js 14 (App Router) + TypeScript |
| State     | Zustand (with localStorage persistence) |
| PDF Export| jsPDF                         |
| Backend   | Node.js + Express             |
| Database  | SQLite via better-sqlite3     |
| AI        | Anthropic Claude (claude-opus-4-5) |

---

## Project Structure

```
profit-compass/
├── frontend/          # Next.js app
│   └── src/
│       ├── app/       # Pages, layout, globals.css
│       ├── components/# QuestionCard, IdeaCard, FavoritesPanel, etc.
│       ├── lib/       # API client, questions data, PDF export
│       ├── store/     # Zustand store
│       └── types/     # TypeScript interfaces
└── backend/           # Express API
    └── src/
        ├── index.js
        ├── routes/    # /api/ideas, /api/sessions
        └── services/  # anthropic.js, db.js
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- An Anthropic API key (get one at console.anthropic.com)

---

### 1. Backend

```bash
cd profit-compass/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=your_key_here

# Start dev server (auto-reloads)
npm run dev

# Or production start
npm start
```

The backend runs on **http://localhost:4000**

**API Endpoints:**
- `GET  /api/health` — Health check
- `POST /api/ideas/generate` — Generate personalized ideas
  - Body: `{ answers: {...}, sessionId?: string }`
- `GET  /api/sessions/:id` — Restore a session
- `PATCH /api/sessions/:id/favorites` — Save favorites
- `DELETE /api/sessions/:id` — Clear session

---

### 2. Frontend

```bash
cd profit-compass/frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different port

# Start dev server
npm run dev
```

The frontend runs on **http://localhost:3000**

---

## Features

- **7-question progressive assessment** — skills, interests, time, budget, audience, goal, work style
- **AI-generated ideas** — 6 personalized opportunities ranked by feasibility
- **Rich idea cards** — revenue model, income range, required skills, first steps, real examples, pitfalls
- **Favorites system** — bookmark and compare top ideas
- **PDF export** — download a formatted summary via jsPDF
- **Session persistence** — answers and results saved to localStorage + SQLite
- **Rate limiting** — 20 generations per IP per hour
- **Edge case handling** — AI instructed to handle $0 budget, beginner skills, minimal time
- **Mobile responsive** — works on all screen sizes

---

## Environment Variables

### Backend (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | — | Required. Your Anthropic API key. |
| `PORT` | 4000 | Port for the Express server |
| `CORS_ORIGIN` | http://localhost:3000 | Allowed frontend origin |
| `NODE_ENV` | development | Environment |

### Frontend (.env.local)
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:4000 | Backend API URL |

---

## Deployment Notes

- **Backend**: Deploy to Railway, Render, or Fly.io. The SQLite file persists on disk — use a persistent volume or swap for PostgreSQL for production.
- **Frontend**: Deploy to Vercel. Set `NEXT_PUBLIC_API_URL` to your backend's production URL.
- For production, set `CORS_ORIGIN` in the backend to your Vercel domain.

---

## Extending the MVP

- **Email results**: Add Resend or SendGrid integration in a `POST /api/sessions/:id/email` route
- **Auth**: Add NextAuth to the frontend to tie sessions to user accounts
- **Analytics**: Track which idea categories perform best via a simple events table
- **A/B testing**: Vary the question order or AI prompt to optimize idea quality
