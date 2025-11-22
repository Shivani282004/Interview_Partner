import re

def extract_skills(answer):
    skills = []

    tech_keywords = [
        "python", "java", "react", "node", "sql", "mongodb", "django", "aws",
        "analysis", "excel", "communication", "leadership", "sales", "service"
    ]

    for key in tech_keywords:
        if key in answer.lower():
            skills.append(key)

    return skills


def extract_projects(answer):
    if "project" in answer.lower():
        return True
    return False


def extract_experience(answer):
    match = re.search(r"(\d+)\s+year", answer.lower())
    return int(match.group(1)) if match else 0
