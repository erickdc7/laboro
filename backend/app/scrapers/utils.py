import re
from datetime import datetime, timezone, timedelta

TECHNOLOGIES = [
    "React",
    "Vue",
    "Angular",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "FastAPI",
    "Django",
    "Flask",
    "Node.js",
    "Express",
    "Java",
    "Spring",
    "PHP",
    "Laravel",
    "Ruby",
    "Rails",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "Linux",
    "Scrum",
    "Agile",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "GraphQL",
    "REST",
    "Microservices",
]


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_technologies(text: str) -> list[str]:
    if not text:
        return []
    found = []
    text_lower = text.lower()
    for tech in TECHNOLOGIES:
        if tech.lower() in text_lower:
            found.append(tech)
    return found


def parse_salary(text: str) -> tuple[int | None, int | None]:
    if not text:
        return None, None
    numbers = re.findall(r"\d+[\.,]?\d*", text.replace(",", ""))
    numbers = [int(float(n)) for n in numbers if n]
    if len(numbers) >= 2:
        return min(numbers), max(numbers)
    elif len(numbers) == 1:
        return numbers[0], None
    return None, None


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
