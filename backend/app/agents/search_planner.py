from typing import List, Dict, Any
from app.agents.gemini_agent import gemini_plan_searches

def plan_searches(problem: str, jurisdiction: Dict[str, Any], answers: Dict[str, str]) -> List[Dict[str, Any]]:
    """
    Formulates a targeted, credit-conscious search plan using SerpApi engines:
    - Google Web (official procedures, rules, forms)
    - Google Maps (exact physical offices, notary desks, service centers)
    - Google News (recent rule updates or portal transitions)
    - YouTube (step-by-step walkthroughs/demos)
    
    Uses Gemini AI if active to build search terms tailored to the exact jurisdiction and problem.
    """
    # 1. Try Gemini Dynamic Search Planner
    gemini_searches = gemini_plan_searches(problem, jurisdiction, answers)
    if gemini_searches and len(gemini_searches) > 0:
        return gemini_searches[:3]

    state = jurisdiction.get("state", "")
    city = jurisdiction.get("city", "")
    authority = jurisdiction.get("authority", "")
    problem_lower = problem.lower()
    
    search_plan = []

    if "certificate" in problem_lower or "degree" in problem_lower:
        search_plan.append({
            "engine": "google",
            "query": f"{authority} duplicate degree certificate procedure application form {state}",
            "intent": "official_procedure",
            "priority": 1
        })
        search_plan.append({
            "engine": "google_maps",
            "query": f"Notary advocate or District Court Complex {city}",
            "intent": "affidavit_location",
            "priority": 2
        })
        search_plan.append({
            "engine": "youtube",
            "query": f"how to apply duplicate certificate {authority} online portal",
            "intent": "tutorial_walkthrough",
            "priority": 3
        })

    elif "flight" in problem_lower or "airline" in problem_lower:
        search_plan.append({
            "engine": "google",
            "query": "DGCA passenger rights cancellation refund rules CAR Section 3 official",
            "intent": "statutory_regulation",
            "priority": 1
        })
        search_plan.append({
            "engine": "google_news",
            "query": "DGCA flight cancellation refund guidelines latest amendments",
            "intent": "recent_amendments",
            "priority": 2
        })

    elif "business" in problem_lower or "msme" in problem_lower:
        search_plan.append({
            "engine": "google",
            "query": f"Udyam registration free official portal msme gov in {state}",
            "intent": "official_procedure",
            "priority": 1
        })
        search_plan.append({
            "engine": "google_maps",
            "query": f"District Industries Centre or MSME Development Institute {city}",
            "intent": "physical_office",
            "priority": 2
        })

    elif "study abroad" in problem_lower or "visa" in problem_lower:
        search_plan.append({
            "engine": "google",
            "query": "German national student visa checklist VFS Auswaertiges Amt official",
            "intent": "official_checklist",
            "priority": 1
        })
        search_plan.append({
            "engine": "google_maps",
            "query": f"VFS Global German Visa Application Centre {city}",
            "intent": "appointment_centre",
            "priority": 2
        })

    elif "warranty" in problem_lower or "defective" in problem_lower:
        brand = answers.get("brand_name", "electronics")
        search_plan.append({
            "engine": "google",
            "query": "National Consumer Helpline consumerhelpline gov in defective warranty claim",
            "intent": "statutory_redressal",
            "priority": 1
        })
        search_plan.append({
            "engine": "google_maps",
            "query": f"{brand} authorized service center {city}",
            "intent": "service_center",
            "priority": 2
        })

    else:
        search_plan.append({
            "engine": "google",
            "query": f"{problem} {city} {state} official procedure portal",
            "intent": "general_official",
            "priority": 1
        })

    return search_plan[:3]  # Enforce credit protection cap
