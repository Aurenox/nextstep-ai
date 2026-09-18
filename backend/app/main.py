import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import SERPAPI_API_KEY, GEMINI_API_KEY
from app.database import init_db, get_db
from app.schemas import (
    IntentRequest, IntentResponse,
    SuggestionsRequest, ProcessSuggestionsResponse,
    QuestionRequest, QuestionResponse,
    ResearchRequest, ActionDashboardResponse,
    EmailGenerateRequest, EmailGenerateResponse,
    DocumentGenerateRequest, DocumentGenerateResponse,
    AdaptiveUpdateRequest, FastPathRequest,
    ProcessFieldsUpdateRequest
)
from app.agents.intent_agent import analyze_intent
from app.agents.gemini_agent import gemini_suggest_processes
from app.agents.question_agent import get_followup_questions
from app.agents.jurisdiction_agent import resolve_jurisdiction
from app.agents.search_planner import plan_searches
from app.agents.serpapi_agent import execute_serpapi_search, get_serpapi_account_info
from app.agents.source_analyzer import analyze_and_rank_sources
from app.agents.process_generator import generate_action_plan
from app.agents.email_agent import generate_personalized_email
from app.agents.document_agent import generate_document_template
from app.agents.adaptive_agent import analyze_and_update_process
from app.agents.fast_path_agent import calculate_fast_path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nextstep.api")

# Memory store for active session processes
PROCESS_STORE: Dict[str, Dict[str, Any]] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    init_db()
    logger.info("NEXTSTEP backend started with SQLite database initialized.")
    yield

app = FastAPI(
    title="NEXTSTEP — Universal AI Action Agent API",
    description="Backend for NEXTSTEP: Live research, location-aware jurisdiction intelligence, and step-by-step action plans.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "serpapi_configured": bool(SERPAPI_API_KEY and len(SERPAPI_API_KEY) > 5),
        "gemini_configured": bool(GEMINI_API_KEY and len(GEMINI_API_KEY) > 5),
        "engine": "NEXTSTEP Live Action Engine v1.0"
    }

@app.get("/api/serpapi/account")
async def serpapi_account_info():
    """
    Returns live account information from SerpApi Account API.
    Free of charge, zero quota consumption.
    """
    return await get_serpapi_account_info()


@app.post("/api/intent", response_model=IntentResponse)
def get_intent(req: IntentRequest):
    """
    Parses user natural language query into structured goal, category, and jurisdiction.
    Powers the instant hero micro-interaction preview!
    """
    res = analyze_intent(req.problem, req.user_location)
    return IntentResponse(**res)

@app.post("/api/suggestions", response_model=ProcessSuggestionsResponse)
def get_suggestions(req: SuggestionsRequest):
    """
    Analyzes live typed text and dynamically suggests 3 matching real-world processes.
    Powers the 'Did you mean?' suggestions in TaskComposer.
    """
    suggestions = gemini_suggest_processes(req.problem, req.user_location)
    return ProcessSuggestionsResponse(
        suggestions=suggestions,
        source_query=req.problem
    )

@app.post("/api/questions", response_model=QuestionResponse)
def get_questions(req: QuestionRequest):
    """
    Generates dynamic, minimal follow-up questions with a countdown counter.
    Never asks unnecessary questions.
    """
    res = get_followup_questions(req.problem, req.collected_answers)
    return QuestionResponse(**res)

@app.post("/api/research", response_model=ActionDashboardResponse)
async def perform_research(req: ResearchRequest):
    """
    Executes the complete research & planning workflow:
    1. Resolve jurisdiction (Country -> State -> City -> Authority)
    2. Formulate SerpApi search plan
    3. Execute search with caching & credit protection
    4. Analyze & rank verified sources (Official 🟢, Trusted 🔵, Supporting 🟡)
    5. Synthesize step cards (WHAT, WHY, HOW, WHERE, WHO, WHEN, SOURCE)
    6. Establish dominant 'YOUR NEXT STEP' action card & Action Map
    """
    jurisdiction = resolve_jurisdiction(req.problem, req.answers)
    search_plan = plan_searches(req.problem, jurisdiction, req.answers)

    queries_used = [f"[{item['engine'].upper()}] {item['query']}" for item in search_plan]
    
    # Run SerpApi searches concurrently in parallel to reduce response time from 15s to 2s
    raw_results = await asyncio.gather(*[
        execute_serpapi_search(query=item["query"], engine=item["engine"])
        for item in search_plan
    ])

    sources = analyze_and_rank_sources(raw_results)
    
    # Generate action plan with dominant next step and action map
    plan_data = generate_action_plan(
        problem=req.problem,
        jurisdiction=jurisdiction,
        sources=sources,
        answers=req.answers,
        scenario_override=req.scenario_id
    )

    # Store in memory and database
    process_id = plan_data["id"]
    plan_data["user_id"] = req.user_id or "user_default"
    PROCESS_STORE[process_id] = plan_data

    # Persist in SQLite
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT OR REPLACE INTO processes 
            (id, title, description, category, country, state, city, authority, completion_percentage, estimated_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                plan_data["id"], plan_data["title"], plan_data["description"], plan_data["category"],
                plan_data["country"], plan_data["state"], plan_data["city"], plan_data["authority"],
                plan_data["completion_percentage"], plan_data["estimated_time"]
            )
        )
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Error persisting process to SQLite: {e}")

    return ActionDashboardResponse(**plan_data)

@app.post("/api/generate-email", response_model=EmailGenerateResponse)
def create_email(req: EmailGenerateRequest):
    """
    Generates a personalized executive email draft with a direct 'Open in Gmail' link.
    """
    process = PROCESS_STORE.get(req.process_id, {})
    process_title = process.get("title", "Administrative Inquiry")
    
    result = generate_personalized_email(
        process_title=process_title,
        sender_name=req.sender_name,
        reference_number=req.reference_number,
        relevant_date=req.relevant_date,
        specific_request=req.specific_request,
        recipient_email=req.recipient_email,
        recipient_org=req.recipient_org or process.get("authority")
    )
    return EmailGenerateResponse(**result)

@app.post("/api/generate-document", response_model=DocumentGenerateResponse)
def create_document(req: DocumentGenerateRequest):
    """
    Generates a legal affidavit, consumer notice, or formal application draft ready to edit/download.
    """
    process = PROCESS_STORE.get(req.process_id, {})
    process_title = process.get("title", "Official Procedure")
    
    result = generate_document_template(
        doc_type=req.doc_type,
        user_name=req.user_name,
        process_title=process_title,
        address=req.address,
        contact_phone=req.contact_phone,
        details=req.details
    )
    return DocumentGenerateResponse(**result)

@app.post("/api/adaptive-update")
def update_process_adaptively(req: AdaptiveUpdateRequest):
    """
    Analyzes new information / replies from authorities and dynamically injects new steps with 'is_new_step: True'.
    """
    process = PROCESS_STORE.get(req.process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")

    updated = analyze_and_update_process(process, req.new_information)
    
    # Update stored process
    process["steps"] = updated["updated_steps"]
    process["next_step"] = updated["new_step"]
    process["completion_percentage"] = updated["completion_percentage"]
    process["action_map"] = updated["action_map"]
    PROCESS_STORE[req.process_id] = process

    return {
        "message": f"🔄 Process Updated: Detected requirement for {updated['detected_requirement']}",
        "detected_requirement": updated["detected_requirement"],
        "new_step": updated["new_step"],
        "steps": updated["updated_steps"],
        "completion_percentage": updated["completion_percentage"],
        "action_map": updated["action_map"]
    }

@app.post("/api/fast-path")
def activate_fast_path(req: FastPathRequest):
    """
    Computes shortest valid path when user marks held documents and returns saved steps count.
    """
    process = PROCESS_STORE.get(req.process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")

    result = calculate_fast_path(process, req.held_document_ids)
    
    process["steps"] = result["steps"]
    process["documents"] = result["documents"]
    process["next_step"] = result["next_step"]
    process["completion_percentage"] = result["completion_percentage"]
    PROCESS_STORE[req.process_id] = process

    return result

@app.get("/api/processes")
def list_processes(user_id: Optional[str] = None):
    """
    Returns active user processes for the 'My Processes' dashboard tracker.
    Filters by user_id if provided.
    """
    if not PROCESS_STORE:
        # Pre-seed with the KTU certificate scenario so dashboard is immediately populated
        from app.data.demo_scenarios import DEMO_SCENARIOS
        cert = DEMO_SCENARIOS["certificate"]
        PROCESS_STORE[cert["id"]] = {**cert, "user_id": "user_default"}

    items = []
    for pid, p in PROCESS_STORE.items():
        p_uid = p.get("user_id", "user_default")
        # If user_id specified, show processes belonging to user or default seeded ones
        if user_id and p_uid not in ["user_default", "shared", user_id]:
            continue

        # Find next step title
        next_step_title = "Follow procedure checklist"
        for s in p.get("steps", []):
            if s.get("status") in ["pending", "in_progress"]:
                next_step_title = s.get("title")
                break

        items.append({
            "id": p.get("id"),
            "title": p.get("title"),
            "category": p.get("category"),
            "location": f"{p.get('city')}, {p.get('state')}",
            "authority": p.get("authority"),
            "completion_percentage": p.get("completion_percentage", 0),
            "estimated_time": p.get("estimated_time"),
            "next_step_title": next_step_title,
            "status": "active",
            "user_id": p_uid
        })
    return items

@app.delete("/api/processes/{process_id}")
def delete_process(process_id: str):
    """
    Permanently deletes a process from the tracker and SQLite storage.
    """
    if process_id in PROCESS_STORE:
        del PROCESS_STORE[process_id]

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM steps WHERE process_id = ?", (process_id,))
        cursor.execute("DELETE FROM documents WHERE process_id = ?", (process_id,))
        cursor.execute("DELETE FROM sources WHERE process_id = ?", (process_id,))
        cursor.execute("DELETE FROM contacts WHERE process_id = ?", (process_id,))
        cursor.execute("DELETE FROM processes WHERE id = ?", (process_id,))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Error removing process from SQLite: {e}")

    return {"status": "deleted", "process_id": process_id}


@app.get("/api/processes/{process_id}", response_model=ActionDashboardResponse)
def get_single_process(process_id: str):
    process = PROCESS_STORE.get(process_id)
    if not process:
        # Check demo scenarios
        from app.data.demo_scenarios import DEMO_SCENARIOS
        for s in DEMO_SCENARIOS.values():
            if s["id"] == process_id:
                PROCESS_STORE[process_id] = s
                return ActionDashboardResponse(**s)
        raise HTTPException(status_code=404, detail="Process not found")
    return ActionDashboardResponse(**process)

@app.post("/api/processes/{process_id}/step")
def update_step_status(process_id: str, payload: Dict[str, Any]):
    process = PROCESS_STORE.get(process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")

    step_id = payload.get("step_id")
    new_status = payload.get("status", "completed")

    for s in process.get("steps", []):
        if s.get("id") == step_id:
            s["status"] = new_status
            break

    # Recalculate completion percentage
    steps = process.get("steps", [])
    completed_count = sum(1 for s in steps if s.get("status") == "completed")
    process["completion_percentage"] = int((completed_count / len(steps)) * 100) if steps else 0

    # Recalculate next step
    next_step = None
    for s in steps:
        if s.get("status") in ["pending", "in_progress"]:
            next_step = s
            break
    if next_step:
        process["next_step"] = next_step

    return {
        "status": "success",
        "step_id": step_id,
        "new_status": new_status,
        "completion_percentage": process["completion_percentage"],
        "next_step": process.get("next_step")
    }

@app.post("/api/processes/{process_id}/fields")
def update_process_fields(process_id: str, req: ProcessFieldsUpdateRequest):
    """
    Updates or adds key-value memory fields (reference numbers, applicant name, dates) for a process.
    """
    process = PROCESS_STORE.get(process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    
    current_fields = process.get("fields", {})
    current_fields.update(req.fields)
    process["fields"] = current_fields
    PROCESS_STORE[process_id] = process

    return {
        "status": "success",
        "process_id": process_id,
        "fields": current_fields
    }

