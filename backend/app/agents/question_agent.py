from typing import Dict, List, Any
from app.agents.gemini_agent import gemini_generate_questions

def get_followup_questions(problem: str, collected_answers: Dict[str, str] = None) -> Dict[str, Any]:
    """
    Evaluates what critical parameters are missing based on the problem and collected answers.
    Uses Gemini API if configured; otherwise uses fast rule-based questions.
    Returns targeted follow-up questions with a countdown counter (e.g. '2 questions remaining').
    """
    if collected_answers is None:
        collected_answers = {}

    # 1. Try Gemini Dynamic Question Engine if API key is active
    gemini_questions = gemini_generate_questions(problem, collected_answers)
    if gemini_questions is not None:
        return {
            "questions": gemini_questions,
            "remaining_count": len(gemini_questions),
            "is_complete": len(gemini_questions) == 0
        }
        
    problem_lower = problem.lower()
    questions: List[Dict[str, Any]] = []

    # Scenario 1: University / Certificate / Marksheet
    if any(k in problem_lower for k in ["certificate", "degree", "marksheet", "diploma", "graduate"]):
        if "certificate_type" not in collected_answers and not any(w in problem_lower for w in ["btech", "mtech", "degree", "provisional", "10th", "12th", "diploma"]):
            questions.append({
                "id": "q_cert_type",
                "question": "Which specific certificate or qualification did you lose?",
                "placeholder": "e.g., BTech Degree Certificate, Consolidated Marksheet",
                "options": ["BTech Degree Certificate", "Provisional Certificate", "Consolidated Grade Card", "Migration Certificate"],
                "field_key": "certificate_type"
            })
            
        if "university" not in collected_answers and not any(w in problem_lower for w in ["ktu", "delhi university", "du", "anna university", "calicut", "mumbai university", "vtu"]):
            questions.append({
                "id": "q_univ",
                "question": "Which university or board issued the certificate?",
                "placeholder": "e.g., KTU (Kerala Technological University), Anna University, VTU",
                "options": ["KTU (Kerala)", "Anna University (Tamil Nadu)", "VTU (Karnataka)", "Delhi University (DU)"],
                "field_key": "university"
            })
            
        if "location" not in collected_answers and not any(w in problem_lower for w in ["kerala", "thiruvananthapuram", "cochin", "delhi", "bangalore", "chennai"]):
            questions.append({
                "id": "q_loc",
                "question": "Which city/state are you currently residing or applying from?",
                "placeholder": "e.g., Thiruvananthapuram, Kerala",
                "options": ["Thiruvananthapuram, Kerala", "Kochi, Kerala", "Bengaluru, Karnataka", "New Delhi"],
                "field_key": "location"
            })

    # Scenario 2: Flight Cancellation
    elif any(k in problem_lower for k in ["flight", "cancelled", "airline", "refund", "ticket"]):
        if "airline_name" not in collected_answers and not any(w in problem_lower for w in ["indigo", "air india", "spicejet", "akasa", "vistara", "emirates"]):
            questions.append({
                "id": "q_airline",
                "question": "Which airline operated the cancelled flight?",
                "placeholder": "e.g., IndiGo, Air India, SpiceJet",
                "options": ["IndiGo", "Air India", "SpiceJet", "Akasa Air"],
                "field_key": "airline_name"
            })
            
        if "has_pnr" not in collected_answers:
            questions.append({
                "id": "q_pnr",
                "question": "Do you have your 6-character PNR or booking reference ready?",
                "placeholder": "e.g., Yes / My PNR is AB12CD",
                "options": ["Yes, I have the PNR code", "No, I only have the ticket copy", "Booked through travel agent (MakeMyTrip/Goibibo)"],
                "field_key": "has_pnr"
            })

    # Scenario 3: Start a Small Business
    elif any(k in problem_lower for k in ["business", "company", "startup", "trade license", "msme", "shop"]):
        if "biz_type" not in collected_answers:
            questions.append({
                "id": "q_biz_type",
                "question": "What type of business are you planning to establish?",
                "placeholder": "e.g., Sole Proprietorship, LLP, Retail Store, Online E-commerce",
                "options": ["Sole Proprietorship", "Private Limited (Pvt Ltd)", "Retail / Food Shop", "IT / Consulting Services"],
                "field_key": "biz_type"
            })
            
        if "location" not in collected_answers:
            questions.append({
                "id": "q_biz_loc",
                "question": "In which city and state will the business operate?",
                "placeholder": "e.g., Kochi, Kerala or Bengaluru, Karnataka",
                "options": ["Kochi, Kerala", "Thiruvananthapuram, Kerala", "Bengaluru, Karnataka", "Mumbai, Maharashtra"],
                "field_key": "location"
            })

    # Scenario 4: Study Abroad
    elif any(k in problem_lower for k in ["study abroad", "student visa", "germany", "ielts", "blocked account"]):
        if "target_country" not in collected_answers and not any(w in problem_lower for w in ["germany", "usa", "uk", "canada", "australia"]):
            questions.append({
                "id": "q_country",
                "question": "Which country are you intending to study in?",
                "placeholder": "e.g., Germany, United Kingdom, USA, Canada",
                "options": ["Germany", "United Kingdom", "United States", "Canada"],
                "field_key": "target_country"
            })
            
        if "admission_status" not in collected_answers:
            questions.append({
                "id": "q_admission",
                "question": "Do you already hold an unconditional admission letter?",
                "placeholder": "e.g., Yes / Awaiting university response",
                "options": ["Yes, I have received the admission offer", "Awaiting university result", "Currently shortlisting universities"],
                "field_key": "admission_status"
            })

    # Scenario 5: Warranty / Defective Product
    elif any(k in problem_lower for k in ["warranty", "defective", "broken", "laptop", "phone", "repair"]):
        if "brand_name" not in collected_answers:
            questions.append({
                "id": "q_brand",
                "question": "What is the brand and product model?",
                "placeholder": "e.g., Apple iPhone 14, Dell Inspiron Laptop, Samsung TV",
                "options": ["Apple", "Samsung", "Dell / HP / Lenovo", "Home Appliance"],
                "field_key": "brand_name"
            })
            
        if "has_invoice" not in collected_answers:
            questions.append({
                "id": "q_inv",
                "question": "Do you have the purchase tax invoice and is it within the warranty period?",
                "placeholder": "e.g., Yes, purchased 6 months ago on Amazon",
                "options": ["Yes, under valid manufacturer warranty", "Invoice available but warranty just expired", "Invoice lost"],
                "field_key": "has_invoice"
            })

    # Fallback generic question if no specific match
    if not questions and not collected_answers:
        questions.append({
            "id": "q_generic_loc",
            "question": "Which city and state does this procedure involve?",
            "placeholder": "e.g., Thiruvananthapuram, Kerala, India",
            "options": ["Thiruvananthapuram, Kerala", "Kochi, Kerala", "Bengaluru, Karnataka", "Delhi NCR"],
            "field_key": "location"
        })

    remaining_count = len(questions)
    is_complete = (remaining_count == 0)

    return {
        "questions": questions,
        "remaining_count": remaining_count,
        "is_complete": is_complete
    }
