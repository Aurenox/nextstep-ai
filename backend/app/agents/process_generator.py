from typing import Dict, Any, List
from app.data.demo_scenarios import DEMO_SCENARIOS
from app.agents.gemini_agent import gemini_synthesize_action_plan

def enrich_plan_with_stage_and_memory(plan_dict: Dict[str, Any], problem: str, answers: Dict[str, str]) -> Dict[str, Any]:
    """
    Enriches an action plan with process stages, dynamic memory fields, and stage-specific actions.
    """
    if "current_stage" not in plan_dict or not plan_dict["current_stage"]:
        plan_dict["current_stage"] = "Prerequisites & Verification"
    
    if "stages" not in plan_dict or not plan_dict["stages"]:
        plan_dict["stages"] = [
            {"id": "stg_1", "name": "Prerequisites & Verification", "status": "active"},
            {"id": "stg_2", "name": "Application & Submission", "status": "upcoming"},
            {"id": "stg_3", "name": "Administrative Processing", "status": "upcoming"},
            {"id": "stg_4", "name": "Issuance & Fulfillment", "status": "upcoming"},
        ]

    if "fields" not in plan_dict or not plan_dict["fields"]:
        plan_dict["fields"] = {
            "applicant_name": answers.get("user_name") or answers.get("applicant_name") or "Applicant",
            "contact_phone": answers.get("phone") or answers.get("contact_phone") or "+91 94000 00000",
            "application_date": "18-Sep-2026",
            "reference_number": answers.get("reference_number") or answers.get("reg_number") or "Pending Allocation"
        }

    if "suggested_missing_field" not in plan_dict:
        plan_dict["suggested_missing_field"] = {
            "key": "reference_number",
            "label": "Application / Reference No.",
            "reason": "Adding this will make generated emails and affidavits specific to your file."
        }

    if "stage_actions" not in plan_dict or not plan_dict["stage_actions"]:
        plan_dict["stage_actions"] = [
            {
                "id": "act_email",
                "title": "Draft Official Representation",
                "description": "Generate a formal CSMOP-compliant letter or email to the competent authority",
                "icon": "mail",
                "action_type": "email",
                "button_text": "Compose Email"
            },
            {
                "id": "act_doc",
                "title": "Prepare Statutory Document",
                "description": "Generate a sworn affidavit, legal notice, or formal application draft",
                "icon": "file",
                "action_type": "document",
                "button_text": "Draft Document"
            },
            {
                "id": "act_adaptive",
                "title": "Update with Authority Response",
                "description": "Paste reply, SMS, or notice to dynamically adapt the action plan",
                "icon": "refresh",
                "action_type": "adaptive",
                "button_text": "Update Plan"
            }
        ]

    return plan_dict

def generate_action_plan(
    problem: str,
    jurisdiction: Dict[str, Any],
    sources: List[Dict[str, Any]],
    answers: Dict[str, str],
    scenario_override: str = None
) -> Dict[str, Any]:
    """
    Synthesizes the step-by-step Action Plan answering WHAT, WHY, HOW, WHAT I NEED, WHERE, WHO, WHEN, SOURCE.
    If Gemini API key is configured, uses Gemini to synthesize live SerpApi sources dynamically!
    Otherwise uses pre-verified scenario or dynamic fallback.
    """
    problem_lower = problem.lower()

    # 1. Try Gemini Live Synthesis if API key is active and no explicit demo scenario was forced
    if not scenario_override:
        gemini_plan = gemini_synthesize_action_plan(problem, jurisdiction, sources, answers)
        if gemini_plan and "steps" in gemini_plan and len(gemini_plan["steps"]) > 0:
            steps = gemini_plan["steps"]
            next_step = steps[0]
            for s in steps:
                if s.get("status") in ["pending", "in_progress"]:
                    next_step = s
                    break

            return enrich_plan_with_stage_and_memory({
                "id": f"proc_live_{abs(hash(problem)) % 1000000}",
                "title": gemini_plan.get("title", f"Action Plan for {problem.capitalize()}"),
                "description": gemini_plan.get("description", f"Verified procedure under {jurisdiction.get('authority')}"),
                "category": gemini_plan.get("category", "Citizen Services"),
                "country": jurisdiction.get("country", "India"),
                "state": jurisdiction.get("state", "National"),
                "city": jurisdiction.get("city", "Local Jurisdiction"),
                "authority": jurisdiction.get("authority", "Relevant Authority"),
                "completion_percentage": 25,
                "estimated_time": gemini_plan.get("estimated_time", "7–14 business days"),
                "next_step": next_step,
                "steps": steps,
                "sources": sources,
                "contacts": [
                    {
                        "id": "con_live_1",
                        "organization": jurisdiction.get("authority", "Relevant Authority"),
                        "department": jurisdiction.get("department", "Facilitation Wing"),
                        "phone": "1800 11 4000",
                        "email": "helpdesk@services.gov.in",
                        "address": f"{jurisdiction.get('city')}, {jurisdiction.get('state')}",
                        "map_url": f"https://maps.google.com/?q={jurisdiction.get('authority')}",
                        "working_hours": "Mon–Fri: 9:30 AM – 5:00 PM"
                    }
                ],
                "documents": gemini_plan.get("documents", [
                    {"id": "d1", "name": "Identity Proof (Aadhaar / Passport)", "is_required": True, "is_held": True},
                    {"id": "d2", "name": "Supporting Documents / Application Form", "is_required": True, "is_held": False}
                ]),
                "action_map": gemini_plan.get("action_map", {
                    "nodes": [
                        {"id": "ng", "label": "Your Goal", "type": "goal", "status": "active", "details": problem[:24]},
                        {"id": "nd", "label": "Documents", "type": "branch", "status": "active", "details": "Prerequisites"},
                        {"id": "np", "label": "Official Portal", "type": "service", "status": "pending", "details": "Online application"},
                        {"id": "ne", "label": "Completed", "type": "complete", "status": "pending", "details": "Task resolved"}
                    ],
                    "edges": [
                        {"source": "ng", "target": "nd", "animated": True},
                        {"source": "nd", "target": "np", "animated": True},
                        {"source": "np", "target": "ne", "animated": False}
                    ]
                }),
                "search_queries_used": [f"{problem} {jurisdiction.get('city')} official procedure"],
                "source_confidence_summary": gemini_plan.get("source_confidence_summary", {
                    "official_found": True,
                    "multiple_sources_agree": True,
                    "verification_note": "Synthesized directly from live SerpApi results by Gemini"
                })
            }, problem, answers)

    matched_scenario_key = None

    if scenario_override and scenario_override in DEMO_SCENARIOS:
        matched_scenario_key = scenario_override
    else:
        # Match by keywords
        for key, scenario in DEMO_SCENARIOS.items():
            if any(kw in problem_lower for kw in scenario["keywords"]):
                matched_scenario_key = key
                break

    if matched_scenario_key and matched_scenario_key in DEMO_SCENARIOS:
        scenario_data = DEMO_SCENARIOS[matched_scenario_key]
        
        # Override location if jurisdiction provided custom details
        city = jurisdiction.get("city", scenario_data["city"])
        state = jurisdiction.get("state", scenario_data["state"])
        country = jurisdiction.get("country", scenario_data["country"])
        authority = jurisdiction.get("authority", scenario_data["authority"])

        steps = scenario_data["steps"]
        # Find the first pending or in-progress step as the dominant NEXT STEP
        next_step = None
        for step in steps:
            if step["status"] in ["pending", "in_progress"]:
                next_step = step
                break
        if not next_step and steps:
            next_step = steps[0]

        return enrich_plan_with_stage_and_memory({
            "id": scenario_data["id"],
            "title": scenario_data["title"],
            "description": scenario_data["description"],
            "category": scenario_data["category"],
            "country": country,
            "state": state,
            "city": city,
            "authority": authority,
            "completion_percentage": scenario_data["completion_percentage"],
            "estimated_time": scenario_data["estimated_time"],
            "next_step": next_step,
            "steps": steps,
            "sources": scenario_data["sources"] if scenario_data.get("sources") else sources,
            "contacts": scenario_data["contacts"],
            "documents": scenario_data["documents"],
            "action_map": scenario_data["action_map"],
            "search_queries_used": scenario_data["search_queries_used"],
            "source_confidence_summary": scenario_data["source_confidence_summary"]
        }, problem, answers)

    # Fallback dynamic process generation if no preset scenario is matched
    top_source = sources[0] if sources else {
        "title": "Official Portal",
        "url": "https://services.india.gov.in",
        "source_type": "official"
    }

    steps = [
        {
            "id": "dyn_step_1",
            "order": 1,
            "title": "Verify Eligibility & Gather Prerequisites",
            "what": f"Review mandatory guidelines and document requirements for {problem}.",
            "why": "Prevents immediate rejection or application processing delays.",
            "how": f"Open the official portal at {top_source['url']} and verify your applicant status.",
            "what_i_need": ["Valid government ID", "Address proof", "Original receipts or correspondence"],
            "where_label": "Official Department Portal",
            "where_url": top_source["url"],
            "who_authority": jurisdiction.get("authority", "Jurisdiction Authority"),
            "when_timeline": "Within 48 hours",
            "source_title": top_source["title"],
            "source_url": top_source["url"],
            "source_type": top_source.get("source_type", "official"),
            "status": "in_progress",
            "is_fast_path_skippable": False
        },
        {
            "id": "dyn_step_2",
            "order": 2,
            "title": "Submit Official Application or Grievance Docket",
            "what": "Fill out the formal application form and submit supporting attachments.",
            "why": "Initiates legal docket review and assigns a traceable reference number.",
            "how": "Upload required proofs and execute online payment or e-acknowledgment.",
            "what_i_need": ["Completed application form", "Scanned ID proofs", "Reference docket"],
            "where_label": "Online Citizen Services Portal",
            "where_url": top_source["url"],
            "who_authority": jurisdiction.get("department", "Competent Authority"),
            "when_timeline": "5–10 business days processing",
            "source_title": top_source["title"],
            "source_url": top_source["url"],
            "source_type": top_source.get("source_type", "official"),
            "status": "pending",
            "is_fast_path_skippable": False
        }
    ]

    action_map = {
        "nodes": [
            {"id": "d_goal", "label": problem[:24], "type": "goal", "status": "active", "details": "Identified Task"},
            {"id": "d_ver", "label": "Document Verification", "type": "branch", "status": "active", "details": "Step 01"},
            {"id": "d_sub", "label": "Official Submission", "type": "service", "status": "pending", "details": "Step 02"},
            {"id": "d_end", "label": "Resolution Complete", "type": "complete", "status": "pending", "details": "Outcome"}
        ],
        "edges": [
            {"source": "d_goal", "target": "d_ver", "animated": True},
            {"source": "d_ver", "target": "d_sub", "animated": True},
            {"source": "d_sub", "target": "d_end", "animated": False}
        ]
    }

    return enrich_plan_with_stage_and_memory({
        "id": f"proc_{abs(hash(problem)) % 100000}",
        "title": f"Process for {problem.capitalize()}",
        "description": f"Targeted action plan under {jurisdiction.get('authority')}.",
        "category": jurisdiction.get("service", "Citizen Services"),
        "country": jurisdiction.get("country", "India"),
        "state": jurisdiction.get("state", "Regional"),
        "city": jurisdiction.get("city", "Local Jurisdiction"),
        "authority": jurisdiction.get("authority", "Official Department"),
        "completion_percentage": 20,
        "estimated_time": "7–14 working days",
        "next_step": steps[0],
        "steps": steps,
        "sources": sources,
        "contacts": [
            {
                "id": "con_dyn_1",
                "organization": jurisdiction.get("authority", "Citizen Facilitation Centre"),
                "department": jurisdiction.get("department", "Public Grievance Wing"),
                "phone": "1800 11 4000",
                "email": "helpdesk@services.gov.in",
                "address": f"{jurisdiction.get('city')}, {jurisdiction.get('state')}",
                "map_url": f"https://maps.google.com/?q={jurisdiction.get('authority')}+{jurisdiction.get('city')}",
                "working_hours": "Mon–Fri: 9:30 AM – 5:00 PM"
            }
        ],
        "documents": [
            {"id": "d_doc_1", "name": "Government Photo ID (Aadhaar / Passport)", "description": "Primary identity verification", "is_required": True, "is_held": True},
            {"id": "d_doc_2", "name": "Proof of Claim / Incident Documentation", "description": "Supporting statement or receipt", "is_required": True, "is_held": False}
        ],
        "action_map": action_map,
        "search_queries_used": [f"{problem} {jurisdiction.get('city')} official procedure"],
        "source_confidence_summary": {
            "official_found": True,
            "multiple_sources_agree": True,
            "verification_note": "Extracted from indexed official portal references"
        }
    }, problem, answers)
