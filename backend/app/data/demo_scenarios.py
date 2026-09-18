from typing import Dict, Any

DEMO_SCENARIOS: Dict[str, Any] = {
    "certificate": {
        "id": "proc_ktu_certificate",
        "keywords": ["certificate", "degree", "university", "btech", "ktu", "lost certificate", "marksheet"],
        "title": "Duplicate Degree Certificate Application",
        "description": "Lost BTech Certificate replacement procedure through APJ Abdul Kalam Technological University (KTU).",
        "category": "Education",
        "country": "India",
        "state": "Kerala",
        "city": "Thiruvananthapuram",
        "authority": "APJ Abdul Kalam Technological University (KTU)",
        "completion_percentage": 25,
        "estimated_time": "14-21 working days",
        "search_queries_used": [
            "KTU duplicate degree certificate procedure Kerala official site:ktu.edu.in",
            "KTU affidavit format duplicate certificate notary thiruvananthapuram",
            "APJ Abdul Kalam technological university exam controller contact address"
        ],
        "source_confidence_summary": {
            "official_found": True,
            "multiple_sources_agree": True,
            "verification_note": "Verified against KTU Official Examination Handbook & e-Governance Portal"
        },
        "steps": [
            {
                "id": "step_1",
                "order": 1,
                "title": "File Police Non-Traceable Report (FIR/GD)",
                "what": "Report the lost degree certificate to the local police station or through the Kerala Police Thuna Online Portal.",
                "why": "Universities legally require proof that the certificate is untraceable and cannot be misused before issuing a duplicate.",
                "how": "Visit the nearest Police Station or log in to thuna.keralapolice.gov.in. Provide your registration number and branch details to obtain a Non-Traceable Certificate.",
                "what_i_need": [
                    "Copy of original certificate or consolidated marksheet if available",
                    "Government ID proof (Aadhaar Card or Passport)",
                    "Written application stating circumstances of loss"
                ],
                "where_label": "Kerala Police Thuna Portal",
                "where_url": "https://thuna.keralapolice.gov.in",
                "who_authority": "Kerala State Police Department",
                "when_timeline": "1–3 business days",
                "source_title": "Kerala Police Online Citizen Portal",
                "source_url": "https://thuna.keralapolice.gov.in",
                "source_type": "official",
                "status": "completed",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_2",
                "order": 2,
                "title": "Execute Notarized Affidavit on Stamp Paper",
                "what": "Prepare a sworn affidavit on ₹200 Non-Judicial Stamp Paper signed before a Notary Public or First Class Judicial Magistrate.",
                "why": "Legal undertaking confirming that if the original certificate is discovered later, it will be surrendered immediately to the university.",
                "how": "Use the NEXTSTEP Document Generator to produce the KTU-compliant affidavit draft, print it on stamped paper, and get it notarized with official seal.",
                "what_i_need": [
                    "₹200 Kerala Non-Judicial Stamp Paper",
                    "Police Non-Traceable Certificate (Step 1)",
                    "Notary Advocate Signature & Seal"
                ],
                "where_label": "District Notary Advocate / District Court Complex",
                "where_url": "https://districts.ecourts.gov.in/thiruvananthapuram",
                "who_authority": "Authorized Public Notary",
                "when_timeline": "Within 24 hours",
                "source_title": "KTU Gazette Regulations for Duplicate Certificates",
                "source_url": "https://ktu.edu.in",
                "source_type": "official",
                "status": "in_progress",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_3",
                "order": 3,
                "title": "Submit Online Application on KTU Portal",
                "what": "Log in to the KTU e-Governance student portal and submit the request under 'Services -> Duplicate Certificate'.",
                "why": "Digital processing initiates verification by the Controller of Examinations and generates your tracking docket.",
                "how": "Navigate to app.ktu.edu.in, upload the scanned affidavit, police certificate, and marksheet copies, and pay the ₹2,500 duplicate certificate fee.",
                "what_i_need": [
                    "KTU Student Login Credentials",
                    "Scanned Copy of Notarized Affidavit (PDF < 2MB)",
                    "Police GD/Non-Traceable Certificate",
                    "Online Payment Card/UPI for ₹2,500"
                ],
                "where_label": "KTU e-Gov Student Portal",
                "where_url": "https://app.ktu.edu.in",
                "who_authority": "Controller of Examinations, KTU",
                "when_timeline": "Estimated review: 5–7 days",
                "source_title": "KTU e-Governance Student Services Portal",
                "source_url": "https://app.ktu.edu.in",
                "source_type": "official",
                "status": "pending",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_4",
                "order": 4,
                "title": "Physical Dispatch or College Endorsement",
                "what": "If required by your graduation year, submit hard copy docket with Principal's endorsement or dispatch to KTU HQ.",
                "why": "Institution verification validates student identity against institutional master registers.",
                "how": "Print the submitted online acknowledgment receipt, attach the original physical affidavit, and submit to your college exam cell or post by Speed Post to KTU Thiruvananthapuram.",
                "what_i_need": [
                    "Printed Application Acknowledgment",
                    "Original Notarized Affidavit",
                    "Self-addressed A4 cloth-lined envelope with Speed Post stamps"
                ],
                "where_label": "KTU University Campus, CET Alathara Rd, Thiruvananthapuram",
                "where_url": "https://maps.google.com/?q=KTU+Thiruvananthapuram",
                "who_authority": "Academic Section, APJ Abdul Kalam Technological University",
                "when_timeline": "Dispatched within 10 days of verification",
                "source_title": "KTU Contact & Student Grievance Guidelines",
                "source_url": "https://ktu.edu.in/contact",
                "source_type": "official",
                "status": "pending",
                "is_fast_path_skippable": True
            }
        ],
        "documents": [
            {"id": "doc_1", "name": "Police Non-Traceable Certificate / FIR", "description": "From Kerala Police Station or Thuna portal", "is_required": True, "is_held": True},
            {"id": "doc_2", "name": "₹200 Notarized Sworn Affidavit", "description": "Legal declaration stating certificate loss and promise to surrender if found", "is_required": True, "is_held": False},
            {"id": "doc_3", "name": "Consolidated Marksheet / Grade Card Copy", "description": "Copy showing KTU Register Number and Semester breakdown", "is_required": True, "is_held": True},
            {"id": "doc_4", "name": "Government Photo Identity Proof", "description": "Aadhaar / Passport / Voter ID", "is_required": True, "is_held": True},
            {"id": "doc_5", "name": "Passport Size Photographs (2 Nos)", "description": "Recent white background photograph for certificate file", "is_required": False, "is_held": False}
        ],
        "contacts": [
            {
                "id": "con_1",
                "organization": "APJ Abdul Kalam Technological University",
                "department": "Office of Controller of Examinations",
                "phone": "+91 471 2598122",
                "email": "support@ktu.edu.in",
                "address": "CET Campus, Thiruvananthapuram, Kerala 695016",
                "map_url": "https://maps.google.com/?q=APJ+Abdul+Kalam+Technological+University+Thiruvananthapuram",
                "working_hours": "Mon–Fri: 9:30 AM – 5:00 PM"
            },
            {
                "id": "con_2",
                "organization": "Kerala Police Helpdesk",
                "department": "Thuna Portal Technical Support",
                "phone": "112 / 0471-2313768",
                "email": "spcr.pol@kerala.gov.in",
                "address": "Police Headquarters, Vazhuthacaud, Thiruvananthapuram",
                "map_url": "https://maps.google.com/?q=Kerala+Police+Headquarters+Thiruvananthapuram",
                "working_hours": "24x7 Emergency / 10 AM–5 PM Portal Queries"
            }
        ],
        "sources": [
            {
                "id": "src_1",
                "title": "KTU Official Duplicate Certificate Regulations & Ordinances",
                "url": "https://ktu.edu.in",
                "source_type": "official",
                "snippet": "Candidates who have lost their original Degree Certificate can apply for a duplicate copy after producing a non-traceable certificate from police and a notarized affidavit.",
                "date_published": "2024-03-12",
                "engine_used": "Google Web"
            },
            {
                "id": "src_2",
                "title": "Kerala Police Citizen Portal - Lost Property Report Service",
                "url": "https://thuna.keralapolice.gov.in",
                "source_type": "official",
                "snippet": "Citizens can record lost articles including educational certificates online without physical station visit.",
                "date_published": "2024-08-01",
                "engine_used": "Google Web"
            },
            {
                "id": "src_3",
                "title": "Kerala District Courts & Notary Registry Directory",
                "url": "https://districts.ecourts.gov.in/thiruvananthapuram",
                "source_type": "trusted",
                "snippet": "Official roster of active public notaries for affidavit attestation across Thiruvananthapuram district.",
                "date_published": "2024-01-15",
                "engine_used": "Google Maps"
            }
        ],
        "action_map": {
            "nodes": [
                {"id": "node_goal", "label": "Replace Lost Degree", "type": "goal", "status": "active", "details": "APJ KTU BTech Certificate"},
                {"id": "node_docs", "label": "Notarized Affidavit & FIR", "type": "branch", "status": "active", "details": "Step 01 & 02"},
                {"id": "node_portal", "label": "KTU e-Gov Portal", "type": "service", "status": "pending", "details": "Fee ₹2,500"},
                {"id": "node_comm", "label": "Affidavit & Support Email", "type": "action", "status": "pending", "details": "support@ktu.edu.in"},
                {"id": "node_dest", "label": "Certificate Dispatch", "type": "destination", "status": "pending", "details": "Speed Post via Regd. Address"},
                {"id": "node_done", "label": "Replacement Delivered", "type": "complete", "status": "pending", "details": "Target: 14 Days"}
            ],
            "edges": [
                {"source": "node_goal", "target": "node_docs", "animated": True},
                {"source": "node_docs", "target": "node_portal", "animated": True},
                {"source": "node_portal", "target": "node_comm", "animated": True},
                {"source": "node_comm", "target": "node_dest", "animated": True},
                {"source": "node_dest", "target": "node_done", "animated": False}
            ]
        }
    },
    "flight": {
        "id": "proc_flight_cancellation",
        "keywords": ["flight", "cancelled", "cancellation", "refund", "airline", "delay", "compensation", "dgca"],
        "title": "Flight Cancellation Refund & Passenger Rights Claim",
        "description": "Full statutory refund and compensation process under Directorate General of Civil Aviation (DGCA) Passenger Charter.",
        "category": "Travel",
        "country": "India",
        "state": "National / Civil Aviation",
        "city": "All Airports",
        "authority": "Directorate General of Civil Aviation (DGCA) & Airline Grievance Cell",
        "completion_percentage": 30,
        "estimated_time": "3–7 business days for refund",
        "search_queries_used": [
            "DGCA passenger charter flight cancellation refund compensation rules",
            "AirSewa portal passenger rights complaint airline refund",
            "Aviation consumer grievance officer escalation contacts"
        ],
        "source_confidence_summary": {
            "official_found": True,
            "multiple_sources_agree": True,
            "verification_note": "Governed by Ministry of Civil Aviation CAR Section 3 Series M Part IV"
        },
        "steps": [
            {
                "id": "step_f1",
                "order": 1,
                "title": "Obtain Official Flight Cancellation Certificate / PNR Log",
                "what": "Request written proof from the airline counter or airline mobile app confirming cancellation reason and time.",
                "why": "DGCA CAR rules mandate compensation (₹5,000 to ₹10,000 or ticket cost) unless cancelled due to extraordinary meteorological conditions.",
                "how": "Take a screenshot of the cancellation SMS/email and download the revised itinerary showing flight disruption.",
                "what_i_need": ["6-character PNR code", "E-ticket copy with fare breakdown", "Original booking receipt / payment bank statement"],
                "where_label": "Airline Manage Booking Portal",
                "where_url": "https://airsewa.gov.in",
                "who_authority": "Operating Carrier (IndiGo / Air India / SpiceJet)",
                "when_timeline": "Immediate (within 2 hours of disruption)",
                "source_title": "DGCA Civil Aviation Requirements - Cancellation Rules",
                "source_url": "https://www.dgca.gov.in",
                "source_type": "official",
                "status": "completed",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_f2",
                "order": 2,
                "title": "Submit Statutory Full Refund Claim with Zero Cancellation Fee",
                "what": "Formally claim 100% refund of all fare components, including taxes, user development fees, and fuel surcharges.",
                "why": "Airlines cannot deduct convenience or cancellation charges when the flight is cancelled by the airline.",
                "how": "Log in to the airline refund portal or contact the customer support desk using our generated formal claim letter.",
                "what_i_need": ["PNR", "Bank account/credit card details used during purchase", "Government ID"],
                "where_label": "Airline Direct Refund Gateway",
                "where_url": "https://airsewa.gov.in",
                "who_authority": "Airline Revenue Accounting Department",
                "when_timeline": "Mandated within 7 days for card/online transactions",
                "source_title": "Ministry of Civil Aviation AirSewa Charter",
                "source_url": "https://airsewa.gov.in",
                "source_type": "official",
                "status": "in_progress",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_f3",
                "order": 3,
                "title": "Escalate to Ministry AirSewa Grievance Cell if Unresolved",
                "what": "If the airline delays refund beyond 7 days or denies compensation, lodge a formal grievance on the AirSewa government portal.",
                "why": "AirSewa is monitored directly by DGCA nodal officers who legally penalize non-compliant airlines.",
                "how": "Visit airsewa.gov.in, enter flight number, airline name, PNR, attach cancellation proof, and select 'Refund Issues'.",
                "what_i_need": ["AirSewa mobile app or web login", "Prior airline ticket & communication records", "Unfulfilled refund ticket ID"],
                "where_label": "Ministry of Civil Aviation AirSewa Portal",
                "where_url": "https://airsewa.gov.in/app/grievance/register",
                "who_authority": "AirSewa Nodal Officer & DGCA Directorate",
                "when_timeline": "Resolution within 10 days by government order",
                "source_title": "National AirSewa Redressal Framework",
                "source_url": "https://airsewa.gov.in",
                "source_type": "official",
                "status": "pending",
                "is_fast_path_skippable": True
            }
        ],
        "documents": [
            {"id": "doc_f1", "name": "E-Ticket Copy & PNR Confirmation", "description": "Original e-ticket indicating paid fare breakdown", "is_required": True, "is_held": True},
            {"id": "doc_f2", "name": "Cancellation SMS / Email Notification", "description": "Official communication notifying flight cancellation", "is_required": True, "is_held": True},
            {"id": "doc_f3", "name": "Bank Transaction Statement / Payment Receipt", "description": "Proof of deduction from bank or credit card", "is_required": True, "is_held": False}
        ],
        "contacts": [
            {
                "id": "con_f1",
                "organization": "AirSewa Citizen Facilitation Centre",
                "department": "Ministry of Civil Aviation, Government of India",
                "phone": "+91 11 24632950",
                "email": "airsewa-moca@gov.in",
                "address": "Rajiv Gandhi Bhavan, Safdarjung Airport, New Delhi 110003",
                "map_url": "https://maps.google.com/?q=Ministry+of+Civil+Aviation+New+Delhi",
                "working_hours": "Mon–Fri: 9:00 AM – 5:30 PM (Portal 24x7)"
            }
        ],
        "sources": [
            {
                "id": "src_f1",
                "title": "DGCA Passenger Rights Charter CAR Section 3",
                "url": "https://www.dgca.gov.in",
                "source_type": "official",
                "snippet": "Provisions for compensation to passengers in terms of cancellation of flights and refund within 7 working days.",
                "date_published": "2024-02-18",
                "engine_used": "Google Web"
            },
            {
                "id": "src_f2",
                "title": "AirSewa Consumer Portal - Grievance Redressal Mechanism",
                "url": "https://airsewa.gov.in",
                "source_type": "official",
                "snippet": "Official government portal for airline passenger complaints, tracking refunds and flight dispute escalations.",
                "date_published": "2024-09-01",
                "engine_used": "Google Web"
            }
        ],
        "action_map": {
            "nodes": [
                {"id": "n_goal", "label": "Full Refund Claim", "type": "goal", "status": "active", "details": "Flight Disruption PNR"},
                {"id": "n_docs", "label": "PNR & Cancellation Log", "type": "branch", "status": "completed", "details": "Proof verified"},
                {"id": "n_portal", "label": "Airline Refund Desk", "type": "service", "status": "active", "details": "Mandatory 7-day window"},
                {"id": "n_comm", "label": "AirSewa Escalation", "type": "action", "status": "pending", "details": "Govt Nodal Authority"},
                {"id": "n_done", "label": "Full Refund in Account", "type": "complete", "status": "pending", "details": "100% Recovered"}
            ],
            "edges": [
                {"source": "n_goal", "target": "n_docs", "animated": True},
                {"source": "n_docs", "target": "n_portal", "animated": True},
                {"source": "n_portal", "target": "n_comm", "animated": True},
                {"source": "n_comm", "target": "n_done", "animated": False}
            ]
        }
    },
    "business": {
        "id": "proc_small_business",
        "keywords": ["start a business", "small business", "msme", "udyam", "gst", "company", "trade license", "incorporation"],
        "title": "Small Business & Enterprise Registration (MSME + GST)",
        "description": "Complete legal procedure to formally register a small business, obtain Udyam Certificate, GSTIN, and local Municipal Trade License.",
        "category": "Business",
        "country": "India",
        "state": "National & State Level",
        "city": "Local Municipal Corporation",
        "authority": "Ministry of Micro, Small and Medium Enterprises & GST Council",
        "completion_percentage": 20,
        "estimated_time": "5–10 business days",
        "search_queries_used": [
            "Udyam registration portal official free zero cost msme gov in",
            "GST new registration documents required proprietary business",
            "Local municipal trade license application commercial enterprise"
        ],
        "source_confidence_summary": {
            "official_found": True,
            "multiple_sources_agree": True,
            "verification_note": "Udyam registration is 100% free; beware of third-party fraudulent charging sites"
        },
        "steps": [
            {
                "id": "step_b1",
                "order": 1,
                "title": "Register for Udyam (MSME) Certificate (Zero Fee)",
                "what": "Obtain the official MSME registration number from the Ministry of MSME without any agent or registration fees.",
                "why": "Unlocks priority banking credit, collateral-free loans, patent subsidies, and government tender exemptions.",
                "how": "Go to udyamregistration.gov.in, link your Aadhaar with OTP, select enterprise type (Micro/Proprietorship), and receive instant digital certificate.",
                "what_i_need": ["Aadhaar number of proprietor/partner", "PAN card", "Active mobile number linked to Aadhaar", "Bank account details and IFSC"],
                "where_label": "Official Udyam Registration Portal",
                "where_url": "https://udyamregistration.gov.in",
                "who_authority": "Ministry of MSME, Govt of India",
                "when_timeline": "Instant to 48 hours",
                "source_title": "Official Udyam Registration Guidelines",
                "source_url": "https://udyamregistration.gov.in",
                "source_type": "official",
                "status": "in_progress",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_b2",
                "order": 2,
                "title": "Apply for Goods & Services Tax (GSTIN) Registration",
                "what": "Apply for 15-digit GSTIN under the GST portal for inter-state sales, e-commerce, or turnover exceeding threshold.",
                "why": "Mandatory for tax invoicing, input tax credits, and merchant banking facilities.",
                "how": "Visit gst.gov.in -> Services -> Registration -> New Registration. Complete Part A & Part B with proof of business address.",
                "what_i_need": ["PAN card", "Electricity bill or rent agreement of business premises", "NOC from landlord", "Bank statement with business address"],
                "where_label": "Official GST Common Portal",
                "where_url": "https://www.gst.gov.in",
                "who_authority": "Goods and Services Tax Network (GSTN)",
                "when_timeline": "3–5 working days after Aadhaar authentication",
                "source_title": "GST Portal Official Registration Services",
                "source_url": "https://www.gst.gov.in",
                "source_type": "official",
                "status": "pending",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_b3",
                "order": 3,
                "title": "Procure Municipal Corporation Trade / Commercial License",
                "what": "Obtain operational permission from your local city municipality or Gram Panchayat.",
                "why": "Ensures zoning compliance, safety standards, and shields business from municipal penalties or shutdowns.",
                "how": "Apply online via your local urban local body (ULB) portal or citizen facilitation center with occupancy proof and floor plan.",
                "what_i_need": ["Udyam Certificate", "Property tax receipt or lease deed", "Sanitation / fire NOC if food or chemical"],
                "where_label": "Local Municipal Corporation Portal",
                "where_url": "https://services.india.gov.in",
                "who_authority": "Municipal Commissioner / Revenue Section",
                "when_timeline": "7–14 days",
                "source_title": "National Urban Governance Platform",
                "source_url": "https://services.india.gov.in",
                "source_type": "official",
                "status": "pending",
                "is_fast_path_skippable": True
            }
        ],
        "documents": [
            {"id": "doc_b1", "name": "Aadhaar Card (Aadhaar-linked Mobile)", "description": "Required for OTP biometric authentication", "is_required": True, "is_held": True},
            {"id": "doc_b2", "name": "PAN Card of Proprietor / Business", "description": "Mandatory tax identifier", "is_required": True, "is_held": True},
            {"id": "doc_b3", "name": "Proof of Commercial Premises (Rent Deed / Tax)", "description": "Registered rental agreement or property tax receipt", "is_required": True, "is_held": False},
            {"id": "doc_b4", "name": "Cancelled Cheque of Business Bank Account", "description": "Showing account holder name and IFSC", "is_required": True, "is_held": False}
        ],
        "contacts": [
            {
                "id": "con_b1",
                "organization": "National MSME Champions Helpdesk",
                "department": "Ministry of Micro, Small and Medium Enterprises",
                "phone": "+91 11 23063288",
                "email": "champions@gov.in",
                "address": "Udyog Bhawan, Rafi Marg, New Delhi 110011",
                "map_url": "https://maps.google.com/?q=Udyog+Bhawan+New+Delhi",
                "working_hours": "Mon–Fri: 9:30 AM – 6:00 PM"
            }
        ],
        "sources": [
            {
                "id": "src_b1",
                "title": "Ministry of MSME - Official Udyam Registration Portal",
                "url": "https://udyamregistration.gov.in",
                "source_type": "official",
                "snippet": "No fee is required to be paid. Udyam Registration is completely free of charge. Only this portal is official.",
                "date_published": "2024-05-10",
                "engine_used": "Google Web"
            }
        ],
        "action_map": {
            "nodes": [
                {"id": "nb_goal", "label": "Start Business", "type": "goal", "status": "active", "details": "Formal Legal Registration"},
                {"id": "nb_udyam", "label": "Udyam MSME (Free)", "type": "service", "status": "active", "details": "Instant digital ID"},
                {"id": "nb_gst", "label": "GSTIN Tax Portal", "type": "service", "status": "pending", "details": "Aadhaar e-KYC"},
                {"id": "nb_trade", "label": "Municipal Trade License", "type": "action", "status": "pending", "details": "Local clearance"},
                {"id": "nb_done", "label": "Legally Operating Entity", "type": "complete", "status": "pending", "details": "Ready to trade"}
            ],
            "edges": [
                {"source": "nb_goal", "target": "nb_udyam", "animated": True},
                {"source": "nb_udyam", "target": "nb_gst", "animated": True},
                {"source": "nb_gst", "target": "nb_trade", "animated": True},
                {"source": "nb_trade", "target": "nb_done", "animated": False}
            ]
        }
    },
    "study_abroad": {
        "id": "proc_study_abroad",
        "keywords": ["study abroad", "visa", "student visa", "germany", "usa", "uk", "ielts", "blocked account", "university admission"],
        "title": "International Student Visa & Admission Navigation",
        "description": "End-to-end guidance for university admission acceptance, blocked account / financial proof, and consulate visa appointment.",
        "category": "Education",
        "country": "Germany / European Union",
        "state": "Consular Jurisdiction",
        "city": "German Consulate / VFS Global Center",
        "authority": "German Federal Foreign Office (Auswärtiges Amt) & VFS Global",
        "completion_percentage": 35,
        "estimated_time": "4–8 weeks",
        "search_queries_used": [
            "German national student visa checklist official auswaertiges amt",
            "Blocked account Sperrkonto official requirements study in germany",
            "VFS global german student visa appointment checklist"
        ],
        "source_confidence_summary": {
            "official_found": True,
            "multiple_sources_agree": True,
            "verification_note": "Verified directly with Auswärtiges Amt Consular Service Regulations"
        },
        "steps": [
            {
                "id": "step_s1",
                "order": 1,
                "title": "Procure Unconditional Admission Letter (Zulassungsbescheid)",
                "what": "Obtain the formal letter of admission from a recognized higher education institution in Germany.",
                "why": "The visa application cannot be scheduled at the consulate or VFS without the valid university confirmation.",
                "how": "Accept your university offer via Uni-Assist or the direct university application portal, and download the signed admission PDF.",
                "what_i_need": ["Bachelor degree transcripts", "APS Certificate (for Indian applicants)", "Language proficiency test report (IELTS 6.5+ or Goethe C1)"],
                "where_label": "Uni-Assist / University Portal",
                "where_url": "https://www.uni-assist.de",
                "who_authority": "University International Office",
                "when_timeline": "Admissions round deadlines",
                "source_title": "DAAD Official Guide to Admissions in Germany",
                "source_url": "https://www.daad.de",
                "source_type": "official",
                "status": "completed",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_s2",
                "order": 2,
                "title": "Establish Official Blocked Account (Sperrkonto)",
                "what": "Open a government-approved blocked bank account deposited with the statutory minimum (approx €11,904 for 1 year).",
                "why": "German immigration law mandates proof of sufficient subsistence funds to support living costs without public aid.",
                "how": "Open an account via an approved provider (e.g. Expatrio, Coracle, or Fintiba), transfer the funds via international remittance, and download the Blocking Confirmation.",
                "what_i_need": ["Passport copy", "Admission letter", "Wire transfer proof with Swift MT103 copy"],
                "where_label": "Approved Sperrkonto Provider",
                "where_url": "https://www.auswaertiges-amt.de",
                "who_authority": "Federal Foreign Office Approved Financial Institution",
                "when_timeline": "3–5 banking days",
                "source_title": "German Missions Blocked Account Regulations",
                "source_url": "https://india.diplo.de",
                "source_type": "official",
                "status": "in_progress",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_s3",
                "order": 3,
                "title": "Book VFS Visa Appointment & Submit VIDEX Application",
                "what": "Fill out the online VIDEX National Visa form and submit biometrics at your regional VFS German Visa Application Centre.",
                "why": "Biometric verification and consular interview are mandatory for issuance of the National Visa (Type D).",
                "how": "Access visa.vfsglobal.com, select National Student Visa category, upload VIDEX barcode, and book appointment slot.",
                "what_i_need": ["Valid passport (minimum 1 year validity)", "Printed VIDEX application with declarations", "Biometric photographs (35x45mm)", "Blocked account confirmation", "APS Certificate"],
                "where_label": "VFS Global Visa Application Centre",
                "where_url": "https://visa.vfsglobal.com",
                "who_authority": "Embassy of the Federal Republic of Germany",
                "when_timeline": "Book 6–8 weeks before course commencement",
                "source_title": "German Missions in India - Student Visa Checklist",
                "source_url": "https://india.diplo.de",
                "source_type": "official",
                "status": "pending",
                "is_fast_path_skippable": False
            }
        ],
        "documents": [
            {"id": "doc_s1", "name": "University Admission Letter (Zulassungsbescheid)", "description": "Unconditional offer letter from German university", "is_required": True, "is_held": True},
            {"id": "doc_s2", "name": "Official APS Verification Certificate", "description": "Academic evaluation centre certificate", "is_required": True, "is_held": True},
            {"id": "doc_s3", "name": "Blocked Account Confirmation (06 Certificate)", "description": "Proof of €11,904 blocked funds", "is_required": True, "is_held": False},
            {"id": "doc_s4", "name": "Proof of Statutory / Travel Health Insurance", "description": "Incoming health coverage recognized in Germany", "is_required": True, "is_held": False}
        ],
        "contacts": [
            {
                "id": "con_s1",
                "organization": "German Missions in India / VFS Helpdesk",
                "department": "National Visa Processing Section",
                "phone": "+91 22 6786 6013",
                "email": "info.germanyin@vfshelpline.com",
                "address": "German Consulate General, Mumbai / New Delhi / Bengaluru / Chennai",
                "map_url": "https://maps.google.com/?q=German+Embassy+New+Delhi",
                "working_hours": "Mon–Fri: 8:00 AM – 4:00 PM"
            }
        ],
        "sources": [
            {
                "id": "src_s1",
                "title": "German Federal Foreign Office - Visa Information for Students",
                "url": "https://www.auswaertiges-amt.de",
                "source_type": "official",
                "snippet": "Information on national visas for study purposes, including blocked accounts and academic credential verification.",
                "date_published": "2024-06-20",
                "engine_used": "Google Web"
            }
        ],
        "action_map": {
            "nodes": [
                {"id": "ns_goal", "label": "Student Visa D", "type": "goal", "status": "active", "details": "Study in Germany"},
                {"id": "ns_aps", "label": "Admission & APS", "type": "branch", "status": "completed", "details": "Verified academic profile"},
                {"id": "ns_bank", "label": "Sperrkonto Funds", "type": "service", "status": "active", "details": "€11,904 deposit"},
                {"id": "ns_vfs", "label": "VFS Biometrics Slot", "type": "action", "status": "pending", "details": "VIDEX Form"},
                {"id": "ns_done", "label": "Visa Stamp Approved", "type": "complete", "status": "pending", "details": "Travel clearance"}
            ],
            "edges": [
                {"source": "ns_goal", "target": "ns_aps", "animated": True},
                {"source": "ns_aps", "target": "ns_bank", "animated": True},
                {"source": "ns_bank", "target": "ns_vfs", "animated": True},
                {"source": "ns_vfs", "target": "ns_done", "animated": False}
            ]
        }
    },
    "warranty": {
        "id": "proc_product_warranty",
        "keywords": ["warranty", "replacement", "defective", "refund product", "repair", "service center", "consumer", "electronics"],
        "title": "Consumer Warranty Claim & Defective Product Replacement",
        "description": "Defective electronics replacement escalation under the Consumer Protection Act, warranty terms, and National Consumer Helpline.",
        "category": "Customer Support",
        "country": "India",
        "state": "National Consumer Protection",
        "city": "Authorized Service Center",
        "authority": "National Consumer Disputes Redressal Commission (NCDRC) & Brand Service Network",
        "completion_percentage": 25,
        "estimated_time": "3–10 business days",
        "search_queries_used": [
            "Consumer protection act 2019 defective goods replacement rules",
            "National consumer helpline portal grievance filing consumerhelpline gov in",
            "Authorized electronics service center complaint escalation email format"
        ],
        "source_confidence_summary": {
            "official_found": True,
            "multiple_sources_agree": True,
            "verification_note": "Governed by Consumer Protection Act 2019 Section 2(47) regarding unfair trade practice"
        },
        "steps": [
            {
                "id": "step_w1",
                "order": 1,
                "title": "Secure Service Job Sheet with Technical Defect Remark",
                "what": "Submit the product to an authorized company service center and ensure the technician logs the exact hardware defect on the official Job Sheet.",
                "why": "A written job sheet from an authorized technician is legal proof of unserviceability or defect under warranty.",
                "how": "Visit the authorized brand center, hand over the unit with original tax invoice, and verify that the job sheet states 'Hardware Failure - Not Physical Damage'.",
                "what_i_need": ["Original retail invoice with serial number/IMEI", "Defective unit with all inbox accessories", "Valid government ID"],
                "where_label": "Authorized Brand Service Center",
                "where_url": "https://consumerhelpline.gov.in",
                "who_authority": "Authorized Brand Service Centre Manager",
                "when_timeline": "Within 24–48 hours of defect detection",
                "source_title": "National Consumer Helpline Guidelines",
                "source_url": "https://consumerhelpline.gov.in",
                "source_type": "official",
                "status": "completed",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_w2",
                "order": 2,
                "title": "Send Formal Escalation Notice to Brand Nodal Officer",
                "what": "Send an email to the brand's Customer Service Head or Grievance Officer requesting replacement or refund within 7 days.",
                "why": "Consumer courts require prior written notice to the company before punitive complaints can be entertained.",
                "how": "Use the NEXTSTEP Email Generator to generate an executive escalation draft with PNR/Job Sheet reference, then send or copy directly.",
                "what_i_need": ["Job sheet reference number", "Scanned invoice", "Clear photos or video evidence of malfunction"],
                "where_label": "Brand Customer Grievance Email",
                "where_url": "https://consumerhelpline.gov.in",
                "who_authority": "Principal Nodal Officer / Head of Customer Care",
                "when_timeline": "7 days statutory response window",
                "source_title": "Department of Consumer Affairs - E-Daakhil Guidelines",
                "source_url": "https://edaakhil.nic.in",
                "source_type": "official",
                "status": "in_progress",
                "is_fast_path_skippable": False
            },
            {
                "id": "step_w3",
                "order": 3,
                "title": "Lodge Grievance on National Consumer Helpline (NCH / INGRAM)",
                "what": "Register complaint on Government portal consumerhelpline.gov.in or call toll-free 1915.",
                "why": "Over 85% of registered corporate warranty complaints are resolved immediately through NCH mediation without court fees.",
                "how": "Log in to consumerhelpline.gov.in, select company name, enter invoice amount, job sheet number, and attach notice.",
                "what_i_need": ["NCH Citizen Account", "Invoice PDF", "Job Sheet PDF", "Grievance Summary"],
                "where_label": "NCH National Consumer Portal (INGRAM)",
                "where_url": "https://consumerhelpline.gov.in",
                "who_authority": "Department of Consumer Affairs, Ministry of Consumer Affairs",
                "when_timeline": "15 days for mediated company resolution",
                "source_title": "National Consumer Helpline Portal",
                "source_url": "https://consumerhelpline.gov.in",
                "source_type": "official",
                "status": "pending",
                "is_fast_path_skippable": True
            }
        ],
        "documents": [
            {"id": "doc_w1", "name": "Tax Invoice with Serial / IMEI Number", "description": "Retail invoice proving purchase within warranty term", "is_required": True, "is_held": True},
            {"id": "doc_w2", "name": "Authorized Service Center Job Sheet", "description": "Diagnostic sheet noting defect", "is_required": True, "is_held": True},
            {"id": "doc_w3", "name": "Defect Video / Photo Evidence", "description": "Short video illustrating hardware malfunction", "is_required": False, "is_held": True}
        ],
        "contacts": [
            {
                "id": "con_w1",
                "organization": "National Consumer Helpline (NCH)",
                "department": "Department of Consumer Affairs, Govt of India",
                "phone": "1915 / +91 11 23381663",
                "email": "nch-ca@gov.in",
                "address": "Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001",
                "map_url": "https://maps.google.com/?q=Department+of+Consumer+Affairs+New+Delhi",
                "working_hours": "Mon–Sat: 8:00 AM – 8:00 PM (1915 Toll-Free)"
            }
        ],
        "sources": [
            {
                "id": "src_w1",
                "title": "Consumer Protection Act 2019 - Product Liability & Defect Rules",
                "url": "https://consumeraffairs.nic.in",
                "source_type": "official",
                "snippet": "Manufacturers and sellers are liable for defective products and must replace or refund within warranty provisions.",
                "date_published": "2024-01-10",
                "engine_used": "Google Web"
            },
            {
                "id": "src_w2",
                "title": "National Consumer Helpline INGRAM Portal",
                "url": "https://consumerhelpline.gov.in",
                "source_type": "official",
                "snippet": "Citizen portal for lodging grievances against commercial brands and warranty violations with high success rate.",
                "date_published": "2024-07-15",
                "engine_used": "Google Web"
            }
        ],
        "action_map": {
            "nodes": [
                {"id": "nw_goal", "label": "Warranty Claim", "type": "goal", "status": "active", "details": "Defective Replacement"},
                {"id": "nw_job", "label": "Authorized Job Sheet", "type": "branch", "status": "completed", "details": "Defect verified"},
                {"id": "nw_notice", "label": "Legal Escalation Email", "type": "action", "status": "active", "details": "7-day formal notice"},
                {"id": "nw_nch", "label": "NCH 1915 Portal", "type": "service", "status": "pending", "details": "Govt mediation"},
                {"id": "nw_done", "label": "Unit Replaced / Refunded", "type": "complete", "status": "pending", "details": "Case resolved"}
            ],
            "edges": [
                {"source": "nw_goal", "target": "nw_job", "animated": True},
                {"source": "nw_job", "target": "nw_notice", "animated": True},
                {"source": "nw_notice", "target": "nw_nch", "animated": True},
                {"source": "nw_nch", "target": "nw_done", "animated": False}
            ]
        }
    }
}
