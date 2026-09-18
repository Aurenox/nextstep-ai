from typing import Dict, Any, List

def calculate_fast_path(
    process_data: Dict[str, Any],
    held_document_ids: List[str]
) -> Dict[str, Any]:
    """
    Computes the shortest legitimate path when users already have certain documents or completed prerequisites.
    Marks skippable steps without bypassing legal requirements and returns saved steps count.
    """
    steps = list(process_data.get("steps", []))
    documents = list(process_data.get("documents", []))
    
    # Update held status
    for doc in documents:
        doc["is_held"] = doc["id"] in held_document_ids

    saved_steps_count = 0
    saved_step_titles = []
    
    # If user has the FIR / police certificate, mark police step complete
    has_police_report = any(doc["id"] in held_document_ids and ("police" in doc["name"].lower() or "fir" in doc["name"].lower()) for doc in documents)
    # If user has notarized affidavit, mark affidavit step complete
    has_affidavit = any(doc["id"] in held_document_ids and "affidavit" in doc["name"].lower() for doc in documents)
    
    for step in steps:
        if has_police_report and ("police" in step["title"].lower() or "fir" in step["title"].lower()):
            if step["status"] != "completed":
                step["status"] = "completed"
                saved_steps_count += 1
                saved_step_titles.append(step["title"])
                
        if has_affidavit and "affidavit" in step["title"].lower():
            if step["status"] != "completed":
                step["status"] = "completed"
                saved_steps_count += 1
                saved_step_titles.append(step["title"])

        # Check if step is explicitly skippable
        if step.get("is_fast_path_skippable") and step["status"] != "completed":
            # Can be skipped if prerequisite documents are already held
            if len(held_document_ids) >= 2:
                step["status"] = "skipped"
                saved_steps_count += 1
                saved_step_titles.append(step["title"])

    # Determine next active step
    next_step = None
    for step in steps:
        if step["status"] in ["pending", "in_progress"]:
            next_step = step
            break
    if not next_step and steps:
        next_step = steps[-1]

    # Recalculate progress percentage
    completed_or_skipped = sum(1 for s in steps if s.get("status") in ["completed", "skipped"])
    new_percentage = int((completed_or_skipped / len(steps)) * 100) if steps else 100

    return {
        "saved_steps_count": saved_steps_count,
        "saved_step_titles": saved_step_titles,
        "fast_path_active": saved_steps_count > 0,
        "message": f"⚡ Fast Path: You can save {saved_steps_count} step(s) based on your documents!" if saved_steps_count > 0 else "All steps are currently required for this legal procedure.",
        "steps": steps,
        "documents": documents,
        "next_step": next_step,
        "completion_percentage": new_percentage
    }
