"""
Tavily API integration for internet search fallback when recipe context is insufficient.
Set TAVILY_API_KEY in .env for web search.
"""
import os
from typing import Any

from dotenv import load_dotenv

load_dotenv()


def search_tavily(query: str, max_results: int = 5) -> list[dict[str, Any]]:
    """
    Search the web using Tavily API.
    Returns a list of result dicts with 'title', 'content', and optionally 'url'.
    Returns empty list if TAVILY_API_KEY is missing or on error.
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return []

    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=api_key)
        response = client.search(query=query, max_results=max_results)
        # Tavily API returns dict with "results" list; each has title, content, url
        if isinstance(response, dict) and "results" in response:
            results = response["results"]
        else:
            results = getattr(response, "results", []) or []
        out = []
        for r in results:
            if isinstance(r, dict):
                out.append({
                    "title": r.get("title", ""),
                    "content": r.get("content", r.get("snippet", "")),
                    "url": r.get("url", ""),
                })
            else:
                out.append({
                    "title": getattr(r, "title", ""),
                    "content": getattr(r, "content", ""),
                    "url": getattr(r, "url", ""),
                })
        return out[:max_results]
    except Exception:
        return []


def format_tavily_results(results: list[dict[str, Any]]) -> str:
    """Format Tavily search results as a single string for LLM context."""
    if not results:
        return "No web search results available."
    parts = []
    for i, r in enumerate(results, 1):
        title = r.get("title", "")
        content = r.get("content", "")
        url = r.get("url", "")
        parts.append(f"[{i}] {title}\n{content}\nSource: {url}")
    return "\n\n".join(parts)
