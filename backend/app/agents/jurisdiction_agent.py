from typing import Dict, Any
from app.agents.gemini_agent import gemini_resolve_jurisdiction

def resolve_jurisdiction(problem: str, answers: Dict[str, str]) -> Dict[str, Any]:
    """
    Resolves full location and jurisdictional hierarchy:
    Country -> State / Province -> District / City -> Local Authority -> Department -> Specific Service.
    Uses Gemini AI if configured to identify the exact real-world authority for ANY task!
    """
    # 1. Try Gemini Live Jurisdiction Resolution
    gemini_jur = gemini_resolve_jurisdiction(problem, answers)
    if gemini_jur and "authority" in gemini_jur:
        return gemini_jur

    combined_text = f"{problem} " + " ".join(answers.values()).lower()
    
    country = "India"
    state = "Regional"
    city = "Local Area"
    level = "State & Municipal"
    authority = "Competent Municipal or Departmental Authority"
    department = "Citizen Services Wing"
    service = "Public Service Procedure"

    # Location cues in text
    if "germany" in combined_text:
        country = "Germany / Federal Republic"
        state = "Consular Jurisdiction"
        city = "German Consulate & VFS Global"
        level = "International / Consular"
        authority = "Auswärtiges Amt (German Federal Foreign Office)"
        department = "Visa & Immigration Section"
        service = "National Visa Type D (Student Residence)"
    elif "flight" in combined_text or "airline" in combined_text:
        country = "India"
        state = "National Level (MoCA)"
        city = "All Indian Airports"
        level = "National Statutory Authority"
        authority = "Directorate General of Civil Aviation (DGCA)"
        department = "Passenger Grievance & Enforcement Cell"
        service = "Statutory Flight Refund & Cancellation Compensation"
    elif "msme" in combined_text or "business" in combined_text or "udyam" in combined_text:
        country = "India"
        state = "Kerala" if "kerala" in combined_text else "State Revenue Dept"
        city = "Kochi" if "kochi" in combined_text else "Local Municipal Area"
        level = "Multi-tier (National MSME + Local ULB)"
        authority = "Ministry of MSME & Urban Local Body"
        department = "Trade Licensing & Udyam Cell"
        service = "Commercial Enterprise Formalization"
    elif "warranty" in combined_text or "defective" in combined_text or "consumer" in combined_text:
        country = "India"
        state = "National Consumer Protection"
        city = "District Consumer Redressal Forum"
        level = "Statutory Consumer Protection"
        authority = "Department of Consumer Affairs / NCH"
        department = "Grievance Redressal Cell (INGRAM)"
        service = "Consumer Protection Act Defective Goods Replacement"
    elif "delhi" in combined_text:
        country = "India"
        state = "Delhi NCR"
        city = "New Delhi"
        authority = "Delhi State Authority"
        level = "State & Municipal"
    elif "bangalore" in combined_text or "bengaluru" in combined_text or "karnataka" in combined_text:
        country = "India"
        state = "Karnataka"
        city = "Bengaluru"
        authority = "Government of Karnataka / BBMP"
        level = "State & Local"

    # Check answers for specific location overrides
    if "location" in answers and answers["location"]:
        loc = answers["location"]
        parts = [p.strip() for p in loc.split(",")]
        if len(parts) >= 2:
            city = parts[0]
            state = parts[1]
        elif len(parts) == 1:
            city = parts[0]

    return {
        "country": country,
        "state": state,
        "city": city,
        "jurisdiction_level": level,
        "authority": authority,
        "department": department,
        "service": service,
        "breadcrumb": f"{country} → {state} → {city} → {authority}"
    }
