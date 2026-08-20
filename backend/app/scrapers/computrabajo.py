import requests
import time
import random
from bs4 import BeautifulSoup
from datetime import datetime, timezone

from app.scrapers.base import BaseScraper
from app.scrapers.utils import (
    clean_text,
    extract_technologies,
    parse_salary,
    parse_relative_date,
)

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

        print(f"[Computrabajo] Cards encontrados: {len(left_cards)}")

        jobs = []
        for i, card in enumerate(left_cards):
            try:
                link_tag = card.find("a", href=True)
                if not link_tag:
                    print(f"[Computrabajo] Card {i}: sin link_tag")
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

                detail = self._scrape_job_detail(href)

                if not detail.get("title"):
                    print(f"[Computrabajo] Card {i}: sin título, saltando")
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
                print(f"[Computrabajo] Error card {i}: {e}")
                continue

        print(f"[Computrabajo] Jobs en esta página: {len(jobs)}")
        return jobs

    def _scrape_job_detail(self, url: str) -> dict:
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")

            result = {}

            # Título — h1.box_detail
            title_tag = soup.find("h1", class_=lambda c: c and "box_detail" in c)
            if title_tag:
                title = clean_text(title_tag.get_text())
                for suffix in [" Vista", " Postulado", " Nuevo", " Destacado"]:
                    if title.endswith(suffix):
                        title = title[: -len(suffix)].strip()
                result["title"] = title

                # Empresa + Ubicación — SIEMPRE están juntas en el <p class="fs16">
                # que viene justo después del <h1>, formato "Empresa - Ubicación"
                info_p = title_tag.find_next_sibling("p", class_="fs16")
                if info_p:
                    info_text = clean_text(info_p.get_text())
                    if " - " in info_text:
                        company_part, location_part = info_text.split(" - ", 1)
                        company_part = company_part.strip()
                        location_part = location_part.strip()
                        if company_part:
                            result["company"] = company_part
                        if location_part:
                            result["location"] = location_part
                    elif info_text:
                        result["location"] = info_text

            # Fallback — solo si algo faltó, busca en el panel lateral box_border
            if not result.get("company") or not result.get("location"):
                box_resume = soup.find("div", class_=lambda c: c and "box_resume" in c)
                if box_resume:
                    box_border = box_resume.find("div", class_="box_border")
                    if box_border:
                        if not result.get("company"):
                            company_tag = box_border.find(
                                "a",
                                class_=lambda c: (
                                    c
                                    and "dIB" in c
                                    and "fs16" in c
                                    and "js-o-link" in c
                                ),
                            )
                            if company_tag:
                                company = clean_text(company_tag.get_text())
                                if company:
                                    result["company"] = company

                        if not result.get("location"):
                            sidebar_title = box_border.find(
                                "p", class_=lambda c: c and "fwB" in c and "fs18" in c
                            )
                            if sidebar_title:
                                loc_p = sidebar_title.find_next_sibling(
                                    "p", class_="fs16"
                                )
                                if loc_p:
                                    location = clean_text(loc_p.get_text())
                                    if location:
                                        result["location"] = location

            # Modalidad
            full_text = soup.get_text().lower()
            if (
                "modalidad: remota" in full_text
                or "100% remoto" in full_text
                or "trabajo remoto" in full_text
            ):
                result["modality"] = "remote"
            elif (
                "híbrido" in full_text
                or "hibrido" in full_text
                or "presencial y remoto" in full_text
            ):
                result["modality"] = "hybrid"
            else:
                result["modality"] = "on-site"

            # Descripción — dentro del div "oferta", el primer p.mbB
            oferta_div = soup.find("div", attrs={"div-link": "oferta"})
            if oferta_div:
                desc_p = oferta_div.find("p", class_="mbB")
                if desc_p:
                    description = clean_text(desc_p.get_text())
                    if description and len(description) > 50:
                        result["description"] = description

            return result

        except Exception as e:
            print(f"[Computrabajo] Error en detalle {url}: {e}")
            return {}

    def parse_job(self, raw_data: dict) -> dict:
        return raw_data
