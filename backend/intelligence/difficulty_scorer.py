def score_answer(answer, skills, experience, has_project):
    score = 0

    if len(answer.split()) > 30:
        score += 1
    if len(skills) >= 2:
        score += 1
    if experience > 0:
        score += 1
    if has_project:
        score += 2
    if any(x in answer.lower() for x in ["challenge", "problem", "solved"]):
        score += 1

    return score
