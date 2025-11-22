from .question_bank import question_bank

def generate_next_question(role, missing_info, score):

    # Missing info → priority
    if "project" in missing_info:
        return "Can you describe a project you worked on and your contribution?"

    if "skills" in missing_info:
        return "Which technical skills are you strongest at?"

    if "experience" in missing_info:
        return "How many years of experience do you have in this field?"

    if "analysis_detail" in missing_info:
        return "Can you walk me through your approach to analyzing a dataset?"

    if "customer_story" in missing_info:
        return "Tell me about a time you handled a customer successfully."

    if "service_quality" in missing_info:
        return "How do you ensure excellent customer service?"

    if "conflict_resolution" in missing_info:
        return "Describe a conflict you resolved between team members."

    if "product_case" in missing_info:
        return "Tell me about a product you helped improve."

    # No missing info → difficulty-based question
    if score <= 2:
        return question_bank[role]["easy"][0]
    elif score <= 4:
        return question_bank[role]["medium"][0]
    else:
        return question_bank[role]["hard"][0]
