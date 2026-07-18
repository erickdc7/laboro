import time
import random
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from app.scrapers.base import BaseScraper
from app.scrapers.utils import clean_text, extract_technologies, parse_salary


SEARCH_URLS = [
    "https://www.bumeran.com.pe/empleos-desarrollador-software.html",
    "https://www.bumeran.com.pe/empleos-programador.html",
    "https://www.bumeran.com.pe/empleos-react.html",
    "https://www.bumeran.com.pe/empleos-python.html",
]


def get_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver


class BumeranScraper(BaseScraper):

    def fetch_jobs(self) -> list[dict]:
        raw_jobs = []
        driver = get_driver()

        try:
            for url in SEARCH_URLS:
                try:
                    print(f"[Bumeran] Scrapeando: {url}")
                    jobs_from_page = self._scrape_listing_page(driver, url)
                    raw_jobs.extend(jobs_from_page)
                    time.sleep(random.uniform(3, 5))
                except Exception as e:
                    print(f"[Bumeran] Error en {url}: {e}")
                    continue
        finally:
            driver.quit()

        seen_urls = set()
        unique_jobs = []
        for job in raw_jobs:
            if job["url_original"] not in seen_urls:
                seen_urls.add(job["url_original"])
                unique_jobs.append(job)

        print(f"[Bumeran] Total únicos encontrados: {len(unique_jobs)}")
        return unique_jobs

    def _scrape_listing_page(self, driver, url: str) -> list[dict]:
        driver.get(url)

        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "[class*='job'], [class*='aviso'], article")
                )
            )
        except Exception:
            print(f"[Bumeran] Timeout esperando contenido en {url}")

        time.sleep(2)
        html = driver.page_source
        soup = BeautifulSoup(html, "lxml")

        job_cards = (
            soup.find_all("div", class_=lambda c: c and "aviso" in c.lower()) or
            soup.find_all("article") or
            soup.find_all("div", class_=lambda c: c and "job" in c.lower())
        )

        jobs = []
        for card in job_cards:
            try:
                job_data = self._extract_card_data(card)
                if job_data:
                    jobs.append(job_data)
            except Exception as e:
                print(f"[Bumeran] Error parseando card: {e}")
                continue

        return jobs

    def _extract_card_data(self, card) -> dict | None:
        title_tag = (
            card.find("h2") or
            card.find("h3") or
            card.find("a", class_=lambda c: c and "titulo" in c.lower())
        )
        if not title_tag:
            return None

        title = clean_text(title_tag.get_text())
        if not title or len(title) < 5:
            return None

        link_tag = card.find("a", href=True)
        if not link_tag:
            return None

        href = link_tag["href"]
        if not href.startswith("http"):
            href = f"https://www.bumeran.com.pe{href}"

        company_tag = (
            card.find("span", class_=lambda c: c and "empresa" in c.lower()) or
            card.find("p", class_=lambda c: c and "empresa" in c.lower()) or
            card.find("a", class_=lambda c: c and "empresa" in c.lower())
        )
        company = clean_text(company_tag.get_text()) if company_tag else None

        location_tag = (
            card.find("span", class_=lambda c: c and "localidad" in c.lower()) or
            card.find("span", class_=lambda c: c and "ubicacion" in c.lower()) or
            card.find("p", class_=lambda c: c and "lugar" in c.lower())
        )
        location = clean_text(location_tag.get_text()) if location_tag else "Lima"

        salary_tag = card.find(
            class_=lambda c: c and ("salario" in c.lower() or "sueldo" in c.lower())
        )
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

    def parse_job(self, raw_data: dict) -> dict:
        return raw_data