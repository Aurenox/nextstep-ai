from typing import Dict, Any

def generate_document_template(
    doc_type: str,
    user_name: str,
    process_title: str,
    address: str = None,
    contact_phone: str = None,
    details: Dict[str, str] = None
) -> Dict[str, Any]:
    """
    Generates formal legal declarations, sworn affidavits, and application letters.
    Provides structured markdown content ready to edit, copy, or download.
    """
    if details is None:
        details = {}

    user_addr = address or "Resident Address, Kerala, India"
    phone = contact_phone or "+91 XXXXXXXXXX"

    if doc_type == "affidavit":
        title = "Sworn Affidavit for Duplicate Degree Certificate (on ₹200 Stamp Paper)"
        content = f"""BEFORE THE HONOURABLE NOTARY PUBLIC / FIRST CLASS JUDICIAL MAGISTRATE
AT THIRUVANANTHAPURAM, KERALA

SWORN AFFIDAVIT UNDER OATH

I, {user_name}, son/daughter of ________________________, aged about _____ years, residing at {user_addr}, do hereby solemnly affirm and declare on oath as follows:

1. That I was a bona fide student of APJ Abdul Kalam Technological University (KTU) in the Bachelor of Technology (BTech) degree programme under University Register No: {details.get('reg_number', 'KTUXXXXXXXX')}.

2. That I successfully completed all prescribed courses and the original Degree Certificate was duly issued to me by the university.

3. That the original Degree Certificate has been lost / misplaced beyond recovery under the following circumstances:
   "{details.get('loss_circumstances', 'The certificate was inadvertently lost while travelling, and despite thorough and diligent search, it could not be traced')}".

4. That I have lodged an official report regarding the loss with the Kerala Police (Reference/GD No: {details.get('police_gd', 'KL-TVM-GD-2024-XXXX')}), and the authorities have issued a Non-Traceable Certificate.

5. That the lost original Degree Certificate has not been misused, mortgaged, pledged, or handed over to any person or institution as security.

6. That I hereby solemnly undertake that in the event the original Degree Certificate is recovered or traced at any future date, I shall immediately surrender the same to the Registrar / Controller of Examinations, APJ Abdul Kalam Technological University, Thiruvananthapuram without delay.

7. That all statements made hereinabove are true and correct to the best of my personal knowledge and belief, and no material fact has been concealed.

Deponent:
__________________________________
({user_name})
Phone: {phone}

VERIFICATION:
Verified at Thiruvananthapuram on this ______ day of ____________, 2026, that the contents of paragraphs 1 to 7 of this affidavit are true to my personal knowledge.

Identified by me:
Advocate / Notary Public Seal:
"""
        filename = f"Sworn_Affidavit_{user_name.replace(' ', '_')}.txt"

    elif doc_type == "complaint":
        title = "Formal Consumer Grievance / Warranty Replacement Notice"
        content = f"""FORMAL NOTICE UNDER CONSUMER PROTECTION ACT, 2019
(Section 2(47) - Unfair Trade Practice & Product Liability)

Date: ________________________
To:
The Principal Nodal Officer / Grievance Officer,
{details.get('brand_name', 'Customer Care Department')},
Registered Corporate Office.

Subject: Formal Notice for Replacement / Full Refund of Defective Product under Valid Warranty
Reference: Job Sheet No. {details.get('job_sheet', 'JS-2024-XXXX')} | Invoice No. {details.get('invoice_no', 'INV-XXXX')}

Dear Sir/Madam,

I, {user_name}, residing at {user_addr}, bring to your immediate attention an unresolved warranty grievance regarding {details.get('product_name', 'purchased product')} (Serial/IMEI: {details.get('serial_no', 'SNXXXXXXXX')}), purchased on {details.get('purchase_date', 'recent date')}.

1. The unit developed severe technical malfunctioning and was handed over to your Authorized Service Center.
2. The authorized technician confirmed internal hardware defect on Job Sheet #{details.get('job_sheet', 'JS-XXXX')} and classified the product as unserviceable.
3. Despite repeated follow-ups, your team has failed to replace the defective unit or issue a refund within the reasonable statutory window.

DEMAND FOR REMEDY:
You are hereby called upon to:
a) Deliver an unopened, brand-new replacement unit of identical specifications, OR
b) Issue a 100% full refund of the purchase price (₹{details.get('amount', 'XX,XXX')}) to my bank account.

Please take notice that if the requested remedy is not provided within 7 (seven) business days of this notice, I shall file a statutory complaint before the National Consumer Disputes Redressal Commission (NCDRC) and report to the Ministry of Consumer Affairs National Consumer Helpline (INGRAM Portal 1915), seeking compensation for financial loss and mental harassment.

Yours faithfully,
{user_name}
Phone: {phone}
"""
        filename = f"Warranty_Grievance_Notice_{user_name.replace(' ', '_')}.txt"

    else:
        title = f"Formal Application Letter - {process_title}"
        content = f"""To:
The Competent Authority,
{details.get('authority', 'Relevant Department')},
Government / Institutional Services.

Subject: Application for {process_title}
Reference: Applicant ID: {details.get('ref_no', 'REF-2024-XXXX')}

Respected Sir/Madam,

I, {user_name}, residing at {user_addr}, respectfully submit this application requesting your kind intervention regarding '{process_title}'.

I have completed all prerequisites and enclosed the prescribed documents:
1. Proof of Identity and Address
2. Applicable official forms and fee receipt
3. Requisite statutory undertaking

Kindly process my application and issue the necessary approvals or documents at your earliest convenience.

Thanking you,
Yours sincerely,

{user_name}
Contact: {phone}
"""
        filename = f"Application_Letter_{user_name.replace(' ', '_')}.txt"

    return {
        "title": title,
        "content": content,
        "download_filename": filename
    }
