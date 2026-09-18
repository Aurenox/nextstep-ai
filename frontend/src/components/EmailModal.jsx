import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Copy, Check, ExternalLink, Sparkles, Send, 
  Printer, Download, ShieldCheck, Scale, Clock, FileCheck, 
  AlertTriangle, Eye, Edit3, MapPin, Building2, Calendar, FileText
} from 'lucide-react';

export default function EmailModal({ processData, currentUser, onClose }) {
  const defaultContact = processData?.contacts?.[0] || {};
  const currentStep = processData?.next_step || processData?.steps?.[0] || {};
  
  // View mode: 'letterhead' (official printable paper view) | 'editor' (plain text/email dispatch view)
  const [viewMode, setViewMode] = useState('letterhead');

  // Stage Selector State
  const [selectedStage, setSelectedStage] = useState('stage1'); // 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5'
  const [senderName, setSenderName] = useState(currentUser?.name || 'Citizen Applicant');
  const [senderLocation, setSenderLocation] = useState(currentUser?.location || 'Thiruvananthapuram, Kerala');
  const [refNumber, setRefNumber] = useState('DOC/KL-2024-9981');
  const [relevantDate, setRelevantDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }));
  const [recipientEmail, setRecipientEmail] = useState(defaultContact.email || 'grievance.nodal@kerala.gov.in');
  const [recipientOrg, setRecipientOrg] = useState(processData?.authority || 'Kerala State Administrative Directorate');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // 5 Authentic Official Administrative & Statutory Presets
  const stagePresets = {
    stage1: {
      id: 'stage1',
      label: '🏛️ 1. Statutory Inward Filing (RTS Act)',
      badge: 'Kerala RTS Act 2012 / CSMOP',
      tag: 'Stage 1: Formal Submission',
      desc: 'Statutory citizen representation under Section 3 of the Kerala State Right to Service Act, 2012 seeking official inward diary registration and time-bound disposal.',
      subject: `FORMAL STATUTORY REPRESENTATION UNDER KERALA RIGHT TO SERVICE ACT: Application Dossier for ${processData?.title || 'Administrative Clearance'} — Time-Bound Inward Registration & Acknowledgment — Reg.`,
      generateBody: (pName, pLoc, rOrg, rNo, rDate) => 
`GOVERNMENT OF KERALA / COMPETENT STATUTORY AUTHORITY
FORMAL ADMINISTRATIVE DISPATCH MEMORANDUM
(Executed under Section 3 of the Kerala State Right to Service Act, 2012 & Central Secretariat Manual of Office Procedure)

DISPATCH REF NO: KL-TVM/2026/RTS-${rNo}
DATED: ${rDate}
STATION: ${pLoc}
DELIVERY MODE: By Registered Electronic Mail & Speed Post A.D.

TO:
The Competent Authority & Head of Department / Nodal Officer,
${rOrg},
Government Secretariat / Administrative Directorate,
${pLoc.includes('Kerala') ? pLoc : 'Thiruvananthapuram, Kerala - 695001'}.

SUBJECT: FORMAL STATUTORY WRITTEN REPRESENTATION UNDER SECTION 3 OF THE KERALA STATE RIGHT TO SERVICE ACT, 2012 REGARDING "${processData?.title ? processData.title.toUpperCase() : 'ADMINISTRATIVE SERVICE'}" — TIME-BOUND INWARD REGISTRATION, VERIFICATION, AND DISPOSAL — REG.

REFERENCES:
1. Citizen Online Portal / Tracking Token ID: ${rNo}
2. Citizen's Charter Public Service Delivery Norms (G.O.(P) No. 12/2012/P&ARD)
3. Prescribed Statutory Turnaround Period: ${currentStep.when_timeline || '7-14 working days'}

Respected Sir / Madam,

1. LOCUS STANDI & APPLICANT DETAILS:
The undersigned applicant, ${pName}, a bona fide citizen residing at ${pLoc}, respectfully submits this formal statutory representation before your esteemed authority for official inward diary registration, administrative verification, and time-bound disposal under the statutory mandate of the Kerala State Right to Service Act, 2012.

2. STATEMENT OF MATERIAL FACTS:
That the applicant has initiated the formal procedural process for "${processData?.title || 'the requisite administrative service'}" under Reference Docket ID: ${rNo}. All prescribed procedural requirements, departmental verification formalities, and statutory fee remissions have been executed in strict conformity with applicable governmental regulations.

3. STATUTORY COMPLIANCE & ATTESTED ANNEXURES:
The applicant has enclosed herewith a comprehensive, self-contained dossier comprising all mandatory statutory records, duly attested and certified:
  [Annexure A-1] Self-Attested Government Photo Identity & Address Verification (Aadhaar / Passport / EPIC)
  [Annexure A-2] Sworn Affidavit executed on ₹200/- Non-Judicial Stamp Paper attested by Notary Public
  [Annexure A-3] Official Police General Diary (GD) / Non-Traceable Certification / Departmental Token
  [Annexure A-4] Official Treasury / Banking Remittance Receipt & Transaction Acknowledgment

4. CITIZEN'S CHARTER & STATUTORY ENTITLEMENT:
Under the notified Citizen's Charter and the Kerala State Right to Service Act, 2012, every citizen is legally entitled to receive public services within the stipulated timeframe of ${currentStep.when_timeline || '7-14 working days'} from the date of submission of a complete dossier, without arbitrary impediment, bureaucratic lethargy, or administrative delay.

5. SPECIFIC PRAYER / RELIEF SOUGHT:
In light of the full documentary and statutory compliance established herein, it is most respectfully prayed that your esteemed authority may be pleased to:
  (a) Register this formal dossier and assign an official Inward Diary Dispatch Number;
  (b) Initiate administrative verification and issue the final requested certification / clearance within the prescribed statutory period;
  (c) Formally intimate the file movement status and official acknowledgment to the applicant's designated communication coordinates.

6. SOLEMN VERIFICATION:
I, ${pName}, the applicant herein, do hereby verify and declare on solemn affirmation that the contents stated above are true and correct to the best of my knowledge, documentary records, and belief.

Thanking you in anticipation of prompt, accountable, and transparent administrative action.

Yours faithfully,

___________________________________________
[DIGITALLY SIGNED / SIGNATURE]
(${pName})
Citizen Applicant / Deponent
Jurisdiction & Residence: ${pLoc}
Contact Mobile: +91 98470 12345
Official Email: ${currentUser?.email || 'applicant@citizen.kerala.gov.in'}

COPY FORWARDED FOR FAVOUR OF INWARD RECORD & SUPERVISORY TRACKING TO:
1. The District Collector & District Magistrate, Collectorate, Kudappanakunnu, Thiruvananthapuram, Kerala - 695043.
2. The Principal Secretary, Personnel & Administrative Reforms Department (P&ARD), Government Secretariat, Thiruvananthapuram, Kerala - 695001.`
    },

    stage2: {
      id: 'stage2',
      label: '⏱️ 2. Official SLA Breach Reminder',
      badge: 'Statutory Delay Notice',
      tag: 'Stage 2: Processing Inquiry',
      desc: 'Polite yet rigorous administrative reminder citing Citizen Charter standards, overdue service delivery timelines, and requisitioning file movement status.',
      generateSubject: (rNo) => `OFFICIAL SLA BREACH REMINDER: Inordinate Delay in Disposal of Application [Docket Ref: ${rNo}] — Violation of Citizen's Charter Norms — Reg.`,
      generateBody: (pName, pLoc, rOrg, rNo, rDate) => 
`OFFICE OF THE NODAL GRIEVANCE OFFICER & PUBLIC SERVICE REGISTRAR
${rOrg}, Thiruvananthapuram, Kerala.

FORMAL ADMINISTRATIVE REMINDER & FILE STATUS INQUIRY
(Under Section 5 of the Kerala State Right to Service Act, 2012 & Secretariat Rules of Business)

DISPATCH REF: KL-TVM/2026/SLA-${rNo}
DATED: ${rDate}
STATION: ${pLoc}
DELIVERY MODE: By Urgent Electronic Dispatch & Regd Post

TO:
The Designated Public Service Officer / Nodal Grievance In-Charge,
${rOrg},
Government Secretariat / Regional Directorate,
${pLoc.includes('Kerala') ? pLoc : 'Thiruvananthapuram, Kerala - 695001'}.

SUBJECT: STATUTORY INQUIRY & URGENT OFFICIAL REMINDER: INORDINATE DELAY IN DISPOSAL OF APPLICATION [DOCKET REF: ${rNo}] — CITIZEN'S CHARTER SLA OVERDUE — REG.

REFERENCES:
1. Formal Application Docket Ref No: ${rNo} submitted on ${rDate}
2. Notified Citizen's Charter Maximum Delivery Period: ${currentStep.when_timeline || '7-10 working days'}
3. Kerala State Right to Service Act, 2012 (Act 18 of 2012)

Respected Sir / Madam,

1. REFERENCE TO PRIOR INWARD SUBMISSION:
I invite your kind, urgent attention to my formal application bearing Reference Docket No: ${rNo}, submitted on ${rDate} regarding "${processData?.title || 'the captioned administrative matter'}".

2. EXPIRATION OF MANDATED CITIZEN'S CHARTER TURNAROUND TIME:
Under the Citizen's Charter and the statutory public service delivery guidelines of the Government of Kerala, the maximum turnaround time for the scrutiny and disposal of this service is ${currentStep.when_timeline || '7-10 business days'}. As of today, the prescribed statutory timeframe has completely elapsed, yet neither the service has been rendered nor has any defect or formal written intimation been communicated to the applicant.

3. STATUTORY INQUIRY UNDER RIGHT TO SERVICE NORMS:
In terms of administrative accountability and the provisions of the Kerala State Right to Service Act, 2012, I respectfully request that your office furnish the following information forthwith:
  (a) The present file movement stage and exact dealing desk where the dossier is currently pending;
  (b) The name and official designation of the Designated Officer responsible for the processing of File No. ${rNo};
  (c) The specific reasons, recorded in writing, for the delay in completing the disposal within the prescribed timeframe.

4. PEREMPTORY DEMAND FOR EXPEDITIOUS DISPOSAL:
You are respectfully called upon to expedite the verification and complete the final disposal of the application within forty-eight (48) hours of receipt of this communication.

Please note that continued delay without justifiable cause will compel the undersigned to invoke the appellate provisions under Section 5(1) of the Kerala State Right to Service Act, 2012 and file a formal grievance on the Chief Minister's Public Grievance Redressal Portal.

Yours faithfully,

___________________________________________
[DIGITALLY SIGNED / SIGNATURE]
(${pName})
Citizen Applicant
Jurisdiction & Residence: ${pLoc}
Contact Mobile: +91 98470 12345
Official Email: ${currentUser?.email || 'applicant@citizen.kerala.gov.in'}

COPY FORWARDED FOR FAVOUR OF INFORMATION & SUPERVISORY INTERVENTION TO:
1. The First Appellate Authority / Deputy Secretary to Government, Secretariat, Thiruvananthapuram - 695001.
2. The District Collector & District Magistrate, Collectorate, Kudappanakunnu, Thiruvananthapuram - 695043.`
    },

    stage3: {
      id: 'stage3',
      label: '⚠️ 3. First Administrative Appeal (RTS)',
      badge: 'Appellate Authority Filing',
      tag: 'Stage 3: Supervisory Escalation',
      desc: 'Statutory first appeal before the First Appellate Authority under Section 5(1) and Section 7 of the Kerala State Right to Service Act, 2012 against administrative failure.',
      generateSubject: (rNo) => `STATUTORY FIRST APPEAL UNDER SECTION 5(1) OF KERALA RIGHT TO SERVICE ACT: Failure of Designated Officer to Render Service within Stipulated Time [Ref: ${rNo}] — Immediate Supervisory Order Sought — Reg.`,
      generateBody: (pName, pLoc, rOrg, rNo, rDate) => 
`BEFORE THE HONOURABLE FIRST APPELLATE AUTHORITY / SECRETARY TO GOVERNMENT
ADMINISTRATIVE HEADQUARTERS, GOVERNMENT SECRETARIAT, THIRUVANANTHAPURAM, KERALA.

MEMORANDUM OF STATUTORY FIRST APPEAL
(Under Section 5(1) read with Section 7 of the Kerala State Right to Service Act, 2012)

APPEAL MEMO NO: RTS-APP/KL-TVM/2026/${rNo}
DATED: ${rDate}
STATION: ${pLoc}

IN THE MATTER OF:
${pName}, Residing at ${pLoc} ............................................................................ APPELLANT
VERSUS
The Designated Officer & Head of Office, ${rOrg}, Thiruvananthapuram ........... RESPONDENT

SUBJECT: STATUTORY FIRST APPEAL UNDER SECTION 5(1) OF THE KERALA STATE RIGHT TO SERVICE ACT, 2012 AGAINST FAILURE TO RENDER PUBLIC SERVICE WITHIN STIPULATED TIME — REG.

Respected Sir / Madam,

The Appellant named above begs to submit this Memorandum of Appeal against the arbitrary inaction, administrative lethargy, and failure of the Respondent Designated Officer to deliver public services within the statutory timeframe in respect of Docket Ref: ${rNo}.

1. PARTICULARS OF THE PRIMARY APPLICATION:
  (a) Subject Matter: ${processData?.title || 'Administrative Service Docket'}
  (b) Date of Submission: ${rDate}
  (c) Inward Docket / Reference Number: ${rNo}
  (d) Designated Officer / Dealing Office: ${rOrg}, Thiruvananthapuram.
  (e) Prescribed Period for Service Delivery: ${currentStep.when_timeline || '7-14 working days'}.

2. GROUNDS OF APPEAL:
  (i) That the Appellant complied fully with all statutory covenants, submitted complete documentation, paid prescribed fees, and furnished attested affidavits on ${rDate}.
  (ii) That despite the complete lapse of the statutory period and subsequent written reminder, the Respondent has failed to dispose of the matter, which amounts to willful breach of statutory duties under the Kerala State Right to Service Act, 2012.
  (iii) That the continued inaction is causing grave hardship, pecuniary loss, and mental agony to the Appellant without any fault on the Appellant's part.

3. PRAYER BEFORE THE APPELLATE AUTHORITY:
It is therefore most respectfully prayed that this Honourable First Appellate Authority may be graciously pleased to:
  (a) Admit this Statutory Appeal and call for the entire original file records of Docket Ref: ${rNo} from the Respondent;
  (b) Issue a peremptory order directing the Respondent Designated Officer to deliver the requested service / issue the requisite certificate within forty-eight (48) hours;
  (c) Initiate penal proceedings against the defaulting Designated Officer under Section 7 of the Kerala State Right to Service Act, 2012 (imposition of statutory fine of ₹250/- per day of delay, up to maximum ₹5,000/-).

VERIFICATION:
I, ${pName}, Appellant herein, verify that the statements made in paragraphs 1 to 3 above are true to my knowledge and based on official records, and nothing material has been suppressed therefrom.

Verified at Thiruvananthapuram on this ${rDate}.

APPELLANT:
___________________________________________
[DIGITALLY SIGNED / SIGNATURE]
(${pName})
Appellant / Aggrieved Citizen
Jurisdiction & Residence: ${pLoc}
Contact Mobile: +91 98470 12345
Email: ${currentUser?.email || 'appellant@citizen.kerala.gov.in'}`
    },

    stage4: {
      id: 'stage4',
      label: '⚖️ 4. Statutory Pre-Litigation Legal Notice',
      badge: 'Section 35 CPA 2019',
      tag: 'Stage 4: Legal Demand',
      desc: 'Pre-litigation legal notice under Section 35 of the Consumer Protection Act, 2019 prior to institution of formal proceedings before the District Consumer Disputes Redressal Commission.',
      generateSubject: (rNo) => `FINAL STATUTORY LEGAL NOTICE UNDER SECTION 35 OF CONSUMER PROTECTION ACT, 2019: Notice Prior to Filing Before District Consumer Commission [Ref: ${rNo}]`,
      generateBody: (pName, pLoc, rOrg, rNo, rDate) => 
`BY SPEED POST A.D. & ELECTRONIC LEGAL SERVICE
FROM:
${pName}, Residing at ${pLoc}.
Contact: +91 98470 12345 | Email: ${currentUser?.email || 'applicant@citizen.kerala.gov.in'}

DATE: ${rDate}
STATION: ${pLoc}
STATUTORY NOTICE REF: LEG/CPA/KL-TVM/2026/${rNo}

TO:
The Principal Officer / Managing Director / Grievance Redressal Officer,
${rOrg},
Administrative Directorate,
${pLoc.includes('Kerala') ? pLoc : 'Thiruvananthapuram, Kerala - 695001'}.

SUBJECT: FINAL STATUTORY LEGAL NOTICE UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE, UNFAIR TRADE PRACTICE, AND WILLFUL FAILURE TO PROVIDE RELIEF IN RESPECT OF "${processData?.title ? processData.title.toUpperCase() : 'SUBJECT MATTER'}" [REF: ${rNo}] — REG.

Sir / Madam,

TAKE NOTICE that I, ${pName}, residing at ${pLoc}, do hereby serve upon you this formal statutory pre-litigation notice on the following grounds:

1. CITIZEN / CONSUMER STATUS & CAUSE OF ACTION:
That the Complainant duly engaged with your organization for "${processData?.title || 'the subject matter'}" under Registration / Reference ID: ${rNo}, tendering all requisite considerations, statutory fees, and documentation. The Complainant is a "Consumer" within the meaning of Section 2(7) of the Consumer Protection Act, 2019.

2. DEFICIENCY IN SERVICE & UNFAIR TRADE PRACTICE:
That your organization has failed to honor its statutory obligations, public service charter, and regulatory mandates within the legally prescribed period of ${currentStep.when_timeline || 'stipulated turnaround'}. Despite repeated reminders, you have withheld legitimate service and redressal without lawful justification. Your conduct constitutes actionable "Deficiency in Service" under Section 2(11) and "Unfair Trade Practice" under Section 2(47) of the Consumer Protection Act, 2019.

3. FINANCIAL DETRIMENT & HARASSMENT:
Your arbitrary delay and administrative inaction have caused severe prejudice, financial loss, professional disruption, and grave mental agony to the Complainant.

4. PEREMPTORY STATUTORY DEMAND:
You are hereby called upon to comply with the following demands within SEVEN (7) DAYS of receipt of this notice:
  (a) Deliver the complete, unconditional statutory approval / certification / 100% financial refund claimed under Docket Ref: ${rNo};
  (b) Tender a written apology for the arbitrary delay, non-responsiveness, and administrative harassment;
  (c) Pay statutory interest at 12% per annum from the date of default until final realization, along with ₹10,000/- towards legal drafting costs.

NOTICE OF LEGAL CONSEQUENCES:
PLEASE NOTE that upon your failure to comply within the stipulated seven (7) days, the Complainant shall, without further notice, institute formal legal proceedings against you before the Hon'ble District Consumer Disputes Redressal Commission, Vazhuthacaud, Thiruvananthapuram, claiming full restitution along with ₹50,000/- towards exemplary compensation and punitive damages at your sole risk and peril.

Issued under legal reservation of all rights and remedies.

Yours faithfully,

___________________________________________
[SIGNATURE]
(${pName})
Complainant / Aggrieved Citizen
Address: ${pLoc}
Contact Mobile: +91 98470 12345
Email: ${currentUser?.email || 'applicant@citizen.kerala.gov.in'}`
    },

    stage5: {
      id: 'stage5',
      label: '📑 5. Statutory RTI Application Draft',
      badge: 'Section 6(1) RTI Act 2005',
      tag: 'Stage 5: Official File Notings',
      desc: 'Statutory application to Public Information Officer (PIO) demanding certified copies of note-sheets, file movement logs, and written reasons for administrative delay.',
      generateSubject: (rNo) => `STATUTORY RTI APPLICATION UNDER SECTION 6(1) OF RTI ACT, 2005: Certified Copies of File Notings, Scrutiny Sheets, and Delay Reasons for Docket [Ref: ${rNo}] — Reg.`,
      generateBody: (pName, pLoc, rOrg, rNo, rDate) => 
`FORM OF APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
(Section 6(1) of Central Act 22 of 2005 / Kerala Right to Information Rules)

RTI APPLICATION REF NO: RTI/KL-TVM/2026/${rNo}
DATE: ${rDate}
PLACE: ${pLoc}

TO:
The State Public Information Officer (SPIO) / Assistant SPIO,
${rOrg},
Government Secretariat / Departmental Headquarters,
${pLoc.includes('Kerala') ? pLoc : 'Thiruvananthapuram, Kerala - 695001'}.

1. FULL NAME OF APPLICANT: ${pName}
2. PERMANENT RESIDENTIAL ADDRESS: ${pLoc}
3. CITIZENSHIP: Citizen of India
4. PARTICULARS OF INFORMATION SOUGHT:
The applicant had formally submitted an application for "${processData?.title || 'the administrative matter'}" on ${rDate}, registered under Docket Reference No: ${rNo}. In this connection, please furnish the following certified information:
  (i) Certified, true copy of all Note-Sheets, scrutiny remarks, and orders recorded by dealing assistants, section officers, and competent authorities on File No. ${rNo};
  (ii) Certified copy of the Day-to-Day File Movement Register indicating the date of receipt, dispatch, and duration for which the file was held by each official;
  (iii) Names, designations, and official contact numbers of all officers who handled the file from ${rDate} to date;
  (iv) Certified copy of the Citizen's Charter standards and rules governing the maximum permissible time limit for this service;
  (v) If the application has exceeded the Citizen's Charter timeframe, please provide certified copies of the specific reasons recorded in writing explaining the delay.

5. STATUTORY FEE:
Court Fee Stamp of ₹10/- (Rupees Ten only) is affixed herewith / paid via Treasury e-Challan / IPO in accordance with the Kerala Right to Information (Fee and Cost) Rules.

6. SOLEMN DECLARATION:
I hereby declare that I am a citizen of India and the information sought does not fall under any of the exemptions contained in Section 8 or 9 of the Right to Information Act, 2005.

APPLICANT:
___________________________________________
[DIGITALLY SIGNED / SIGNATURE]
(${pName})
Citizen Applicant
Jurisdiction & Address: ${pLoc}
Phone: +91 98470 12345
Email: ${currentUser?.email || 'applicant@citizen.kerala.gov.in'}`
    }
  };

  // Re-render draft when stage, sender, or ref changes
  useEffect(() => {
    const preset = stagePresets[selectedStage];
    if (preset) {
      const subj = preset.generateSubject ? preset.generateSubject(refNumber) : (preset.subject || '');
      setSubject(subj);
      const generated = preset.generateBody(
        senderName,
        senderLocation,
        recipientOrg,
        refNumber,
        relevantDate
      );
      setEmailBody(generated);
    }
  }, [selectedStage, senderName, senderLocation, refNumber, relevantDate, recipientOrg]);

  const handleCopy = () => {
    const fullText = `TO: ${recipientEmail}\nSUBJECT: ${subject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `TO: ${recipientEmail}\nSUBJECT: ${subject}\n\n${emailBody}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Official_Dispatch_${selectedStage}_${senderName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate direct Gmail Web Compose URL
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl p-5 sm:p-7 relative max-h-[92vh] overflow-y-auto flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
          title="Close Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Header Badge */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>State Secretariat & Statutory Legal Dispatch Studio</span>
          </div>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="text-neutral-400 font-medium normal-case hidden sm:inline">
            Kerala State Right to Service Act, 2012 & CSMOP Standards
          </span>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Official Administrative & Executive Correspondence
          </h3>
          
          {/* View Mode Toggle: Letterhead Paper vs Plain Text */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('letterhead')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'letterhead'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Letterhead View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Plain Text / Email Dispatch</span>
            </button>
          </div>
        </div>

        {/* 🎯 5 Procedural Communication Stages Selector */}
        <div className="mb-4">
          <label className="text-neutral-300 font-bold text-xs uppercase tracking-wider block mb-2">
            Select Procedural Legal / Administrative Stage:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(stagePresets).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedStage(key)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedStage === key
                    ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="font-bold text-xs truncate">{preset.label}</div>
                <div className="text-[10px] text-cyan-400/90 font-medium mt-0.5 truncate">{preset.badge}</div>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-neutral-300 mt-2 bg-neutral-950/90 p-2.5 rounded-xl border border-neutral-800 flex items-start gap-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider shrink-0 text-[10px] mt-0.5">
              Statutory Context:
            </span>
            <span className="leading-relaxed">{stagePresets[selectedStage].desc}</span>
          </div>
        </div>

        {/* Personalization Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs mb-4">
          <div>
            <label className="text-neutral-400 font-semibold block mb-1">Signatory Legal Name</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Signatory Name"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-neutral-400 font-semibold block">Jurisdiction Station</label>
              <span className="text-[9px] text-cyan-400 font-bold">Default: TVM</span>
            </div>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={senderLocation}
                onChange={(e) => setSenderLocation(e.target.value)}
                placeholder="Thiruvananthapuram, Kerala"
                className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-400 font-semibold block mb-1">Dispatch / Docket Ref ID</label>
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="Ref ID"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-neutral-400 font-semibold block mb-1">Official Recipient Email</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="authority@kerala.gov.in"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-cyan-500 outline-none text-xs"
            />
          </div>
        </div>

        {/* Subject Line Bar */}
        <div className="mb-4 text-xs">
          <label className="text-neutral-400 font-semibold block mb-1">
            Official Subject Line (CSMOP / Legal Notice Standards)
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-cyan-300 font-semibold focus:border-cyan-500 outline-none text-xs"
          />
        </div>

        {/* Main Document Content: Either Letterhead View or Plain Text View */}
        {viewMode === 'letterhead' ? (
          <div className="mb-5 flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Executive Letterhead Memorandum (Formal Print Preview)</span>
              </span>
              <span className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                A4 Official Ratio • Kerala Government Standard
              </span>
            </div>

            {/* Pristine Executive Parchment Letterhead Container */}
            <div className="printable-letterhead bg-[#fdfbf7] text-neutral-900 border-2 border-neutral-300/80 rounded-2xl p-6 sm:p-9 shadow-2xl overflow-x-auto max-h-[50vh] overflow-y-auto font-serif leading-relaxed">
              
              {/* Official Seal & Header Motif */}
              <div className="text-center pb-4 border-b-2 border-neutral-800">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 text-amber-400 font-bold mb-2 shadow-inner border border-amber-500/40">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="text-xs tracking-[0.25em] font-extrabold uppercase text-neutral-700">
                  GOVERNMENT OF KERALA / STATUTORY JURISDICTION
                </div>
                <div className="text-base sm:text-lg font-black tracking-tight text-neutral-900 uppercase mt-0.5">
                  ADMINISTRATIVE DISPATCH MEMORANDUM & FORMAL CITIZEN REPRESENTATION
                </div>
                <div className="text-[11px] font-sans font-semibold text-neutral-600 mt-1">
                  Issued under the Kerala State Right to Service Act, 2012 / Central Secretariat Manual of Office Procedure (CSMOP)
                </div>
              </div>

              {/* Official Dispatch Coordinates Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 my-3 bg-neutral-100/90 border-y border-neutral-300 text-[11px] font-sans">
                <div>
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Dispatch Ref No</span>
                  <strong className="text-neutral-900 font-mono">KL-TVM/2026/RTS-{refNumber}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Station / Jurisdiction</span>
                  <strong className="text-neutral-900">{senderLocation}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Date of Dispatch</span>
                  <strong className="text-neutral-900">{relevantDate}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase text-[9px] font-bold">Transmission Mode</span>
                  <span className="text-neutral-800 font-semibold">Speed Post A.D. & Email</span>
                </div>
              </div>

              {/* Addressee Block */}
              <div className="text-xs font-sans mb-4 leading-normal">
                <div className="font-bold uppercase text-neutral-800">TO:</div>
                <div className="font-semibold text-neutral-950">
                  The Competent Authority & Head of Department / Nodal Officer,
                </div>
                <div className="text-neutral-700">{recipientOrg},</div>
                <div className="text-neutral-700">{senderLocation.includes('Kerala') ? senderLocation : 'Thiruvananthapuram, Kerala - 695001'}.</div>
                <div className="text-neutral-500 text-[11px] mt-0.5">Official Inward Portal / Email: {recipientEmail}</div>
              </div>

              {/* Formal Subject & References Box */}
              <div className="p-3 bg-amber-500/10 border-l-4 border-amber-600 my-3 text-xs">
                <div className="font-black text-neutral-950 uppercase tracking-wide mb-1.5">
                  SUBJECT: {subject}
                </div>
                <div className="text-[11px] text-neutral-700 font-sans space-y-0.5">
                  <div><strong>Ref 1:</strong> Online Docket / Inward Application ID: <span className="font-mono">{refNumber}</span></div>
                  <div><strong>Ref 2:</strong> Citizen's Charter Public Service Delivery Norms (G.O.(P) No. 12/2012/P&ARD)</div>
                  <div><strong>Ref 3:</strong> Statutory Resolution Timeline: {currentStep.when_timeline || '7-14 Working Days'}</div>
                </div>
              </div>

              {/* Formal Rendered Body */}
              <div className="text-xs sm:text-sm text-neutral-900 whitespace-pre-wrap leading-relaxed space-y-3 pt-2 font-serif">
                {emailBody}
              </div>

              {/* Official Inward Stamp & Attestation Seal Graphic */}
              <div className="mt-8 pt-4 border-t-2 border-dashed border-neutral-300 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
                <div className="p-3 rounded-xl border-2 border-emerald-700/60 bg-emerald-50 text-emerald-950 max-w-xs">
                  <div className="flex items-center gap-1 font-bold text-[11px] text-emerald-800 uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Statutory Citizen Verification</span>
                  </div>
                  <p className="text-[10px] text-emerald-900 mt-1">
                    Digitally signed under Section 67 of the Information Technology Act, 2000. True and complete representation.
                  </p>
                  <div className="text-[9px] font-mono text-emerald-700 mt-1">
                    Signatory: {senderName} • {senderLocation}
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block p-3 rounded-full border-2 border-neutral-400 text-neutral-600 text-[9px] font-mono uppercase tracking-widest text-center">
                    [ OFFICIAL INWARD STAMP & DATE ]<br />
                    DISTRICT INWARD DESK • THIRUVANANTHAPURAM
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Plain Text / Email Dispatch View */
          <div className="mb-5 flex-1 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-neutral-400 font-semibold">
                Official Email Body (Fully Editable Text)
              </label>
              <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-mono">
                <span>{emailBody.split(/\s+/).filter(Boolean).length} words</span>
                <span>•</span>
                <span>{emailBody.length} characters</span>
              </div>
            </div>
            <textarea
              rows={13}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:border-cyan-500 outline-none font-mono text-xs leading-relaxed"
            />
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800 mt-auto">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Official Text!' : 'Copy to Clipboard'}</span>
            </button>

            {/* Print Official Letter (PDF) Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 text-xs font-semibold transition cursor-pointer border border-amber-500/20"
              title="Prints clean white A4 Letterhead or Saves as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Letter (PDF)</span>
            </button>

            {/* Download Official .TXT Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? 'Downloaded!' : 'Download Memo'}</span>
            </button>
          </div>

          {/* Direct Send via Gmail Web */}
          <a
            href={gmailComposeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open & Send via Gmail Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
