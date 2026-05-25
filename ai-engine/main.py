from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import uvicorn
from contextlib import asynccontextmanager
import asyncio
from engine import RecommendationEngine
import os

# Define the data model for the incoming request
class TrackingContext(BaseModel):
    viewed_product_ids: List[int] = []
    viewed_categories: List[str] = []
    limit: int = 4

engine = RecommendationEngine()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Fetch all products from Laravel API and fit the model
    print("Loading product catalogue from TchadBox Backend...")
    try:
        # We try to use the VITE_API_URL or default to the production one
        api_url = os.environ.get("TCHADBOX_API_URL", "https://api.douniamarket.com/api")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{api_url}/products?limit=500")
            response.raise_for_status()
            data = response.json()
            products = data.get("products", [])
            engine.fit(products)
            print(f"Successfully loaded and vectorized {len(products)} products.")
    except Exception as e:
        print(f"Warning: Failed to load products on startup: {e}")
    yield
    # Shutdown logic if any
    print("Shutting down AI engine.")


app = FastAPI(title="TchadBox AI Subsystem", lifespan=lifespan)

allowed_origins = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "https://douniamarket.com,https://www.douniamarket.com",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "ready": engine.is_ready}

@app.post("/recommend")
async def get_recommendations(context: TrackingContext):
    if not engine.is_ready:
        raise HTTPException(status_code=503, detail="AI Engine is still loading data...")
    
    # If user hasn't seen anything, return popular generic fallback
    if not context.viewed_product_ids and not context.viewed_categories:
        return {"recommendations": engine.get_random_fallback(context.limit)}
        
    try:
        recommendations = engine.recommend(
            viewed_ids=context.viewed_product_ids,
            viewed_categories=context.viewed_categories,
            top_k=context.limit
        )
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
