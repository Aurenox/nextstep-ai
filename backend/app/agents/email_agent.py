import urllib.parse
from typing import Dict, Any

def generate_personalized_email(
    process_title: str,
    sender_name: str,
    reference_number: str = None,
    relevant_date: str = None,
    specific_request: str = "",
    recipient_email: str = None,
    recipient_org: str = None
) -> Dict[str, Any]:
    """
    Generates a formal, personalized executive email draft and builds a pre-filled Gmail web compose URL.
    Does NOT automatically send emails; user reviews, copies, or clicks Open in Gmail.
    """
    ref_part = f" [Ref/Reg No: {reference_number}]" if reference_number else ""
    recipient = recipient_email or "support@ktu.edu.in"
    org_name = recipient_org or "Competent Authority"
    
    subject = f"Urgent Request regarding {process_title}{ref_part}"
    
    body_lines = [
        f"To: {org_name}",
        f"Attention: Public Information Officer / Concerned Department\n",
        f"Dear Sir/Madam,\n",
        f"I am writing regarding my ongoing procedure for '{process_title}'.",
    ]
    
    if reference_number:
        body_lines.append(f"Application / Reference Number: {reference_number}")
    if relevant_date:
        body_lines.append(f"Relevant Incident / Submission Date: {relevant_date}")
        
    body_lines.append(f"\nRequest Details:\n{specific_request}\n")
    body_lines.append(
        "I have attached all requisite supporting documentation and affidavits for your kind perusal. "
        "I kindly request you to examine the matter and apprise me of the current status or next required action at the earliest convenience."
    )
    body_lines.append(f"\nThanking you,\nYours sincerely,\n{sender_name}")
    
    body = "\n".join(body_lines)
    
    # Construct Gmail web pre-fill link:
    # https://mail.google.com/mail/?view=cm&fs=1&to=...&su=...&body=...
    params = {
        "view": "cm",
        "fs": "1",
        "to": recipient,
        "su": subject,
        "body": body
    }
    gmail_url = f"https://mail.google.com/mail/?{urllib.parse.urlencode(params)}"
    
    return {
        "recipient": recipient,
        "subject": subject,
        "body": body,
        "gmail_url": gmail_url
    }
