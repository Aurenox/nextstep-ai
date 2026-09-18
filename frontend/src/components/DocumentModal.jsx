import React, { useState, useEffect } from 'react';
import { X, FileText, Copy, Check, Download, Sparkles, Edit3, ShieldAlert, Scale, FileSpreadsheet, Bookmark } from 'lucide-react';
import { generateDocument } from '../api';

export default function DocumentModal({ processData, currentUser, onClose }) {
  const [docType, setDocType] = useState('affidavit'); // 'affidavit' | 'complaint' | 'indemnity' | 'rti'
  const [userName, setUserName] = useState(currentUser?.name || 'Applicant');
  const [address, setAddress] = useState(currentUser?.location ? `Residing at ${currentUser.location}` : 'Residing at Thiruvananthapuram, Kerala');
  const [phone, setPhone] = useState('+91 98470 12345');
  const [regNumber, setRegNumber] = useState('REG-KL-2024-88421');
  const [incidentDate, setIncidentDate] = useState('14-Aug-2024');

  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [editableContent, setEditableContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const documentFormats = [
    {
      id: 'affidavit',
      icon: '📜',
      title: 'Sworn Affidavit',
      subtitle: '₹200 Non-Judicial Stamp Paper',
      purpose: 'Required for lost degree certificates, loss of property, name correction, and official declarations before Notary Public.'
    },
    {
      id: 'complaint',
      icon: '⚖️',
      title: 'Consumer Grievance Notice',
      subtitle: 'Section 35 Consumer Protection Act',
      purpose: 'Formal legal notice to airline, brand, or service provider demanding replacement or refund before filing in consumer court.'
    },
    {
      id: 'indemnity',
      icon: '🛡️',
      title: 'Indemnity & Undertaking Bond',
      subtitle: 'Statutory Safeguard Agreement',
      purpose: 'Legal bond holding the university or issuing department harmless against future misuse or discovery of duplicate records.'
    },
    {
      id: 'rti',
      icon: '📑',
      title: 'RTI Application Draft',
      subtitle: 'Section 6(1) Right to Information Act',
      purpose: 'Statutory application to Public Information Officer (PIO) demanding file notings and reasons for inordinate departmental delay.'
    }
  ];

  // Auto-generate realistic document text based on selection
  const handleGenerate = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      // Direct high-quality legal templates
      let content = '';
      let filename = 'document.txt';

      if (docType === 'affidavit') {
        filename = `Sworn_Affidavit_${userName.replace(/\s+/g, '_')}.txt`;
        content = 
`================================================================================
BEFORE THE HONOURABLE NOTARY PUBLIC / EXECUTIVE MAGISTRATE
AT THIRUVANANTHAPURAM, KERALA
================================================================================
(TO BE EXECUTED ON NON-JUDICIAL STAMP PAPER OF VALUE ₹200/-)

SWORN AFFIDAVIT UNDER OATH

I, ${userName}, son/daughter of ___________________, aged about ___ years, residing at ${address}, having Mobile No: ${phone}, do hereby solemnly affirm and state on oath as under:

1. That I was a bona fide student / applicant under ${processData?.authority || 'the Competent Authority'} bearing Registration / Docket No: ${regNumber}.

2. That the original record / document concerning "${processData?.title || 'the matter'}" was lost / misplaced by me under the following circumstances:
   - Date of loss / incident: On or about ${incidentDate}.
   - Place and context of loss: In transit while relocating residence. Despite diligent search, the original could not be traced.

3. That I have duly reported the loss of the said document to the competent Police Department and obtained the official Non-Traceable Entry / Police General Diary Report.

4. That the said original certificate / document has neither been pledged, misused, nor submitted to any other institution for employment, migration, or fraudulent gain.

5. That in the event the original certificate / record is discovered or recovered at any future date, I solemnly undertake to surrender the same immediately to ${processData?.authority || 'the issuing authority'} for cancellation.

6. That the statements made in paragraphs 1 to 5 above are true and correct to the best of my knowledge, information, and belief, and nothing material has been concealed therefrom.

DEPONENT:
_________________________
(${userName})
Signed and verified at Thiruvananthapuram on this _____ day of ____________ 2026.

ATTESTATION BY NOTARY PUBLIC:
Solemnly affirmed and signed before me by the Deponent who is personally known to me / identified by ___________________ on this _____ day of ____________ 2026.

[NOTARY SEAL & REGISTRATION NUMBER]
ADVOCATE & NOTARY PUBLIC`;
      } else if (docType === 'complaint') {
        filename = `Consumer_Grievance_Notice_${userName.replace(/\s+/g, '_')}.txt`;
        content =
`================================================================================
LEGAL NOTICE UNDER SECTION 35 OF CONSUMER PROTECTION ACT, 2019
FOR DEFICIENCY IN SERVICE & UNFAIR TRADE PRACTICE
================================================================================

Date: ${new Date().toLocaleDateString('en-GB')}

To:
The Principal Nodal Officer / Grievance Cell,
${processData?.authority || 'Operating Enterprise / Service Provider'},
Jurisdiction: ${processData?.city || 'Local'}, ${processData?.state || 'National'}.

FROM:
${userName},
Address: ${address}
Contact: ${phone}

SUBJECT: FORMAL STATUTORY NOTICE OF DEFICIENCY IN SERVICE & REFUND DEMAND
REFERENCE: Booking / Job Sheet / Docket ID: ${regNumber}

Respected Authority,

Under instructions and on behalf of myself, I hereby serve upon you this formal statutory grievance notice under the Consumer Protection Act, 2019:

1. That the Complainant availed services / purchased goods concerning "${processData?.title || 'Subject Transaction'}" under Invoice/Ref ID: ${regNumber} dated ${incidentDate}.

2. That despite having collected consideration in full, you have committed gross deficiency in service and arbitrary unfair trade practice by:
   a) Failing to honour statutory guarantees / cancellation compensation within the prescribed turnaround time;
   b) Unlawfully denying or delaying legitimate replacement / 100% full refund;
   c) Causing severe mental agony, harassment, and pecuniary loss to the Complainant.

3. DEMAND:
   You are hereby called upon to:
   i. Provide full refund / replacement of the claimed amount without any arbitrary deductions;
   ii. Disburse statutory interest at 12% per annum from the date of default until realization;
   iii. Pay ₹15,000/- towards mental agony and legal notice expenses.

FAILURE CLAUSE:
If the aforesaid demand is not fulfilled within seven (7) business days of the receipt of this notice, the Complainant shall file a formal complaint before the District Consumer Disputes Redressal Commission under Section 35 of the Consumer Protection Act, 2019, holding you liable for all punitive damages, compensation, and legal costs.

Yours sincerely,
_________________________
(${userName})
Enclosures:
1. Copy of Retail Invoice / PNR Receipt
2. Authorized Job Sheet / Technical Defect Report
3. Prior Written Communication Records`;
      } else if (docType === 'indemnity') {
        filename = `Indemnity_Bond_${userName.replace(/\s+/g, '_')}.txt`;
        content =
`================================================================================
DEED OF INDEMNITY & UNDERTAKING BOND
================================================================================
(TO BE EXECUTED ON ₹200/- NON-JUDICIAL STAMP PAPER)

THIS DEED OF INDEMNITY is made and executed on this _____ day of ___________ 2026, by:
${userName}, residing at ${address} (hereinafter called the "OBLIGOR / INDEMNIFIER")
IN FAVOUR OF:
${processData?.authority || 'The Competent Government Authority'} (hereinafter called the "INDEMNIFIED AUTHORITY").

WHEREAS the Indemnifier was issued original records under Register Number ${regNumber} in relation to "${processData?.title || 'the official matter'}";
AND WHEREAS the said original has been lost and the Indemnifier has requested the issuance of a duplicate copy thereof;

NOW THIS DEED WITNESSETH AS FOLLOWS:
1. In consideration of the Indemnified Authority agreeing to issue a duplicate record, the Indemnifier hereby covenants and agrees to indemnify and keep indemnified the Authority from and against all suits, actions, claims, damages, demands, and costs whatsoever that may arise in the event of any fraudulent presentation or misuse of the original document.
2. The Indemnifier undertakes to deliver the original record to the Authority forthwith if the same is recovered.

IN WITNESS WHEREOF the Indemnifier has set his/her hands hereto:

INDEMNIFIER:
_________________________
(${userName})

WITNESS 1: _____________________ (Signature, Name & Address)
WITNESS 2: _____________________ (Signature, Name & Address)`;
      } else if (docType === 'rti') {
        filename = `RTI_Application_${userName.replace(/\s+/g, '_')}.txt`;
        content =
`================================================================================
FORM 'A' — APPLICATION FOR INFORMATION UNDER SECTION 6(1)
OF THE RIGHT TO INFORMATION ACT, 2005
================================================================================

To:
The Public Information Officer (PIO) / Assistant PIO,
${processData?.authority || 'Competent Department / Ministry'},
${processData?.city || 'City'}, ${processData?.state || 'State'}.

1. Full Name of the Applicant: ${userName}
2. Address for Communication: ${address}
3. Contact Details: ${phone}
4. Particulars of Information Required:
   Subject: Inordinate delay in processing application concerning "${processData?.title || 'Administrative Request'}" (Reference ID: ${regNumber}).

   Information Sought:
   a) Provide daily progress report / certified copy of file notings from ${incidentDate} to date regarding Docket No: ${regNumber}.
   b) State the designated Citizens Charter processing timeline for this category of service.
   c) Provide the name, designation, and official contact of the officer(s) with whom the file remained pending beyond the prescribed turnaround time.
   d) What action has been taken against the erring officials under departmental service conduct rules?

5. Application Fee: Postal Order / Court Fee Stamp No: ________________ of ₹10/- enclosed herewith.
6. The information sought does not fall within the exemptions contained in Section 8 or 9 of the RTI Act, 2005.

Place: Thiruvananthapuram
Date: ${new Date().toLocaleDateString('en-GB')}

_________________________
Signature of Applicant (${userName})`;
      }

      setGeneratedDoc({
        title: documentFormats.find(d => d.id === docType)?.title || 'Legal Document',
        download_filename: filename,
        content
      });
      setEditableContent(content);
    } catch (err) {
      console.error("Document generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate first format on mount
  useEffect(() => {
    handleGenerate();
  }, [docType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editableContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generatedDoc?.download_filename || 'legal_document.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Statutory Document Studio</span>
        </div>
        <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
          Generate Verified Legal Documents
        </h3>
        <p className="text-xs text-neutral-400 mb-5">
          Select the document required for your stage. Formatted ready for stamp paper printing, notary seal, or official RTI filing.
        </p>

        {/* Document Format Cards Selector */}
        <div className="mb-5">
          <label className="text-neutral-300 font-bold text-xs uppercase tracking-wider block mb-2">
            Select Legal Document Format:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {documentFormats.map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setDocType(fmt.id)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                  docType === fmt.id
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <span className="text-xl">{fmt.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate">{fmt.title}</div>
                  <div className="text-[10px] text-amber-400/90 font-medium">{fmt.subtitle}</div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{fmt.purpose}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Personalization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
          <div>
            <label className="text-neutral-400 font-semibold block mb-1">Applicant Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="text-neutral-400 font-semibold block mb-1">Registration / PNR / Docket No</label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="text-neutral-400 font-semibold block mb-1">Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-500 outline-none text-xs"
            />
          </div>
        </div>

        {/* Document Editor */}
        <div className="mb-5 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-neutral-400 font-semibold">
              Document Preview (Print / Notary Ready)
            </label>
            <span className="text-[11px] text-neutral-500">
              Editable plain text format
            </span>
          </div>
          <textarea
            rows={10}
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono text-xs leading-relaxed focus:border-amber-500 outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Document'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Formatted Document (.txt)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
