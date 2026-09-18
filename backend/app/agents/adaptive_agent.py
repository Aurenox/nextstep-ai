import re
from typing import Dict, Any, List
from app.agents.gemini_agent import gemini_adaptive_update

def analyze_and_update_process(
    process_data: Dict[str, Any],
    new_information: str
) -> Dict[str, Any]:
    """
    Parses new information / incoming reply from authorities or companies.
    Uses Gemini API if configured to extract new statutory requirements dynamically,
    or falls back to rules. Injects new step with 'is_new_step: True'.
    """
    current_steps = list(process_data.get("steps", []))
    
    # 1. Try Gemini Dynamic Adaptive Analysis if configured
    gemini_res = gemini_adaptive_update(process_data, new_information)
    if gemini_res and "new_step" in gemini_res:
        detected_requirement = gemini_res.get("detected_requirement", "Authority Requirement")
        new_step = gemini_res["new_step"]
        updated_steps = [new_step] + current_steps
        for i, s in enumerate(updated_steps):
            s["order"] = i + 1

        completed_count = sum(1 for s in updated_steps if s.get("status") == "completed")
        new_percentage = int((completed_count / len(updated_steps)) * 100)

        action_map = dict(process_data.get("action_map", {}))
        nodes = list(action_map.get("nodes", []))
        edges = list(action_map.get("edges", []))
        
        adaptive_node_id = f"node_adaptive_{len(nodes)}"
        nodes.insert(1, {
            "id": adaptive_node_id,
            "label": f"⚡ {detected_requirement}",
            "type": "branch",
            "status": "active",
            "details": "Newly discovered statutory requirement"
        })
        edges.insert(0, {
            "source": nodes[0]["id"] if nodes else "node_goal",
            "target": adaptive_node_id,
            "animated": True
        })

        return {
            "detected_requirement": detected_requirement,
            "new_step": new_step,
            "updated_steps": updated_steps,
            "completion_percentage": new_percentage,
            "action_map": {
                "nodes": nodes,
                "edges": edges
            }
        }

    # 2. Rule-based fallback
    info_lower = new_information.lower()
    detected_requirement = "Additional Compliance Document"
    
    # 1. Affidavit / Notarization requirement
    if "affidavit" in info_lower or "notary" in info_lower or "stamp paper" in info_lower:
        detected_requirement = "Sworn Affidavit & Notary Attestation"
        new_step = {
            "id": f"step_adaptive_{len(current_steps) + 1}",
            "order": len(current_steps) + 1,
            "title": "Execute Gazetted / Notarized Affidavit",
            "what": "Submit an attested affidavit as demanded in the official response.",
            "why": "The examining authority has placed a condition requiring a legal undertaking before releasing the certificate/approval.",
            "how": "Use the NEXTSTEP Document Generator to produce the affidavit draft, print on ₹200 stamp paper, and have it stamped by a Notary Public.",
            "what_i_need": ["₹200 Stamp Paper", "Notary Public Signature & Seal", "Copy of authority communication"],
            "where_label": "Local District Court Complex / Notary Desk",
            "where_url": "https://districts.ecourts.gov.in",
            "who_authority": "Authorized Public Notary",
            "when_timeline": "Within 7 days of authority notice",
            "source_title": "Authority Communication Notice",
            "source_url": "https://ktu.edu.in",
            "source_type": "official",
            "status": "in_progress",
            "is_fast_path_skippable": False,
            "is_new_step": True
        }
        
    # 2. Gazetted Officer attestation
    elif "gazetted" in info_lower or "attest" in info_lower:
        detected_requirement = "Gazetted Officer Attestation"
        new_step = {
            "id": f"step_adaptive_{len(current_steps) + 1}",
            "order": len(current_steps) + 1,
            "title": "Obtain Gazetted Officer Attestation on Documents",
            "what": "Have your photocopied certificates and ID proof verified and signed by a Class-I/II Gazetted Officer.",
            "why": "Government administrative protocols require certified true copies for authentication.",
            "how": "Visit a government high school headmaster, medical officer, or revenue officer with your original documents for verification.",
            "what_i_need": ["Original documents for visual inspection", "Clean photocopies", "Official seal with designation"],
            "where_label": "Nearby Government School / Taluk Office / Primary Health Centre",
            "where_url": "https://services.india.gov.in",
            "who_authority": "Gazetted Officer / Revenue Official",
            "when_timeline": "1–2 business days",
            "source_title": "Official Document Attestation Guidelines",
            "source_url": "https://services.india.gov.in",
            "source_type": "official",
            "status": "in_progress",
            "is_fast_path_skippable": False,
            "is_new_step": True
        }

    # 3. Bank Statement / Financial Proof
    elif "bank" in info_lower or "statement" in info_lower or "payment" in info_lower or "receipt" in info_lower:
        detected_requirement = "Bank Transaction Proof / Stamped Statement"
        new_step = {
            "id": f"step_adaptive_{len(current_steps) + 1}",
            "order": len(current_steps) + 1,
            "title": "Procure Bank-Stamped Statement & Proof of Payment",
            "what": "Obtain an official seal-stamped statement from your bank branch covering the transaction date.",
            "why": "Required by revenue accounts to match uncredited fees or verify refund entitlement.",
            "how": "Visit your home branch or download the e-statement and request the branch manager stamp and seal.",
            "what_i_need": ["Bank passbook / Account number", "Transaction UTR / Reference ID"],
            "where_label": "Home Bank Branch",
            "where_url": "https://services.india.gov.in",
            "who_authority": "Bank Branch Operations Manager",
            "when_timeline": "Within 3 working days",
            "source_title": "Banking Transaction Verification Rules",
            "source_url": "https://services.india.gov.in",
            "source_type": "trusted",
            "status": "in_progress",
            "is_fast_path_skippable": False,
            "is_new_step": True
        }

    # Generic new requirement fallback
    else:
        detected_requirement = "Supplemental Authority Condition"
        new_step = {
            "id": f"step_adaptive_{len(current_steps) + 1}",
            "order": len(current_steps) + 1,
            "title": f"Fulfill Authority Condition: {new_information[:40]}...",
            "what": f"Address the new requirement outlined in the received message: {new_information}.",
            "why": "Necessary to unlock the next stage of the administrative workflow.",
            "how": "Prepare the requested document or reply and submit through the official channel.",
            "what_i_need": ["Communication letter copy", "Required supporting attachment"],
            "where_label": "Official Department Portal",
            "where_url": "https://services.india.gov.in",
            "who_authority": process_data.get("authority", "Concerned Department"),
            "when_timeline": "Within prescribed notice period",
            "source_title": "Department Communication Reference",
            "source_url": "https://services.india.gov.in",
            "source_type": "official",
            "status": "in_progress",
            "is_fast_path_skippable": False,
            "is_new_step": True
        }

    # Insert into steps and make it the immediate NEXT STEP
    updated_steps = [new_step] + current_steps
    for i, s in enumerate(updated_steps):
        s["order"] = i + 1

    # Recalculate percentage
    completed_count = sum(1 for s in updated_steps if s.get("status") == "completed")
    new_percentage = int((completed_count / len(updated_steps)) * 100)

    # Update Action Map with an adaptive node
    action_map = dict(process_data.get("action_map", {}))
    nodes = list(action_map.get("nodes", []))
    edges = list(action_map.get("edges", []))
    
    adaptive_node_id = f"node_adaptive_{len(nodes)}"
    nodes.insert(1, {
        "id": adaptive_node_id,
        "label": f"⚡ {detected_requirement}",
        "type": "branch",
        "status": "active",
        "details": "Newly discovered statutory requirement"
    })
    edges.insert(0, {
        "source": "node_goal" if any(n["id"] == "node_goal" for n in nodes) else nodes[0]["id"],
        "target": adaptive_node_id,
        "animated": True
    })

    return {
        "detected_requirement": detected_requirement,
        "new_step": new_step,
        "updated_steps": updated_steps,
        "completion_percentage": new_percentage,
        "action_map": {
            "nodes": nodes,
            "edges": edges
        }
    }
