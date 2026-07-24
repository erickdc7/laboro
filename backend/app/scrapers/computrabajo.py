import requests
import time
import random
from bs4 import BeautifulSoup
from datetime import datetime, timezone

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
        job_cards = soup.find_all("article", class_="box_offer")

        if not job_cards:
            job_cards = soup.find_all("div", class_="box_offer")

        jobs = []
        for card in job_cards:
            try:
                job_data = self._extract_card_data(card)
                if job_data:
                    # Entrar al detalle para obtener empresa, ubicación y descripción
                    print(
                        f"[Computrabajo] Scrapeando detalle: {job_data['url_original']}"
                    )
                    detail = self._scrape_job_detail(job_data["url_original"])

                    # Sobrescribir con datos del detalle si son más precisos
                    if detail["company"]:
                        job_data["company"] = detail["company"]
                    if detail["location"]:
                        job_data["location"] = detail["location"]
                    if detail["description"]:
                        job_data["description"] = detail["description"]

                    jobs.append(job_data)
                    time.sleep(random.uniform(1, 2))
            except Exception as e:
                print(f"[Computrabajo] Error parseando card: {e}")
                continue

        return jobs

    def _extract_card_data(self, card) -> dict | None:
        title_tag = (
            card.find("h2")
            or card.find("a", class_="js-o-link")
            or card.find("a", {"data-cy": "card-job-link"})
        )
        if not title_tag:
            return None

        title = clean_text(title_tag.get_text())

        # Limpiar sufijos que agrega Computrabajo al título
        for suffix in [" Vista", " Postulado", " Nuevo", " Destacado"]:
            if title.endswith(suffix):
                title = title[: -len(suffix)].strip()

        if not title:
            return None

        link_tag = card.find("a", href=True)
        if not link_tag:
            return None

        href = link_tag["href"]
        if not href.startswith("http"):
            href = f"https://pe.computrabajo.com{href}"

        # Buscar empresa con más selectores
        company_tag = (
            card.find("a", class_="fc_base")
            or card.find("p", class_="fs16")
            or card.find("span", class_="company")
            or card.find("a", {"data-cy": "card-job-company"})
            or card.find("p", class_="dIB fs16 fc_base mt5")
            or card.find("span", class_="fc_base t_ellipsis")
        )

        # Si no encontró empresa con selectores, buscar el segundo texto prominente
        if not company_tag:
            texts = [
                p
                for p in card.find_all(["p", "span", "a"])
                if p.get_text(strip=True)
                and p.get_text(strip=True) != title
                and len(p.get_text(strip=True)) > 2
                and len(p.get_text(strip=True)) < 80
            ]
            company = clean_text(texts[0].get_text()) if texts else None
        else:
            company = clean_text(company_tag.get_text())

        # Verificar que la empresa no sea igual al título
        if company and company == title:
            company = None

        location_tag = (
            card.find("span", class_="ubic")
            or card.find("p", class_="fs13 fc_base mt5")
            or card.find("span", attrs={"data-cy": "card-job-location"})
        )
        location = clean_text(location_tag.get_text()) if location_tag else "Lima"

        salary_tag = card.find("span", class_="nbs")
        salary_text = clean_text(salary_tag.get_text()) if salary_tag else ""
        salary_min, salary_max = parse_salary(salary_text)

        description_text = f"{title} {company or ''}"
        technologies = extract_technologies(description_text)

        return {
            "title": title,
            "company": company,
            "description": None,
            "location": location,
            "modality": self._detect_modality(card),
            "salary_min": salary_min,
            "salary_max": salary_max,
            "url_original": href,
            "published_at": datetime.now(timezone.utc),
            "technologies": technologies,
        }

    def _detect_modality(self, card) -> str:
        text = card.get_text().lower()
        if "remoto" in text or "remote" in text or "teletrabajo" in text:
            return "remote"
        elif "híbrido" in text or "hibrido" in text or "hybrid" in text:
            return "hybrid"
        return "on-site"

    def _scrape_job_detail(self, url: str) -> dict:
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            # Empresa — buscar en el panel derecho del detalle
            company = None
            company_tag = (
                soup.find("a", class_="dIB fs16 js-o-link")
                or soup.find("a", class_="js-o-link fs16")
                or soup.find("a", class_="fc_base t_ellipsis dIB")
            )
            if company_tag:
                company = clean_text(company_tag.get_text())

            # Ubicación
            location = None
            location_candidates = soup.find_all("p", class_="fs16")
            for p in location_candidates:
                text = clean_text(p.get_text())
                if text and len(text) > 3 and text != company:
                    location = text
                    break

            # Descripción completa
            description = None
            desc_tag = (
                soup.find("div", class_="description_offer")
                or soup.find("section", class_="box_border")
                or soup.find("div", {"id": "description_offer"})
                or soup.find("div", class_="offer-description")
            )
            if desc_tag:
                description = clean_text(desc_tag.get_text())

            return {
                "company": company,
                "location": location,
                "description": description,
            }
        except Exception as e:
            print(f"[Computrabajo] Error scrapeando detalle {url}: {e}")
            return {"company": None, "location": None, "description": None}

    def parse_job(self, raw_data: dict) -> dict:
        return raw_data
