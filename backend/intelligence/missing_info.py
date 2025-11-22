def detect_missing_info(role, answer, skills, experience, has_project):

    missing = []

    if role in ["software_engineer", "backend_developer"]:
        if not has_project:
            missing.append("project")
        if len(skills) == 0:
            missing.append("skills")
        if experience == 0:
            missing.append("experience")

    elif role == "data_analyst":
        if len(skills) == 0:
            missing.append("tools")
        if "analysis" not in answer.lower():
            missing.append("analysis_detail")

    elif role == "sales_associate":
        if "customer" not in answer.lower():
            missing.append("customer_story")

    elif role == "retail_associate":
        if "service" not in answer.lower():
            missing.append("service_quality")

    elif role == "hr_interview":
        if "conflict" not in answer.lower():
            missing.append("conflict_resolution")

    elif role == "product_manager":
        if "product" not in answer.lower():
            missing.append("product_case")

    return missing
