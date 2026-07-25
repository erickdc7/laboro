from app.database import SessionLocal
from app.models.source import Source
from app.models.job import Job, JobTechnology
from datetime import datetime, timezone

db = SessionLocal()

# Limpiar en orden correcto — primero las tablas dependientes
db.query(JobTechnology).delete()
db.query(Job).delete()
db.query(ScrapeLog).delete()  # ← agrega esta línea
db.query(Source).delete()
db.commit()

# Crear fuentes
computrabajo = Source(
    name="Computrabajo",
    base_url="https://pe.computrabajo.com",
    is_active=True
)
bumeran = Source(
    name="Bumeran",
    base_url="https://www.bumeran.com.pe",
    is_active=True
)
db.add_all([computrabajo, bumeran])
db.commit()
db.refresh(computrabajo)
db.refresh(bumeran)

# Crear empleos de prueba
jobs_data = [
    {
        "source_id": computrabajo.id,
        "title": "Frontend Developer React",
        "company": "BCP",
        "description": "Buscamos desarrollador frontend con experiencia en React y TypeScript.",
        "location": "Lima",
        "modality": "hybrid",
        "salary_min": 3000,
        "salary_max": 5000,
        "url_original": "https://pe.computrabajo.com/trabajo-de-frontend-developer-bcp-1",
        "published_at": datetime.now(timezone.utc),
        "technologies": ["React", "TypeScript", "CSS"]
    },
    {
        "source_id": computrabajo.id,
        "title": "Backend Developer Python",
        "company": "Falabella Perú",
        "description": "Desarrollador backend con experiencia en Python y FastAPI.",
        "location": "Lima",
        "modality": "remote",
        "salary_min": 4000,
        "salary_max": 7000,
        "url_original": "https://pe.computrabajo.com/trabajo-de-backend-developer-falabella-1",
        "published_at": datetime.now(timezone.utc),
        "technologies": ["Python", "FastAPI", "PostgreSQL"]
    },
    {
        "source_id": bumeran.id,
        "title": "Fullstack Developer",
        "company": "Interbank",
        "description": "Desarrollador fullstack con experiencia en React y Node.js.",
        "location": "Lima",
        "modality": "on-site",
        "salary_min": 5000,
        "salary_max": 8000,
        "url_original": "https://www.bumeran.com.pe/empleos/fullstack-developer-interbank-1",
        "published_at": datetime.now(timezone.utc),
        "technologies": ["React", "Node.js", "MongoDB"]
    },
    {
        "source_id": bumeran.id,
        "title": "DevOps Engineer",
        "company": "Rimac Seguros",
        "description": "Ingeniero DevOps con experiencia en AWS y Docker.",
        "location": "Lima",
        "modality": "hybrid",
        "salary_min": 6000,
        "salary_max": 10000,
        "url_original": "https://www.bumeran.com.pe/empleos/devops-engineer-rimac-1",
        "published_at": datetime.now(timezone.utc),
        "technologies": ["AWS", "Docker", "Kubernetes"]
    },
    {
        "source_id": computrabajo.id,
        "title": "Mobile Developer React Native",
        "company": "Yape",
        "description": "Desarrollador mobile con experiencia en React Native.",
        "location": "Lima",
        "modality": "remote",
        "salary_min": 4500,
        "salary_max": 7500,
        "url_original": "https://pe.computrabajo.com/trabajo-de-mobile-developer-yape-1",
        "published_at": datetime.now(timezone.utc),
        "technologies": ["React Native", "TypeScript", "Redux"]
    },
]

for job_data in jobs_data:
    techs = job_data.pop("technologies")
    job = Job(**job_data)
    db.add(job)
    db.flush()
    for tech in techs:
        db.add(JobTechnology(job_id=job.id, technology=tech))

db.commit()
print(f"✅ Seed completado: {len(jobs_data)} empleos insertados")
db.close()