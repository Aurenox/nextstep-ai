import json
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY

logger = logging.getLogger("nextstep.gemini")

def get_gemini_client():
    if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "":
        return None
    try:
        return genai.Client(api_key=GEMINI_API_KEY.strip())
    except Exception as e:
        logger.error(f"Failed to initialize google-genai client: {e}")
        return None

def gemini_suggest_processes(problem: str, user_location: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Analyzes live typed text from the user and dynamically suggests 3 distinct matching real-world processes.
    Powers the 'Did you mean?' smart suggestions in TaskComposer.
    """
    client = get_gemini_client()
    if client and len(problem.strip()) >= 5:
        prompt = f"""
A user is typing their real-world problem or task in NEXTSTEP:
"{problem}"
User location: {user_location or "Thiruvananthapuram, Kerala"}

Analyze the typed text and provide 3 distinct, specific process variations the user might mean.
Do not use generic categories. Tailor directly to the user's specific keywords.
For example, if they type "I lost my driving licence", suggest:
- 🚗 Duplicate Driving Licence (Apply for a replacement licence)
- 📄 Report Lost Driving Licence (Report loss and get police non-traceable log)
- 🔄 Renew Driving Licence (Renew an existing or expired licence)

Return JSON list of 3 objects with fields:
- id: string (e.g. "sug_1", "sug_2", "sug_3")
- icon: single appropriate emoji (e.g. "🚗", "📄", "🔄", "⚖️", "✈️", "💼", "🎓", "🛡️")
- title: concise process name (3-5 words)
- description: short 1-line explanation of what this path does
- query: refined natural language search query for this process
"""
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            data = json.loads(response.text.strip())
            if isinstance(data, list) and len(data) > 0:
                return data[:3]
        except Exception as e:
            logger.error(f"Gemini process suggestion error: {e}")

    # High-quality dynamic fallback based on keywords in problem
    p_lower = problem.lower()
    if any(k in p_lower for k in ["licence", "license", "driving", "rto", "dl"]):
        return [
            {
                "id": "sug_dl_1",
                "icon": "🚗",
                "title": "Duplicate Driving Licence",
                "description": "Apply for a replacement licence if lost, stolen, or mutilated",
                "query": "Apply for duplicate driving licence replacement online"
            },
            {
                "id": "sug_dl_2",
                "icon": "📄",
                "title": "Report Lost Driving Licence",
                "description": "Report the loss and obtain mandatory police Non-Traceable entry",
                "query": "Report lost driving licence police non traceable certificate"
            },
            {
                "id": "sug_dl_3",
                "icon": "🔄",
                "title": "Renew Driving Licence",
                "description": "Renew an existing or expired licence through Sarathi Parivahan",
                "query": "Renew expired driving licence online procedure"
            }
        ]
    elif any(k in p_lower for k in ["degree", "certificate", "marksheet", "diploma", "university", "ktu"]):
        return [
            {
                "id": "sug_cert_1",
                "icon": "🎓",
                "title": "Duplicate Degree Certificate",
                "description": "Apply for official duplicate degree or marksheet with university",
                "query": "Apply for duplicate degree certificate replacement"
            },
            {
                "id": "sug_cert_2",
                "icon": "📜",
                "title": "Execute Notarized Lost Affidavit",
                "description": "Draft statutory ₹200 Non-Judicial Stamp Paper affidavit required by university",
                "query": "Execute sworn affidavit for lost university certificate"
            },
            {
                "id": "sug_cert_3",
                "icon": "📄",
                "title": "Police Non-Traceable Report",
                "description": "File online lost document entry on State Police Portal",
                "query": "Police GD entry for lost educational certificate"
            }
        ]
    elif any(k in p_lower for k in ["flight", "airline", "cancelled", "refund", "indigo", "air india"]):
        return [
            {
                "id": "sug_fl_1",
                "icon": "✈️",
                "title": "Claim 100% Cancelled Flight Refund",
                "description": "Enforce DGCA Passenger Charter for full refund within 7 days",
                "query": "Claim full refund cancelled flight dgca passenger charter"
            },
            {
                "id": "sug_fl_2",
                "icon": "⚖️",
                "title": "Airline Consumer Grievance Notice",
                "description": "Serve formal deficiency in service legal notice for refund denial",
                "query": "Airline consumer grievance legal notice passenger refund"
            },
            {
                "id": "sug_fl_3",
                "icon": "🔁",
                "title": "Alternate Flight Rescheduling",
                "description": "Request free flight rebooking without rescheduling fees or fare difference",
                "query": "Free rebooking cancelled flight airline alternate flight"
            }
        ]
    elif any(k in p_lower for k in ["warranty", "repair", "laptop", "mobile", "defective", "broken"]):
        return [
            {
                "id": "sug_war_1",
                "icon": "🛡️",
                "title": "Warranty Service Escalation",
                "description": "Demand free repair or replacement under manufacturer warranty terms",
                "query": "Warranty claim dispute free repair service center"
            },
            {
                "id": "sug_war_2",
                "icon": "⚖️",
                "title": "Consumer Court Statutory Notice",
                "description": "Issue legal notice under Section 35 of Consumer Protection Act, 2019",
                "query": "Legal notice defective product under warranty consumer protection act"
            },
            {
                "id": "sug_war_3",
                "icon": "📞",
                "title": "National Consumer Helpline Grievance",
                "description": "Lodge an official grievance on consumerhelpline.gov.in (NCH)",
                "query": "File complaint national consumer helpline defective product"
            }
        ]
    elif any(k in p_lower for k in ["business", "msme", "udyam", "gst", "startup", "company"]):
        return [
            {
                "id": "sug_biz_1",
                "icon": "💼",
                "title": "MSME Udyam Registration",
                "description": "Obtain Government of India Udyam Certificate with zero registration fees",
                "query": "MSME udyam registration official government portal process"
            },
            {
                "id": "sug_biz_2",
                "icon": "🏛️",
                "title": "GST Registration for Business",
                "description": "Apply for GSTIN registration with state commercial taxes department",
                "query": "New GST registration online procedure requirements"
            },
            {
                "id": "sug_biz_3",
                "icon": "📋",
                "title": "Local Municipal Trade Licence",
                "description": "Procure local body / corporation trade licence for commercial operations",
                "query": "Municipal corporation trade license application"
            }
        ]
    else:
        title_words = [w.capitalize() for w in problem.strip().split()[:4]]
        base_title = " ".join(title_words) if title_words else "Citizen Procedure"
        return [
            {
                "id": "sug_gen_1",
                "icon": "📋",
                "title": f"{base_title} Procedure",
                "description": f"Official step-by-step application and clearance for {problem[:30]}...",
                "query": f"{problem} official procedure requirements"
            },
            {
                "id": "sug_gen_2",
                "icon": "🏛️",
                "title": f"Official Authority Inquiry",
                "description": "Inquire with the competent department regarding eligibility and documents",
                "query": f"{problem} department contact helpline"
            },
            {
                "id": "sug_gen_3",
                "icon": "📄",
                "title": "Statutory Document Preparation",
                "description": "Prepare necessary affidavits, declarations, and identity dockets",
                "query": f"{problem} required documents forms affidavit"
            }
        ]

def gemini_analyze_intent(problem: str, user_location: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Uses Gemini to analyze user intent in real-time for ANY natural language problem.
    """
    client = get_gemini_client()
    if not client:
        return None

    prompt = f"""
Analyze this user task: "{problem}"
User location context: {user_location or "None specified"}

Extract:
- goal: 3-6 word clear summary
- category: "Education" | "Government" | "Travel" | "Business" | "Consumer" | "Legal" | "Citizen Services"
- detected_country: Country
- detected_state: State or Province
- detected_city: District or City
- likely_authority: Competent Authority, Ministry, or Corporation responsible
- is_location_needed: boolean

Output JSON only.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        return json.loads(response.text.strip())
    except Exception as e:
        logger.error(f"Gemini intent analysis error: {e}")
    return None

def gemini_resolve_jurisdiction(problem: str, answers: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Uses Gemini to accurately resolve the jurisdictional hierarchy for ANY task.
    """
    client = get_gemini_client()
    if not client:
        return None

    prompt = f"""
Given a user's real-world problem and details:
Problem: "{problem}"
Answers: {json.dumps(answers)}

Determine the precise jurisdictional hierarchy:
- country
- state: State / Province (or "National")
- city: City or District
- jurisdiction_level: "Local" | "State" | "National" | "International"
- authority: Exact competent organization, university, government department, or corporation
- department: Specific branch or wing
- service: Name of the exact procedure or service
- breadcrumb: "Country → State → City → Authority"

Output JSON only.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        return json.loads(response.text.strip())
    except Exception as e:
        logger.error(f"Gemini jurisdiction resolution error: {e}")
    return None

def gemini_plan_searches(problem: str, jurisdiction: Dict[str, Any], answers: Dict[str, str]) -> Optional[List[Dict[str, Any]]]:
    """
    Uses Gemini to generate targeted, credit-conscious SerpApi search queries with exact local jurisdiction terms.
    """
    client = get_gemini_client()
    if not client:
        return None

    prompt = f"""
Problem: "{problem}"
Jurisdiction: {json.dumps(jurisdiction)}
Answers: {json.dumps(answers)}

Formulate 2 targeted SerpApi search queries with official portal terms.
Assign engine: "google" or "google_maps".

Output a JSON list of objects with fields:
- engine: "google" | "google_maps"
- query: string
- intent: string
- priority: integer
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        data = json.loads(response.text.strip())
        if isinstance(data, list):
            return data[:2]
    except Exception as e:
        logger.error(f"Gemini search planner error: {e}")
    return None

def gemini_generate_questions(problem: str, collected_answers: Dict[str, str]) -> Optional[List[Dict[str, Any]]]:
    """
    Uses Gemini to dynamically inspect missing information for any real-world problem.
    """
    client = get_gemini_client()
    if not client:
        return None

    prompt = f"""
Problem: "{problem}"
Collected answers: {json.dumps(collected_answers)}

Determine if critical information is missing to execute the task.
If sufficient information is known, return [].
Else return 1-2 concise questions with suggested options.

Output JSON list of objects with fields: id, question, placeholder, options (list of strings), field_key.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        data = json.loads(response.text.strip())
        if isinstance(data, list):
            return data
    except Exception as e:
        logger.error(f"Gemini question generation error: {e}")
    return None

def gemini_synthesize_action_plan(
    problem: str,
    jurisdiction: Dict[str, Any],
    sources: List[Dict[str, Any]],
    answers: Dict[str, str]
) -> Optional[Dict[str, Any]]:
    """
    Takes live SerpApi search results and uses Gemini to synthesize the complete step-by-step Action Dashboard.
    Strictly uses real sources from SerpApi and answers WHAT, WHY, HOW, WHAT I NEED, WHERE, WHO, WHEN, SOURCE.
    """
    client = get_gemini_client()
    if not client:
        return None

    sources_summary = []
    for s in sources[:6]:
        sources_summary.append({
            "title": s.get("title"),
            "url": s.get("url"),
            "snippet": s.get("snippet")
        })

    prompt = f"""
You are NEXTSTEP — Universal AI Action Agent.
A user needs to complete this real-world task:
Problem: "{problem}"
Jurisdiction: {json.dumps(jurisdiction)}
User Answers: {json.dumps(answers)}

Real search results from SerpApi:
{json.dumps(sources_summary, indent=2)}

Synthesize a complete Action Dashboard with 3-4 steps.
Every single step MUST answer:
- id: "step_1", "step_2", etc.
- order: integer
- title: clear title
- what: what to do
- why: why necessary
- how: precise instructions
- what_i_need: list of required documents/items
- where_label: portal name or office name
- where_url: REAL URL from sources or portal
- who_authority: competent authority
- when_timeline: timeline
- source_title: source name
- source_url: source URL
- source_type: "official" | "trusted"
- status: "in_progress" for step 1, "pending" for others
- is_fast_path_skippable: boolean

Also provide:
- title: Action plan title
- description: short overview
- category: category name
- estimated_time: timeline
- documents: list of documents (id, name, description, is_required, is_held)
- action_map: nodes (id, label, type, status, details) and edges (source, target, animated)
- source_confidence_summary: official_found (boolean), multiple_sources_agree (boolean), verification_note (string)

Output JSON only matching this schema.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        return json.loads(response.text.strip())
    except Exception as e:
        logger.error(f"Gemini action plan synthesis error: {e}")
    return None

def gemini_adaptive_update(process_data: Dict[str, Any], new_information: str) -> Optional[Dict[str, Any]]:
    """
    Uses Gemini to analyze user-pasted authority replies and update the process dynamically.
    """
    client = get_gemini_client()
    if not client:
        return None

    prompt = f"""
Current Process: "{process_data.get('title')}"
Current Steps: {json.dumps([s.get('title') for s in process_data.get('steps', [])])}

The user received this official update from the authority:
"{new_information}"

Analyze the update:
1. What new requirement did the authority state?
2. Formulate a new Step satisfying this requirement with WHAT, WHY, HOW, WHAT I NEED, WHERE, WHO, WHEN.

Output JSON:
{{
  "detected_requirement": "Name of newly detected requirement",
  "new_step": {{
    "id": "step_adaptive_new",
    "order": 1,
    "title": "Clear step title",
    "what": "What to do",
    "why": "Why required",
    "how": "Exact instructions",
    "what_i_need": ["Requirement 1"],
    "where_label": "Where to submit",
    "where_url": "https://services.india.gov.in",
    "who_authority": "Relevant Officer",
    "when_timeline": "Deadline",
    "source_title": "Official Response Communication",
    "source_url": "https://services.india.gov.in",
    "source_type": "official",
    "status": "in_progress",
    "is_fast_path_skippable": false,
    "is_new_step": true
  }}
}}
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        return json.loads(response.text.strip())
    except Exception as e:
        logger.error(f"Gemini adaptive update error: {e}")
    return None
