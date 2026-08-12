import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.products import router as product_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("product-service")

app = FastAPI(
    title="Product Microservice",
    description="Lightweight Python FastAPI microservice for managing product catalog",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Product Routes
app.include_router(product_router)

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Product Service (Python FastAPI)",
        "port": settings.PORT
    }

if __name__ == "__main__":
    import uvicorn
    logger.info(f"=================================")
    logger.info(f"📦 Product Service running on port {settings.PORT}")
    logger.info(f"=================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
