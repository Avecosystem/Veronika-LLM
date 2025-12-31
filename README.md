# VERONIKA Air - AI Chatbot

VERONIKA is an AI chatbot with a neon-themed UI featuring:
- Rainbow-colored title animation
- Interactive message interface with edit/copy/resend actions
- Support for multiple AI models via OpenRouter
- Fully responsive design for mobile/desktop

# VERONIKA Air - AI Chatbot

VERONIKA is an AI chatbot with a modern, neon-themed UI featuring:
- Interactive message interface with edit/copy/resend actions
- Support for multiple AI models via OpenRouter (default: GPT OSS 20B)
- Fully responsive design for mobile/desktop
- Admin dashboard and payment integration

## 🚀 DEPLOYMENT

### ✅ VERCEL (FRONTEND)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure Project Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

### ✅ RENDER (BACKEND)
1. Push code to GitHub repository
2. Create specific Web Service in Render
3. Connect repository
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Env Vars**: `PORT=5001`, `DATABASE_URL=file:./dev.db`, `JWT_SECRET=...`, `OPENROUTER_API_KEY=...`

## How It Works

- **Frontend**: React + Vite (located in `client/`)
- **Backend**: Node.js + Express + Prisma (located in `server/`)
- **Database**: SQLite (local) / Postgres (production recommended)

## Tech Stack
- React, Tailwind CSS, Lucide Icons
- Node.js, Express, Prisma
- OpenRouter API

## License

MIT License