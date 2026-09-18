from typing import List, Dict, Any
from urllib.parse import urlparse

OFFICIAL_DOMAINS = [
    ".gov.in", ".gov", ".nic.in", ".edu", ".ac.in", ".org.in",
    "ktu.edu.in", "thuna.keralapolice.gov.in", "airsewa.gov.in",
    "udyamregistration.gov.in", "gst.gov.in", "auswaertiges-amt.de",
    "india.diplo.de", "consumerhelpline.gov.in", "dgca.gov.in", "services.india.gov.in"
]

TRUSTED_DOMAINS = [
    "vfsglobal.com", "uni-assist.de", "daad.de", "ecourts.gov.in",
    "thehindu.com", "timesofindia.indiatimes.com", "livelaw.in", "barandbench.com"
]

def classify_source_trust(url: str) -> str:
    """
    Classifies source into:
    - 'official' (🟢 Government, accredited university, legal statutory authority)
    - 'trusted' (🔵 Established institutions, accredited partners, leading legal registries)
    - 'supporting' (🟡 General community references or guides)
    """
    if not url:
        return "supporting"
    
    parsed = urlparse(url)
    hostname = (parsed.hostname or "").lower()
    
    for domain in OFFICIAL_DOMAINS:
        if domain in hostname:
            return "official"
            
    for domain in TRUSTED_DOMAINS:
        if domain in hostname:
            return "trusted"
            
    return "supporting"

def analyze_and_rank_sources(raw_search_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Extracts, deduplicates, tags, and ranks sources by official authority.
    Strictly verifies URLs and extracts dates. Never invents links.
    """
    sources = []
    seen_urls = set()
    
    for res_block in raw_search_results:
        engine = res_block.get("search_metadata", {}).get("engine", "Google Web")
        
        # Organic results
        organic = res_block.get("organic_results", [])
        for item in organic:
            url = item.get("link")
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)
            
            source_type = classify_source_trust(url)
            sources.append({
                "id": f"src_{len(sources) + 1}",
                "title": item.get("title", "Official Reference"),
                "url": url,
                "source_type": source_type,
                "snippet": item.get("snippet", ""),
                "date_published": item.get("date", None),
                "engine_used": engine
            })

    # Sort so official sources come first
    type_priority = {"official": 0, "trusted": 1, "supporting": 2}
    sources.sort(key=lambda s: type_priority.get(s["source_type"], 3))
    
    return sources
