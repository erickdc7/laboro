# Laboro 🇵🇪

> Job aggregator for the Peruvian tech market

Laboro scrapes job listings from Peruvian job portals (Computrabajo, Bumeran), normalizes them into a unified format, and exposes them through a REST API with filters, search, and statistics about the tech job market in Peru.

## Stack

**Backend:** Python · FastAPI · SQLAlchemy · PostgreSQL · BeautifulSoup · Selenium · APScheduler  
**Frontend:** Next.js 15 · TypeScript · Tailwind CSS · TanStack Query · Recharts  
**Database:** PostgreSQL via Supabase  
**Deploy:** Railway (backend) · Vercel (frontend)

## Getting Started

> Setup instructions coming in future phases.

## Features

- Aggregates tech job listings from multiple Peruvian portals
- Filters by stack, modality, city, and source
- Full-text search across job titles and descriptions
- Statistics dashboard: top technologies, salary ranges, modality distribution
- Automatic daily scraping via APScheduler

## Status

🚧 In development