const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchSerpApiAccount() {
  const res = await fetch(`${API_BASE}/serpapi/account`);
  return res.json();
}

export async function analyzeIntent(problem, userLocation = null) {
  const res = await fetch(`${API_BASE}/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, user_location: userLocation })
  });
  return res.json();
}

export async function getQuestions(problem, collectedAnswers = {}) {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, collected_answers: collectedAnswers })
  });
  return res.json();
}

export async function executeResearch(problem, answers = {}, scenarioId = null, userId = 'user_default') {
  const res = await fetch(`${API_BASE}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, answers, scenario_id: scenarioId, user_id: userId })
  });
  return res.json();
}

export async function generateEmail(payload) {
  const res = await fetch(`${API_BASE}/generate-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function generateDocument(payload) {
  const res = await fetch(`${API_BASE}/generate-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function submitAdaptiveUpdate(processId, newInformation) {
  const res = await fetch(`${API_BASE}/adaptive-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ process_id: processId, new_information: newInformation })
  });
  return res.json();
}

export async function calculateFastPath(processId, heldDocumentIds) {
  const res = await fetch(`${API_BASE}/fast-path`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ process_id: processId, held_document_ids: heldDocumentIds })
  });
  return res.json();
}

export async function listProcesses(userId = null) {
  const url = userId ? `${API_BASE}/processes?user_id=${encodeURIComponent(userId)}` : `${API_BASE}/processes`;
  const res = await fetch(url);
  return res.json();
}

export async function getProcess(processId) {
  const res = await fetch(`${API_BASE}/processes/${processId}`);
  return res.json();
}

export async function deleteProcess(processId) {
  const res = await fetch(`${API_BASE}/processes/${processId}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function updateStepStatus(processId, stepId, status) {
  const res = await fetch(`${API_BASE}/processes/${processId}/step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step_id: stepId, status })
  });
  return res.json();
}

export async function fetchSuggestions(problem, userLocation = null) {
  const res = await fetch(`${API_BASE}/suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, user_location: userLocation })
  });
  return res.json();
}

export async function updateProcessFields(processId, fields) {
  const res = await fetch(`${API_BASE}/processes/${processId}/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });
  return res.json();
}

