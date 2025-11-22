from .skill_extractor import extract_skills, extract_experience, extract_projects
from .missing_info import detect_missing_info
from .difficulty_scorer import score_answer
from .question_generator import generate_next_question

def get_next_question(role, answer):

    skills = extract_skills(answer)
    experience = extract_experience(answer)
    has_project = extract_projects(answer)

    missing_info = detect_missing_info(role, answer, skills, experience, has_project)
    difficulty_score = score_answer(answer, skills, experience, has_project)

    next_question = generate_next_question(role, missing_info, difficulty_score)

    return {
        "skills": skills,
        "experience": experience,
        "has_project": has_project,
        "missing_info": missing_info,
        "difficulty_score": difficulty_score,
        "next_question": next_question
    }
