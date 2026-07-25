import requests
import time
import random
from bs4 import BeautifulSoup
from datetime import datetime, timezone, timedelta

from app.scrapers.base import BaseScraper
from app.scrapers.utils import clean_text, extract_technologies, parse_salary

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-PE,es;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://pe.computrabajo.com/",
}

SEARCH_URLS = [
    "https://pe.computrabajo.com/trabajo-de-desarrollador-software",
    "https://pe.computrabajo.com/trabajo-de-programador",
    "https://pe.computrabajo.com/trabajo-de-react",
    "https://pe.computrabajo.com/trabajo-de-python",
]


def parse_relative_date(text: str) -> datetime:
    text = text.lower().strip()
    now = datetime.now(timezone.utc)

    if "min" in text:
        nums = [int(s) for s in text.split() if s.isdigit()]
        minutes = nums[0] if nums else 30
        return now - timedelta(minutes=minutes)
    elif "hora" in text:
        nums = [int(s) for s in text.split() if s.isdigit()]
        hours = nums[0] if nums else 1
        return now - timedelta(hours=hours)
    elif "ayer" in text:
        return now - timedelta(days=1)
    elif "día" in text or "dia" in text:
        nums = [int(s) for s in text.split() if s.isdigit()]
        days = nums[0] if nums else 2
        return now - timedelta(days=days)
    elif "semana" in text:
        nums = [int(s) for s in text.split() if s.isdigit()]
        weeks = nums[0] if nums else 1
        return now - timedelta(weeks=weeks)
    elif "mes" in text:
        nums = [int(s) for s in text.split() if s.isdigit()]
        months = nums[0] if nums else 1
        return now - timedelta(days=months * 30)
    else:
        return now


class ComputrabajoScraper(BaseScraper):

    def fetch_jobs(self) -> list[dict]:
        raw_jobs = []

        for url in SEARCH_URLS:
            try:
                print(f"[Computrabajo] Scrapeando: {url}")
                jobs_from_page = self._scrape_listing_page(url)
                raw_jobs.extend(jobs_from_page)
                time.sleep(random.uniform(2, 4))
            except Exception as e:
                print(f"[Computrabajo] Error en {url}: {e}")
                continue

        seen_urls = set()
        unique_jobs = []
        for job in raw_jobs:
            if job["url_original"] not in seen_urls:
                seen_urls.add(job["url_original"])
                unique_jobs.append(job)

        print(f"[Computrabajo] Total únicos encontrados: {len(unique_jobs)}")
        return unique_jobs

    def _scrape_listing_page(self, url: str) -> list[dict]:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")

        left_cards = soup.find_all("article", class_="box_offer")
        if not left_cards:
            left_cards = soup.find_all("div", class_="box_offer")

        jobs = []
        for card in left_cards:
            try:
                link_tag = card.find("a", href=True)
                if not link_tag:
                    continue

                href = link_tag["href"]
                href = href.split("#")[0].split("?")[0].strip()
                if not href.startswith("http"):
                    href = f"https://pe.computrabajo.com{href}"

                date_tag = card.find("p", class_="fs13 fc_aux mt15")
                published_at = None
                if date_tag:
                    published_at = parse_relative_date(clean_text(date_tag.get_text()))

                salary_tag = card.find("span", class_="nbs")
                salary_text = clean_text(salary_tag.get_text()) if salary_tag else ""
                salary_min, salary_max = parse_salary(salary_text)

                print(f"[Computrabajo] Detalle: {href}")
                detail = self._scrape_job_detail(href)

                if not detail.get("title"):
                    continue

                tech_text = (
                    f"{detail.get('title', '')} {detail.get('description', '') or ''}"
                )
                technologies = extract_technologies(tech_text)

                jobs.append(
                    {
                        "title": detail["title"],
                        "company": detail.get("company"),
                        "description": detail.get("description"),
                        "location": detail.get("location"),
                        "modality": detail.get("modality") or "on-site",
                        "salary_min": salary_min,
                        "salary_max": salary_max,
                        "url_original": href,
                        "published_at": published_at or datetime.now(timezone.utc),
                        "technologies": technologies,
                    }
                )

                time.sleep(random.uniform(1.5, 3))

            except Exception as e:
                print(f"[Computrabajo] Error: {e}")
                continue

        return jobs

    def _scrape_job_detail(self, url: str) -> dict:
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            result = {}

            # Título
            title_tag = soup.find("p", class_=lambda c: c and "title_offer" in c)
            if title_tag:
                title = clean_text(title_tag.get_text())
                for suffix in [" Vista", " Postulado", " Nuevo", " Destacado"]:
                    if title.endswith(suffix):
                        title = title[: -len(suffix)].strip()
                result["title"] = title

            # Empresa
            company_tag = soup.find(
                "a",
                class_=lambda c: c and "dIB" in c and "fs16" in c and "js-o-link" in c,
                href=lambda h: h and "/empresas/" in h,
            )
            if company_tag:
                company = clean_text(company_tag.get_text())
                if company and len(company) > 1:
                    result["company"] = company

            # Ubicación — siempre viene después del título p.fwB.fs18
            box_border = soup.find("div", class_="box_border")
            if box_border:
                title_p = box_border.find(
                    "p", class_=lambda c: c and "fwB" in c and "fs18" in c
                )
                if title_p:
                    next_p = title_p.find_next_sibling("p", class_="fs16")
                    if next_p:
                        text = clean_text(next_p.get_text())
                        generic = [
                            "las mejores empresas",
                            "portal de empleo",
                            "bolsa de trabajo",
                            "ofertas de trabajo",
                        ]
                        if (
                            text
                            and 3 < len(text) < 80
                            and not any(g in text.lower() for g in generic)
                        ):
                            result["location"] = text

            # Modalidad
            modality_tag = soup.find("p", class_="dFlex mb10")
            if modality_tag:
                modality_text = clean_text(modality_tag.get_text()).lower()
                if "remoto" in modality_text:
                    result["modality"] = "remote"
                elif "híbrido" in modality_text or "hibrido" in modality_text:
                    result["modality"] = "hybrid"
                else:
                    result["modality"] = "on-site"

            # Descripción
            desc_tag = soup.find("div", class_="fs16 t_word_wrap")
            if desc_tag:
                description = clean_text(desc_tag.get_text())
                if description and len(description) > 50:
                    result["description"] = description

            return result

        except Exception as e:
            print(f"[Computrabajo] Error en detalle {url}: {e}")
            return {}

    def parse_job(self, raw_data: dict) -> dict:
        return raw_data
