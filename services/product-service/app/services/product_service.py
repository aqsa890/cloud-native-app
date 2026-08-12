from typing import List, Optional
from app.repositories.product_repository import ProductRepository
from app.models.product import ProductResponse

class ProductService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    def get_products(self) -> List[ProductResponse]:
        return self.repo.get_all()

    def get_product_by_id(self, product_id: int) -> Optional[ProductResponse]:
        return self.repo.get_by_id(product_id)
