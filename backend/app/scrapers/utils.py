import re


TECHNOLOGIES = [
    "React", "Vue", "Angular", "Next.js", "TypeScript", "JavaScript",
    "Python", "FastAPI", "Django", "Flask", "Node.js", "Express",
    "Java", "Spring", "PHP", "Laravel", "Ruby", "Rails",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Git", "Linux", "Scrum", "Agile",
    "React Native", "Flutter", "Swift", "Kotlin",
    "GraphQL", "REST", "Microservices",
]


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
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
    numbers = re.findall(r'\d+[\.,]?\d*', text.replace(",", ""))
    numbers = [int(float(n)) for n in numbers if n]
    if len(numbers) >= 2:
        return min(numbers), max(numbers)
    elif len(numbers) == 1:
        return numbers[0], None
    return None, None