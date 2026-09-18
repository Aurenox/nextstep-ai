import sys
import asyncio
sys.stdout.reconfigure(encoding='utf-8')
from app.agents.intent_agent import analyze_intent
from app.agents.question_agent import get_followup_questions
from app.agents.jurisdiction_agent import resolve_jurisdiction
from app.agents.process_generator import generate_action_plan
from app.agents.email_agent import generate_personalized_email
from app.agents.document_agent import generate_document_template
from app.agents.adaptive_agent import analyze_and_update_process
from app.agents.fast_path_agent import calculate_fast_path

from app.agents.gemini_agent import gemini_suggest_processes

def test_all():
    print("Testing 1: Intent Agent...")
    intent = analyze_intent("I lost my BTech degree certificate from KTU")
    assert any(w in intent["goal"].lower() for w in ["certificate", "degree", "replace", "duplicate"])
    assert "KTU" in intent["likely_authority"] or "Kerala" in intent["likely_authority"]
    assert intent.get("detected_state") in ["Kerala", None] or "Kerala" in str(intent)
    print("[PASS] Intent Agent Passed:", intent["goal"], "->", intent["likely_authority"])

    print("\nTesting 2: Question Agent...")
    q = get_followup_questions("I lost my certificate")
    assert q["remaining_count"] >= 1
    assert any(item["field_key"] == "certificate_type" for item in q["questions"])
    print(f"[PASS] Question Agent Passed: {q['remaining_count']} questions remaining.")

    print("\nTesting 3: Jurisdiction Agent...")
    jurisdiction = resolve_jurisdiction("I lost my BTech certificate from KTU", {"location": "Thiruvananthapuram, Kerala"})
    assert jurisdiction["country"] == "India"
    assert jurisdiction["state"] == "Kerala"
    assert jurisdiction["city"] == "Thiruvananthapuram"
    print("[PASS] Jurisdiction Agent Passed:", jurisdiction["breadcrumb"])

    print("\nTesting 4: Process Generator with Stages & Memory...")
    plan = generate_action_plan(
        problem="I lost my university certificate",
        jurisdiction=jurisdiction,
        sources=[],
        answers={"university": "KTU", "location": "Thiruvananthapuram, Kerala"}
    )
    assert len(plan["steps"]) >= 3
    assert plan["next_step"] is not None
    assert "what" in plan["next_step"]
    assert "why" in plan["next_step"]
    assert "how" in plan["next_step"]
    assert "current_stage" in plan
    assert len(plan.get("stages", [])) >= 3
    assert "fields" in plan
    assert len(plan.get("stage_actions", [])) >= 2
    print(f"[PASS] Process Generator Passed. Current stage: {plan['current_stage']}, Stages: {len(plan['stages'])}, Next step: {plan['next_step']['title']}")
    assert "what_i_need" in plan["next_step"]
    print("[PASS] Process Generator Passed. Next step:", plan["next_step"]["title"])

    print("\nTesting 5: Email Generator with Gmail URL...")
    email = generate_personalized_email(
        process_title=plan["title"],
        sender_name="Saurav",
        reference_number="KTU-REG-88219",
        relevant_date="12-Sept-2024",
        specific_request="Need urgent dispatch of duplicate BTech degree",
        recipient_email="support@ktu.edu.in"
    )
    assert "mail.google.com" in email["gmail_url"]
    assert "KTU-REG-88219" in email["subject"]
    print("[PASS] Email Generator Passed. Gmail compose link ready.")

    print("\nTesting 6: Document Generator...")
    doc = generate_document_template(
        doc_type="affidavit",
        user_name="Saurav Kumar",
        process_title=plan["title"],
        details={"reg_number": "TVE18CS042"}
    )
    assert "SWORN AFFIDAVIT" in doc["content"]
    assert "TVE18CS042" in doc["content"]
    print("[PASS] Document Generator Passed. Affidavit drafted.")

    print("\nTesting 7: Adaptive Replanner...")
    adaptive = analyze_and_update_process(plan, "The university replied and asked me to submit a gazetted officer attested affidavit.")
    assert adaptive["new_step"]["is_new_step"] is True
    print(f"[PASS] Adaptive Agent Passed: Injected requirement '{adaptive['detected_requirement']}'.")

    print("\nTesting 8: Fast Path Engine...")
    fast = calculate_fast_path(plan, ["doc_1", "doc_3"])
    print(f"[PASS] Fast Path Passed: Saved steps = {fast['saved_steps_count']}. Message: {fast['message']}")

    print("\nTesting 9: Process Suggestion Agent ('Did you mean?')...")
    sugs = gemini_suggest_processes("I lost my driving licence", "Thiruvananthapuram, Kerala")
    assert len(sugs) >= 1
    assert "title" in sugs[0] and "icon" in sugs[0]
    print(f"[PASS] Suggestion Agent Passed: {len(sugs)} suggestions returned, top: {sugs[0]['icon']} {sugs[0]['title']}")

    print("\nALL BACKEND AGENT TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
