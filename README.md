# Recipe Scraper and Organizer - Project Documentation

## Project Overview

Recipe Scraper and Organizer is a full-stack web application that allows users to browse recipes from a Kaggle dataset and interact with them using RAG (Retrieval-Augmented Generation). Users can view recipes on a dashboard, click on any recipe to see details, and chat with the recipe using AI. If the answer isn't available in the recipe, the system automatically searches the internet using Tavily to provide comprehensive answers.

## Technology Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (routing)
- Firebase SDK (authentication)

### Backend
- Python 3.12+
- FastAPI (REST API)
- Uvicorn (ASGI server)
- Pydantic (data validation)
- Pandas (CSV parsing)
- SQLite (recipe data storage)

### AI/ML
- LangChain (RAG implementation)
- Google Gemini LLM (chat responses)
- Tavily API (internet search fallback)
- Vector store (recipe embeddings - in-memory or ChromaDB)

### Authentication
- Firebase Authentication (email/password)

## Project Structure

```
recipe-scraper-and-organizer/
├── Backend/
│   ├── main.py                 # FastAPI application
│   ├── database/               # Database setup and models
│   ├── routes/                # API route handlers
│   ├── services/              # Business logic (RAG, Tavily)
│   ├── scripts/               # Setup scripts (dataset download)
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service functions
│   │   ├── config/             # Firebase configuration
│   │   └── App.jsx             # Main app component
│   ├── package.json            # Node dependencies
│   └── .env                    # Frontend environment variables
│
├── issues/                     # All project issues
├── project_details.md          # Detailed project plan
└── PROJECT-README.md           # This file
```

## Issue Flow

### Foundation Phase (Issues 1-8)
1. **Issue #01**: Project Setup - Initialize project structure and dependencies
2. **Issue #02**: Landing Page UI - Create static landing page
3. **Issue #03**: Signup Page UI - Create signup form (static)
4. **Issue #04**: Login Page UI - Create login form (static)
5. **Issue #05**: Firebase Auth Setup - Configure Firebase project and SDK
6. **Issue #06**: Integrate Signup with Firebase - Connect signup form to Firebase
7. **Issue #07**: Integrate Login with Firebase - Connect login form to Firebase
8. **Issue #08**: Dashboard UI - Create protected dashboard page

### Core Features Phase (Issues 9-12)
9. **Issue #09**: Dataset Download & Database Setup - Download Kaggle dataset and store in SQLite
10. **Issue #10**: Display Recipes - Backend API + Frontend integration to show recipes
11. **Issue #11**: Recipe Detail View - Backend API + Frontend detail page
12. **Issue #12**: RAG Chat Feature - LangChain RAG + Tavily fallback + Chat UI

### Final Phase (Issue 13)
13. **Issue #13**: Final Testing - Complete application flow verification

## API Endpoints

### Authentication
Authentication is handled entirely by Firebase SDK on the frontend. No backend auth endpoints are required.

### Recipe Endpoints

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| GET | `/api/recipes` | Yes | Get all recipes | No |
| GET | `/api/recipes/:id` | Yes | Get single recipe details | No |
| POST | `/api/recipes/:id/chat` | Yes | Chat with recipe using RAG | Yes (RAG + Tavily) |

**Note:** All protected endpoints require Firebase authentication token in request headers.

## Pages and Routes

| Page Name | Route | Protected | Purpose | Main Components |
|-----------|-------|-----------|---------|-----------------|
| Landing | `/` | No | Welcome page with app info | Navbar, Hero, Features, Footer |
| Signup | `/signup` | No | User registration | SignupForm |
| Login | `/login` | No | User authentication | LoginForm |
| Dashboard | `/dashboard` | Yes | Main user interface with recipe list | Navbar, RecipeList, RecipeCard |
| Recipe Detail | `/recipes/:id` | Yes | View single recipe and chat | RecipeDetail, IngredientList, InstructionList, ChatInterface |

## Components

### Shared Components
- **Navbar** - Navigation header with logout functionality
- **Footer** - Footer with links and information
- **LoadingSpinner** - Loading indicator
- **ErrorMessage** - Error display component

### Landing Page Components
- **Hero** - Hero section with CTA
- **Features** - Feature showcase section

### Authentication Components
- **SignupForm** - Registration form
- **LoginForm** - Login form

### Dashboard Components
- **RecipeList** - Display recipes grid/list
- **RecipeCard** - Single recipe card

### Recipe Detail Components
- **RecipeDetail** - Full recipe view
- **IngredientList** - Display ingredients
- **InstructionList** - Display instructions
- **ChatInterface** - Chat with recipe
- **ChatMessage** - Single chat message

## Database Schema

### Recipes Table
Stores recipe data from Kaggle dataset:
- Essential fields: identifier, title, ingredients, instructions, servings, prep_time, cook_time, image_url, and other fields from Kaggle dataset
- Note: Students design exact field names and data types based on Kaggle dataset structure
- Recipes are public/shared - no per-user ownership needed

### Optional: Chat History Table
- Purpose: Store chat history for user sessions (optional - can be in-memory)
- Essential fields: identifier, recipe_id, user_id (Firebase UID), message, response, created_at

## User Flow

1. **First Visit**: User lands on Landing page → Clicks "Sign Up"
2. **Registration**: Fills signup form → Firebase creates account → Redirects to login
3. **Login**: Enters credentials → Firebase authenticates → Redirects to Dashboard
4. **Main Usage**: 
   - Views dashboard with recipes list
   - Clicks recipe card to view details
   - Views ingredients, instructions, and recipe information
   - Uses chat interface to ask questions about recipe
   - RAG system answers from recipe context
   - If answer not in recipe, system uses Tavily to search internet
   - Receives comprehensive answer

## Key Features

### Recipe Database
- Access to recipes from Kaggle dataset stored in SQLite
- Recipes displayed in dashboard grid/list view
- Detailed recipe view with ingredients and instructions

### Interactive Chat
- Ask questions about recipes using RAG
- LangChain creates RAG chain with recipe content as context
- Vector embeddings for semantic search
- Context-aware responses based on recipe information

### Internet Fallback
- Tavily API integration for internet search
- Automatic fallback when recipe doesn't contain answer
- Combines recipe context with internet results

## Development Setup

### Prerequisites
- Python 3.12+
- UV Package Manager
- Node.js 18+
- Google API Key (for Gemini LLM)
- Firebase project (for authentication)
- Tavily API key (for internet search)
- Kaggle API credentials (for dataset download)

### Backend Setup
1. Navigate to Backend directory
2. Create virtual environment: `uv venv`
3. Activate virtual environment
4. Install dependencies: `uv add -r requirements.txt`
5. Create `.env` file with:
   - `GOOGLE_API_KEY=your_api_key`
   - `TAVILY_API_KEY=your_tavily_key`
6. Run setup script to download dataset and populate database
7. Start server: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to Frontend directory
2. Install dependencies: `npm install`
3. Create `.env` file with Firebase configuration
4. Start dev server: `npm run dev`

## Architecture Overview

```
┌─────────────┐
│   Browser  │
└──────┬──────┘
       │
       │ HTTP Requests
       │
┌──────▼─────────────────┐
│   React Frontend       │
│   - Firebase Auth      │
│   - React Router        │
│   - Components          │
└──────┬─────────────────┘
       │
       │ API Calls
       │
┌──────▼─────────────────┐
│   FastAPI Backend       │
│   - SQLite Database     │
│   - LangChain RAG       │
│   - Tavily Integration   │
└──────┬─────────────────┘
       │
       │
┌──────▼─────────────────┐
│   SQLite Database       │
│   - Recipes Table       │
└─────────────────────────┘
```

## Data Flow Examples

### Display Recipes Flow
```
Load Dashboard → RecipeList Component → GET /api/recipes → FastAPI → SQLite Query → Recipe List → Display Cards
```

### RAG Chat Flow
```
Send Message → ChatInterface → POST /api/recipes/:id/chat → FastAPI → RAG Chain (Recipe Context) → If not found: Tavily Search → LLM Response → Display Message
```

## Testing Checklist

- [ ] All pages load correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] Firebase authentication works (signup, login, logout)
- [ ] Recipes display correctly on dashboard
- [ ] Recipe detail page shows complete information
- [ ] RAG chat provides answers from recipe context
- [ ] Tavily fallback works when recipe doesn't contain answer
- [ ] Error states are handled gracefully
- [ ] Loading states are displayed appropriately
- [ ] UI is responsive across screen sizes

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [LangChain Documentation](https://python.langchain.com/)
- [Tavily API Documentation](https://docs.tavily.com/)
- [Kaggle API Documentation](https://www.kaggle.com/docs/api)

## Notes

- This project uses Firebase for authentication (no backend auth logic)
- SQLite is used for recipe data storage (not for authentication)
- LangChain is used for RAG implementation with simple vector stores
- Tavily API provides internet search fallback
- Students design their own database schemas based on Kaggle dataset structure
- All issues follow a progressive difficulty pattern
- Combined frontend+backend issues reduce context switching
