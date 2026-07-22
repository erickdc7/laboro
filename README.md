# Laboro 🇵🇪

> Job aggregator for the Peruvian tech market

Laboro scrapes job listings from Peruvian job portals (Computrabajo, Bumeran),
normalizes them into a unified format, and exposes them through a REST API with
filters, search, and statistics about the tech job market in Peru.

## 🚀 Live Demo

- **Frontend:** https://laboro-pe.vercel.app
- **Backend API:** https://laboro-backend.onrender.com
- **API Docs:** https://laboro-backend.onrender.com/docs

## Stack

**Backend:** Python · FastAPI · SQLAlchemy · PostgreSQL · BeautifulSoup · Selenium · APScheduler  
**Frontend:** Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query · Recharts  
**Database:** PostgreSQL via Supabase  
**Deploy:** Render (backend) · Vercel (frontend)

## Project Structure

```
laboro/
├── backend/   # FastAPI REST API + scrapers
└── frontend/  # Next.js 16 web application
```

## Features

- Aggregates tech job listings from Computrabajo and Bumeran
- Filters by stack, modality, city and source
- Full-text search across job titles and descriptions
- Statistics dashboard: top technologies, modality distribution, jobs per day, top companies
- Automatic daily scraping via APScheduler
- Responsive design with shadcn/ui and Tailwind CSS

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | API status |
| GET | /jobs | List jobs with filters |
| GET | /jobs/{id} | Job detail |
| GET | /sources | List sources |
| POST | /scraper/run | Trigger scraper manually |
| GET | /scraper/logs | Scraping history |
| GET | /stats/summary | Key metrics |
| GET | /stats/top-technologies | Most demanded technologies |
| GET | /stats/modality | Modality distribution |
| GET | /stats/jobs-per-day | New jobs per day (last 30 days) |
| GET | /stats/top-companies | Companies with most listings |

## Status

✅ In production