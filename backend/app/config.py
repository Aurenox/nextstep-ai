import os
from pathlib import Path
from dotenv import load_dotenv

# Locate base directory and load .env or .env.example
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
ENV_EXAMPLE = BASE_DIR / ".env.example"

if ENV_PATH.exists():
    load_dotenv(ENV_PATH, override=True)
elif ENV_EXAMPLE.exists():
    load_dotenv(ENV_EXAMPLE, override=True)
else:
    load_dotenv(override=True)

SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
DATABASE_PATH = os.getenv("DATABASE_PATH", str(BASE_DIR / "nextstep.db"))
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "127.0.0.1")

# Search credit and budget protection
SERPAPI_MAX_QUERIES_PER_REQUEST = 3
CACHE_TTL_HOURS = 24 * 7  # Cache search results for up to 7 days
