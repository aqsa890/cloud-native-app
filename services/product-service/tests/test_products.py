from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert "Product Service" in data["service"]

def test_get_all_products():
    response = client.get("/products")
    assert response.status_code == 200
    products = response.json()
    assert isinstance(products, list)
    assert len(products) > 0
    assert "id" in products[0]
    assert "name" in products[0]
    assert "price" in products[0]

def test_get_product_by_id_success():
    response = client.get("/products/1")
    assert response.status_code == 200
    product = response.json()
    assert product["id"] == 1
    assert "DevOps Handbook" in product["name"]

def test_get_product_by_id_not_found():
    response = client.get("/products/99999")
    assert response.status_code == 404
    error = response.json()
    assert "not found" in error["detail"]
