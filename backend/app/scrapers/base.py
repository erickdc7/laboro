from abc import ABC, abstractmethod
from sqlalchemy.orm import Session


class BaseScraper(ABC):

    def __init__(self, db: Session, source_id: int):
        self.db = db
        self.source_id = source_id

    @abstractmethod
    def fetch_jobs(self) -> list[dict]:
        pass

    @abstractmethod
    def parse_job(self, raw_data: dict) -> dict:
        pass

    def run(self) -> dict:
        print(f"[{self.__class__.__name__}] Iniciando scraping...")
        results = {
            "jobs_found": 0,
            "jobs_new": 0,
            "jobs_updated": 0,
            "status": "success",
            "error_message": None
        }
        try:
            raw_jobs = self.fetch_jobs()
            results["jobs_found"] = len(raw_jobs)
            print(f"[{self.__class__.__name__}] {len(raw_jobs)} empleos encontrados")

            for raw_job in raw_jobs:
                parsed = self.parse_job(raw_job)
                outcome = self._save_job(parsed)
                if outcome == "new":
                    results["jobs_new"] += 1
                elif outcome == "updated":
                    results["jobs_updated"] += 1

        except Exception as e:
            results["status"] = "error"
            results["error_message"] = str(e)
            print(f"[{self.__class__.__name__}] Error: {e}")

        print(f"[{self.__class__.__name__}] Finalizado — {results}")
        return results

    def _save_job(self, job_data: dict) -> str:
        from app.models.job import Job, JobTechnology

        existing = self.db.query(Job).filter(
            Job.url_original == job_data["url_original"]
        ).first()

        if existing:
            return "skipped"

        technologies = job_data.pop("technologies", [])

        job = Job(source_id=self.source_id, **job_data)
        self.db.add(job)
        self.db.flush()

        for tech in technologies:
            self.db.add(JobTechnology(job_id=job.id, technology=tech))

        self.db.commit()
        return "new"