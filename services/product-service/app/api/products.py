from typing import List
from fastapi import APIRouter, HTTPException, status
from app.models.product import ProductResponse
from app.repositories.product_repository import ProductRepository
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])

repository = ProductRepository()
service = ProductService(repository)

@router.get("", response_model=List[ProductResponse])
@router.get("/", response_model=List[ProductResponse])
def get_all_products():
    """Retrieve all available products."""
    return service.get_products()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int):
    """Retrieve a single product by ID."""
    product = service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product
