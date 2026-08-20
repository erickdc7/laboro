import os
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
from app.scrapers.utils import clean_text, extract_technologies, parse_relative_date

SEARCH_URLS = [
    "https://www.bumeran.com.pe/empleos-busqueda-programador.html",
    "https://www.bumeran.com.pe/empleos-busqueda-fullstack.html",
    "https://www.bumeran.com.pe/empleos-busqueda-react.html",
    "https://www.bumeran.com.pe/empleos-busqueda-python.html",
]

CHROME_BIN_PATH = "/opt/render/project/.render/chrome/opt/google/chrome/google-chrome"


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

    if os.path.exists(CHROME_BIN_PATH):
        options.binary_location = CHROME_BIN_PATH

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
                EC.presence_of_element_located((By.TAG_NAME, "h2"))
            )
        except Exception:
            print(f"[Bumeran] Timeout esperando contenido en {url}")

        time.sleep(2)
        html = driver.page_source
        soup = BeautifulSoup(html, "lxml")

        job_cards = soup.find_all(
            "a",
            href=lambda h: h and h.startswith("/empleos/") and h.endswith(".html"),
        )
        print(f"[Bumeran] Cards encontrados: {len(job_cards)}")

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
        title_tag = card.find("h2")
        if not title_tag:
            return None

        title = clean_text(title_tag.get_text())
        if not title:
            return None

        href = card.get("href")
        if not href:
            return None
        if not href.startswith("http"):
            href = f"https://www.bumeran.com.pe{href}"

        h3_tags = card.find_all("h3")
        published_at = None
        company = None
        if len(h3_tags) >= 1:
            published_at = parse_relative_date(clean_text(h3_tags[0].get_text()))
        if len(h3_tags) >= 2:
            company = clean_text(h3_tags[1].get_text())

        location = None
        location_icon = card.find("i", attrs={"aria-label": "Ubicación"})
        if location_icon:
            loc_h3 = location_icon.find_next("h3")
            if loc_h3:
                location = clean_text(loc_h3.get_text())

        modality = "on-site"
        modality_icon = card.find("i", attrs={"aria-label": "Modalidad"})
        if modality_icon:
            mod_h3 = modality_icon.find_next("h3")
            if mod_h3:
                modality_text = clean_text(mod_h3.get_text()).lower()
                if "remoto" in modality_text:
                    modality = "remote"
                elif "hibrid" in modality_text:
                    modality = "hybrid"

        description = None
        desc_p = card.find("p")
        if desc_p:
            description = clean_text(desc_p.get_text())

        tech_text = f"{title} {description or ''}"
        technologies = extract_technologies(tech_text)

        return {
            "title": title,
            "company": company,
            "description": description,
            "location": location,
            "modality": modality,
            "salary_min": None,
            "salary_max": None,
            "url_original": href,
            "published_at": published_at or datetime.now(timezone.utc),
            "technologies": technologies,
        }

    def parse_job(self, raw_data: dict) -> dict:
        return raw_data
