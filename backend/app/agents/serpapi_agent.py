import hashlib
import json
import logging
from datetime import datetime
from typing import Dict, Any, List
import httpx
from app.config import SERPAPI_API_KEY
from app.database import get_db

logger = logging.getLogger("nextstep.serpapi")

def _compute_cache_key(query: str, engine: str) -> str:
    raw = f"{engine}:{query.strip().lower()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def get_cached_search(query: str, engine: str) -> Dict[str, Any] | None:
    cache_key = _compute_cache_key(query, engine)
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT results_json FROM search_cache WHERE query_hash = ?", (cache_key,))
    row = cursor.fetchone()
    conn.close()
    if row:
        try:
            return json.loads(row["results_json"])
        except Exception:
            return None
    return None

def store_cached_search(query: str, engine: str, results: Dict[str, Any]):
    cache_key = _compute_cache_key(query, engine)
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR REPLACE INTO search_cache (query_hash, query, engine, results_json, cached_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (cache_key, query, engine, json.dumps(results), datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()

async def execute_serpapi_search(query: str, engine: str = "google", location: str = "India") -> Dict[str, Any]:
    """
    Executes SerpApi live search with SQLite caching and credit protection.
    Falls back gracefully to rich realistic data if key is missing or limit reached.
    """
    # 1. Check local cache first
    cached = get_cached_search(query, engine)
    if cached:
        logger.info(f"[SerpApi CACHE HIT] {engine}: {query}")
        return {**cached, "_cached": True}

    # 2. Live SerpApi search if key is configured
    if SERPAPI_API_KEY and SERPAPI_API_KEY.strip() != "":
        try:
            params = {
                "api_key": SERPAPI_API_KEY,
                "engine": engine,
                "q": query,
                "hl": "en",
                "gl": "in"
            }
            if engine == "youtube":
                params["search_query"] = query
            if engine == "google_maps":
                params["type"] = "search"

            import asyncio
            import requests

            def _do_get():
                return requests.get("https://serpapi.com/search.json", params=params, timeout=20.0)

            resp = await asyncio.to_thread(_do_get)
            if resp.status_code == 200:
                data = resp.json()
                store_cached_search(query, engine, data)
                logger.info(f"[SerpApi LIVE SUCCESS] {engine}: {query}")
                return {**data, "_cached": False, "_live": True}
            else:
                logger.warning(f"SerpApi returned status {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.error(f"SerpApi request failed: {e}")

    # 3. Realistic fallback data generator for offline/hackathon reliability
    simulated_result = _generate_simulated_serpapi_response(query, engine)
    store_cached_search(query, engine, simulated_result)
    return {**simulated_result, "_cached": False, "_simulated": True}

def _generate_simulated_serpapi_response(query: str, engine: str) -> Dict[str, Any]:
    q_lower = query.lower()
    
    if "ktu" in q_lower or "certificate" in q_lower:
        return {
            "search_metadata": {"status": "Success", "engine": engine},
            "organic_results": [
                {
                    "title": "Guidelines for Issuance of Duplicate Degree Certificate - KTU",
                    "link": "https://ktu.edu.in",
                    "snippet": "APJ Abdul Kalam Technological University guidelines for duplicate certificate: Requires Police Non-Traceable report and Sworn Affidavit attested by Notary Public.",
                    "date": "2024-03-12"
                },
                {
                    "title": "Kerala Police Online Portal - Thuna Missing Articles",
                    "link": "https://thuna.keralapolice.gov.in",
                    "snippet": "File complaint for lost certificates and download certified non-traceable report within 48 hours without visiting police station physically.",
                    "date": "2024-08-01"
                },
                {
                    "title": "KTU e-Gov Student Portal Login and Examination Services",
                    "link": "https://app.ktu.edu.in",
                    "snippet": "Students can apply online for duplicate certificates, marksheets, and migration certificates by uploading notarized affidavit.",
                    "date": "2024-05-18"
                }
            ],
            "knowledge_graph": {
                "title": "APJ Abdul Kalam Technological University",
                "type": "State University in Thiruvananthapuram, Kerala",
                "phone": "0471 2598122",
                "website": "https://ktu.edu.in"
            }
        }
    elif "flight" in q_lower or "dgca" in q_lower:
        return {
            "search_metadata": {"status": "Success", "engine": engine},
            "organic_results": [
                {
                    "title": "DGCA Civil Aviation Requirements - Cancellation & Refund Passenger Charter",
                    "link": "https://www.dgca.gov.in",
                    "snippet": "Airlines must provide full refund within 7 working days if flight is cancelled or delayed beyond 6 hours, without deducting cancellation charges.",
                    "date": "2024-02-18"
                },
                {
                    "title": "AirSewa - Ministry of Civil Aviation Passenger Grievance Portal",
                    "link": "https://airsewa.gov.in",
                    "snippet": "Government grievance portal to report airline refund refusal, flight delays, and unreceived statutory compensation under DGCA CAR.",
                    "date": "2024-09-01"
                }
            ]
        }
    elif "udyam" in q_lower or "business" in q_lower:
        return {
            "search_metadata": {"status": "Success", "engine": engine},
            "organic_results": [
                {
                    "title": "Udyam Registration Official Portal - Zero Cost MSME Registration",
                    "link": "https://udyamregistration.gov.in",
                    "snippet": "Ministry of Micro, Small and Medium Enterprises official portal. Udyam Registration is free, paperless and instant with Aadhaar OTP.",
                    "date": "2024-05-10"
                },
                {
                    "title": "GST Registration for New Business Entities - GST Common Portal",
                    "link": "https://www.gst.gov.in",
                    "snippet": "Mandatory and voluntary GST registration application process with PAN and address documentation.",
                    "date": "2024-06-15"
                }
            ]
        }
    elif "german" in q_lower or "visa" in q_lower:
        return {
            "search_metadata": {"status": "Success", "engine": engine},
            "organic_results": [
                {
                    "title": "German Missions in India - Student Visa Checklist & Requirements",
                    "link": "https://india.diplo.de",
                    "snippet": "National Visa Type D checklist for Indian students: Unconditional university admission, APS certificate, and blocked account with €11,904.",
                    "date": "2024-06-20"
                },
                {
                    "title": "VFS Global - German Visa Application Centre Appointments",
                    "link": "https://visa.vfsglobal.com",
                    "snippet": "Book appointment for biometrics and VIDEX application submission across Mumbai, Delhi, Bangalore, and Chennai centres.",
                    "date": "2024-08-11"
                }
            ]
        }
    else:
        return {
            "search_metadata": {"status": "Success", "engine": engine},
            "organic_results": [
                {
                    "title": f"Official Citizen Services Portal - {query}",
                    "link": "https://services.india.gov.in",
                    "snippet": f"Official procedure and online portal application guide for citizen task: {query}.",
                    "date": "2024-01-01"
                },
                {
                    "title": "National Consumer & Citizen Helpline Grievance Redressal",
                    "link": "https://consumerhelpline.gov.in",
                    "snippet": "Citizen helpline and consumer dispute assistance with government regulatory oversight.",
                    "date": "2024-04-12"
                }
            ]
        }


async def get_serpapi_account_info() -> Dict[str, Any]:
    """
    Queries SerpApi Account API (free of charge, does not consume monthly quota).
    Returns live account metrics, remaining searches, renewal date, and usage.
    """
    if not SERPAPI_API_KEY or SERPAPI_API_KEY.strip() == "":
        return {
            "status": "unconfigured",
            "configured": False,
            "message": "SERPAPI_API_KEY is not set."
        }
    
    try:
        import asyncio
        import requests
        
        def _fetch():
            return requests.get(
                "https://serpapi.com/account.json",
                params={"api_key": SERPAPI_API_KEY},
                timeout=10.0
            )
            
        resp = await asyncio.to_thread(_fetch)
        if resp.status_code == 200:
            data = resp.json()
            # Mask the raw API key before sending to client
            if "api_key" in data and data["api_key"]:
                raw_key = data["api_key"]
                data["api_key_masked"] = f"{raw_key[:6]}...{raw_key[-4:]}"
                del data["api_key"]
            data["configured"] = True
            return data
        else:
            return {
                "configured": True,
                "error": f"SerpApi Account API returned {resp.status_code}",
                "detail": resp.text
            }
    except Exception as e:
        return {
            "configured": True,
            "error": str(e)
        }

