from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class IntentRequest(BaseModel):
    problem: str = Field(..., description="Raw problem text from the user")
    user_location: Optional[str] = Field(None, description="Optional detected user location")

class IntentResponse(BaseModel):
    goal: str
    category: str
    detected_country: Optional[str] = None
    detected_state: Optional[str] = None
    detected_city: Optional[str] = None
    likely_authority: Optional[str] = None
    confidence: float = 0.95
    is_location_needed: bool = False

class QuestionItem(BaseModel):
    id: str
    question: str
    placeholder: str
    options: Optional[List[str]] = None
    field_key: str

class QuestionRequest(BaseModel):
    problem: str
    collected_answers: Dict[str, str] = Field(default_factory=dict)

class QuestionResponse(BaseModel):
    questions: List[QuestionItem]
    remaining_count: int
    is_complete: bool

class StepItem(BaseModel):
    id: str
    order: int
    title: str
    what: str
    why: str
    how: str
    what_i_need: List[str]
    where_label: str
    where_url: Optional[str] = None
    who_authority: str
    when_timeline: str
    source_title: str
    source_url: str
    source_type: str  # 'official', 'trusted', 'supporting'
    status: str = "pending"  # 'pending', 'in_progress', 'completed', 'skipped'
    is_fast_path_skippable: bool = False
    is_new_step: bool = False

class SourceItem(BaseModel):
    id: str
    title: str
    url: str
    source_type: str  # 'official', 'trusted', 'supporting'
    snippet: str
    date_published: Optional[str] = None
    engine_used: str = "Google Web"

class ContactItem(BaseModel):
    id: str
    organization: str
    department: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    map_url: Optional[str] = None
    working_hours: Optional[str] = None

class DocumentItem(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    is_required: bool = True
    is_held: bool = False

class ActionMapNode(BaseModel):
    id: str
    label: str
    type: str  # 'goal', 'branch', 'service', 'action', 'destination', 'complete'
    status: str # 'active', 'completed', 'pending'
    details: Optional[str] = None

class ActionMapEdge(BaseModel):
    source: str
    target: str
    animated: bool = True

class ActionMap(BaseModel):
    nodes: List[ActionMapNode]
    edges: List[ActionMapEdge]

class ResearchRequest(BaseModel):
    problem: str
    answers: Dict[str, str] = Field(default_factory=dict)
    scenario_id: Optional[str] = None
    user_id: Optional[str] = "user_default"

class SuggestionsRequest(BaseModel):
    problem: str
    user_location: Optional[str] = None

class ProcessSuggestionItem(BaseModel):
    id: str
    icon: str
    title: str
    description: str
    query: str

class ProcessSuggestionsResponse(BaseModel):
    suggestions: List[ProcessSuggestionItem]
    source_query: str

class StageItem(BaseModel):
    id: str
    name: str
    status: str = "upcoming"  # 'completed', 'active', 'upcoming'

class StageActionItem(BaseModel):
    id: str
    title: str
    description: str
    icon: str = "mail"  # 'mail', 'file', 'refresh', 'external'
    action_type: str  # 'email', 'document', 'adaptive', 'portal'
    button_text: str = "Open"
    target_url: Optional[str] = None

class ActionDashboardResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    country: str
    state: str
    city: str
    authority: str
    completion_percentage: int
    estimated_time: str
    current_stage: str = "Requirements Gathering"
    stages: List[StageItem] = Field(default_factory=list)
    fields: Dict[str, str] = Field(default_factory=dict)
    suggested_missing_field: Optional[Dict[str, Any]] = None
    stage_actions: List[StageActionItem] = Field(default_factory=list)
    next_step: StepItem
    steps: List[StepItem]
    sources: List[SourceItem]
    contacts: List[ContactItem]
    documents: List[DocumentItem]
    action_map: ActionMap
    search_queries_used: List[str]
    source_confidence_summary: Dict[str, Any]

class ProcessFieldsUpdateRequest(BaseModel):
    fields: Dict[str, str]

class EmailGenerateRequest(BaseModel):
    process_id: str
    sender_name: str
    reference_number: Optional[str] = None
    relevant_date: Optional[str] = None
    specific_request: str
    stage: Optional[str] = None
    fields: Dict[str, str] = Field(default_factory=dict)
    latest_reply: Optional[str] = None
    recipient_email: Optional[str] = None
    recipient_org: Optional[str] = None

class EmailGenerateResponse(BaseModel):
    recipient: str
    subject: str
    body: str
    gmail_url: str

class DocumentGenerateRequest(BaseModel):
    process_id: str
    doc_type: str  # 'affidavit', 'complaint', 'application', 'declaration', 'request'
    user_name: str
    address: Optional[str] = None
    contact_phone: Optional[str] = None
    stage: Optional[str] = None
    details: Dict[str, str] = Field(default_factory=dict)

class DocumentGenerateResponse(BaseModel):
    title: str
    content: str
    download_filename: str

class AdaptiveUpdateRequest(BaseModel):
    process_id: str
    new_information: str

class FastPathRequest(BaseModel):
    process_id: str
    held_document_ids: List[str]
