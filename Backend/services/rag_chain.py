"""
RAG chain using recipe context and optional Tavily fallback when recipe doesn't contain the answer.
Uses LangChain with Google Gemini.
"""
import os
from typing import Any

from dotenv import load_dotenv

from services.vector_store import build_recipe_vector_store
from services.tavily_search import search_tavily, format_tavily_results

load_dotenv()

# Lazy imports for LangChain/Google
def _get_llm():
    from langchain_google_genai import ChatGoogleGenerativeAI
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        google_api_key=api_key,
        temperature=0.2,
    )


RAG_SYSTEM = """You are a helpful assistant answering questions about a recipe. Use ONLY the recipe context below to answer. If the recipe does not contain enough information to answer the question, say clearly: "The recipe does not contain this information." Do not make up details."""

RAG_USER_TEMPLATE = """Recipe context:
{context}

User question: {question}

Answer based only on the recipe context above. If the information is not in the recipe, say so."""

SUFFICIENCY_TEMPLATE = """Consider this question and answer pair about a recipe.

Question: {question}

Answer: {answer}

Does the recipe context alone fully support this answer? Could the user have gotten this answer only from the recipe? Reply with exactly one word: YES or NO."""

TAVILY_SYSTEM = """You are a helpful assistant. The user asked a question about a recipe. The recipe context alone was not enough. Use the web search results below (and optionally the recipe context) to give a helpful, accurate answer. Cite sources when relevant."""

TAVILY_USER_TEMPLATE = """Recipe context (may be partial):
{recipe_context}

Web search results:
{web_results}

User question: {question}

Provide a comprehensive answer using the web search results above."""


def _run_rag(recipe: dict[str, Any], question: str) -> str:
    """Run RAG only: retrieve recipe context and generate answer. Returns empty string if LLM/embeddings unavailable."""
    llm = _get_llm()
    if llm is None:
        return ""

    vector_store = build_recipe_vector_store(recipe)
    if vector_store is None:
        # No embeddings: use full recipe text as context
        from services.vector_store import recipe_to_chunks
        context = "\n\n".join(recipe_to_chunks(recipe))
    else:
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})
        docs = retriever.invoke(question)
        context = "\n\n".join(doc.page_content for doc in docs)

    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser

    prompt = ChatPromptTemplate.from_messages([
        ("system", RAG_SYSTEM),
        ("human", RAG_USER_TEMPLATE),
    ])
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"context": context, "question": question})


def _answer_sufficient(question: str, answer: str) -> bool:
    """Use LLM to decide if the RAG answer is fully supported by recipe context."""
    llm = _get_llm()
    if llm is None:
        return True  # avoid Tavily if no LLM
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    prompt = ChatPromptTemplate.from_messages([("human", SUFFICIENCY_TEMPLATE)])
    chain = prompt | llm | StrOutputParser()
    reply = chain.invoke({"question": question, "answer": answer}).strip().upper()
    return reply.startswith("YES")


def answer_with_rag_or_tavily(recipe: dict[str, Any], user_message: str) -> str:
    """
    Answer the user's question using recipe context (RAG). If the recipe doesn't contain
    the answer, use Tavily to search the web and generate a comprehensive answer.
    """
    # 1. Run RAG with recipe context
    rag_answer = _run_rag(recipe, user_message)
    if not rag_answer:
        # Fallback when GOOGLE_API_KEY missing or RAG failed: try Tavily only
        web_results = search_tavily(user_message, max_results=5)
        if not web_results:
            return "I couldn't process your question. Please ensure the recipe and API keys (Google, optionally Tavily) are configured."
        llm = _get_llm()
        if llm is None:
            return format_tavily_results(web_results)
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_core.output_parsers import StrOutputParser
        from services.vector_store import recipe_to_chunks
        recipe_context = "\n\n".join(recipe_to_chunks(recipe))
        prompt = ChatPromptTemplate.from_messages([
            ("system", TAVILY_SYSTEM),
            ("human", TAVILY_USER_TEMPLATE),
        ])
        chain = prompt | llm | StrOutputParser()
        return chain.invoke({
            "recipe_context": recipe_context,
            "web_results": format_tavily_results(web_results),
            "question": user_message,
        })

    # 2. Check if answer is fully supported by recipe
    if _answer_sufficient(user_message, rag_answer):
        return rag_answer

    # 3. Fallback to Tavily and answer with web results
    web_results = search_tavily(user_message, max_results=5)
    if not web_results:
        return rag_answer + "\n\n(I looked for more information online but couldn't find additional results.)"

    llm = _get_llm()
    if llm is None:
        return rag_answer

    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    from services.vector_store import recipe_to_chunks
    recipe_context = "\n\n".join(recipe_to_chunks(recipe))
    prompt = ChatPromptTemplate.from_messages([
        ("system", TAVILY_SYSTEM),
        ("human", TAVILY_USER_TEMPLATE),
    ])
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({
        "recipe_context": recipe_context,
        "web_results": format_tavily_results(web_results),
        "question": user_message,
    })
