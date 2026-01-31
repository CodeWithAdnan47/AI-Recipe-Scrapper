"""
Build an in-memory vector store from recipe content for semantic search.
Uses LangChain Google Generative AI embeddings and InMemoryVectorStore.
"""
import os
from typing import Any

from dotenv import load_dotenv

load_dotenv()

# Lazy imports to avoid failing if deps not installed
def _get_embeddings():
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None
    return GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",  # Gemini embedding; use "models/gemini-embedding-001" if needed
        google_api_key=api_key,
    )


def recipe_to_chunks(recipe: dict[str, Any]) -> list[str]:
    """Split recipe into text chunks for embedding (title, ingredients, instructions)."""
    chunks = []
    title = (recipe.get("title") or "").strip()
    if title:
        chunks.append(f"Recipe title: {title}")
    ingredients = (recipe.get("cleaned_ingredients") or recipe.get("ingredients") or "").strip()
    if ingredients:
        chunks.append(f"Ingredients: {ingredients}")
    instructions = (recipe.get("instructions") or "").strip()
    if instructions:
        chunks.append(f"Instructions: {instructions}")
    if not chunks:
        chunks.append("No recipe content available.")
    return chunks


def build_recipe_vector_store(recipe: dict[str, Any]):
    """
    Build an in-memory vector store from a recipe record.
    Input: recipe dict with title, ingredients/cleaned_ingredients, instructions.
    Output: InMemoryVectorStore instance, or None if embeddings unavailable or quota exceeded.
    """
    from langchain_core.vectorstores import InMemoryVectorStore

    embeddings = _get_embeddings()
    if embeddings is None:
        return None

    chunks = recipe_to_chunks(recipe)
    try:
        vector_store = InMemoryVectorStore.from_texts(chunks, embedding=embeddings)
        return vector_store
    except Exception as e:
        # Handle quota exhaustion or other embedding errors
        error_msg = str(e).lower()
        if "quota" in error_msg or "resource_exhausted" in error_msg or "429" in error_msg:
            print(f"WARNING: Embedding quota exceeded, falling back to non-embedding retrieval: {e}")
        else:
            print(f"WARNING: Error creating vector store, falling back to non-embedding retrieval: {e}")
        return None
