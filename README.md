# Microservices Practice Application (`micro-docker-cicd`)

A clean, modular, minimal 3-tier microservices application built for hands-on practice with **Docker, CI/CD pipelines, and DevSecOps workflows**.

This repository contains **only application source code** and local execution setup. Infrastructure, Dockerfiles, Compose specs, and CI/CD pipelines are intentionally omitted so you can build them from scratch.

---

## 1. Architecture Overview

```text
React + Vite (Frontend)
       │
       ▼  (Port 8000)
  API Gateway (Node.js/Express)
       │
       ├─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
 Auth Service             Product Service           Payment Service
  (Go / MySQL)          (Python / PostgreSQL)     (Node.js / PostgreSQL)
  (Port 8001)               (Port 8002)               (Port 8003)
```

- **Frontend (`/frontend`)**: React + Vite UI. Communicates **strictly with the API Gateway**.
- **API Gateway (`/gateway`)**: Express proxy routing `/api/auth`, `/api/products`, `/api/payments`.
- **Auth Service (`/services/auth-service`)**: Go service managing login/registration and issuing JWT tokens.
- **Product Service (`/services/product-service`)**: FastAPI Python service returning catalog & product details.
- **Payment Service (`/services/payment-service`)**: Express Node.js service managing simulated payment processing.

---

## 2. Tech Stack

| Component | Technology | Framework | Database | Default Port |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | JavaScript | React 18 + Vite | N/A | `3000` |
| **API Gateway** | Node.js | Express.js | N/A | `8000` |
| **Auth Service** | Go 1.22 | Standard `net/http` | MySQL | `8001` |
| **Product Service** | Python 3.11+ | FastAPI | PostgreSQL | `8002` |
| **Payment Service** | Node.js | Express.js | PostgreSQL | `8003` |

---

## 3. Directory Structure

```text
micro-docker-cicd/
├── frontend/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/           # Navbar, AuthModal, ProductCard, PaymentModal
│   │   ├── pages/                # Catalog, Orders
│   │   ├── services/             # API client (Gateway target)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .gitignore
│
├── gateway/                      # Express API Gateway
│   ├── src/
│   │   ├── config/               # Environment resolution
│   │   ├── routes/               # Service proxies
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── services/
│   ├── auth-service/             # Go + MySQL Authentication Service
│   │   ├── cmd/
│   │   │   └── main.go
│   │   ├── internal/
│   │   │   ├── config/
│   │   │   ├── handlers/
│   │   │   ├── models/
│   │   │   ├── repository/
│   │   │   └── services/
│   │   ├── go.mod
│   │   └── .env.example
│   │
│   ├── product-service/          # Python + FastAPI Product Catalog Service
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── config.py
│   │   │   └── main.py
│   │   ├── requirements.txt
│   │   └── .env.example
│   │
│   └── payment-service/          # Node.js + Express Payment Simulation Service
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   └── server.js
│       ├── package.json
│       └── .env.example
│
├── .env.example                  # Consolidated root environment template
├── .gitignore                    # Global git ignore configuration
├── .dockerignore                  # Global docker context ignore rules
└── README.md
```

---

## 4. Environment Variables

Each service loads environment settings from its own `.env` file (or inherited process variables). Copy `.env.example` in each folder to `.env` when running locally.

### Central Reference (`/.env.example`)

```env
# Gateway
GATEWAY_PORT=8000
AUTH_SERVICE_URL=http://localhost:8001
PRODUCT_SERVICE_URL=http://localhost:8002
PAYMENT_SERVICE_URL=http://localhost:8003

# Auth Service (Go + MySQL)
AUTH_PORT=8001
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=auth_db
MYSQL_USER=root
MYSQL_PASSWORD=password
JWT_SECRET=supersecretjwtkey

# Product Service (Python + PostgreSQL)
PRODUCT_PORT=8002
POSTGRES_PRODUCT_HOST=localhost
POSTGRES_PRODUCT_PORT=5432
POSTGRES_PRODUCT_DB=product_db
POSTGRES_PRODUCT_USER=postgres
POSTGRES_PRODUCT_PASSWORD=postgres

# Payment Service (Node.js + PostgreSQL)
PAYMENT_PORT=8003
POSTGRES_PAYMENT_HOST=localhost
POSTGRES_PAYMENT_PORT=5433
POSTGRES_PAYMENT_DB=payment_db
POSTGRES_PAYMENT_USER=postgres
POSTGRES_PAYMENT_PASSWORD=postgres

# Frontend
VITE_API_GATEWAY_URL=http://localhost:8000
```

---

## 5. Database Requirements

1. **MySQL (Auth Service)**:
   - Database name: `auth_db`
   - Table `users`: auto-created on startup with initial seed user `demo@example.com` / `password123`.

2. **PostgreSQL (Product Service)**:
   - Database name: `product_db`
   - Table `products`: auto-created on startup with seed catalog items.

3. **PostgreSQL (Payment Service)**:
   - Database name: `payment_db`
   - Table `payments`: auto-created on startup.

> **Note**: All services include automatic seed/mock fallback mechanisms. If database instances are not yet running, services will log a warning and continue operating with in-memory state so you can test API endpoints immediately!

---

## 6. How to Run Each Service Locally

### Step 1: Start API Gateway
```bash
cd gateway
npm install
npm run dev
# Running on http://localhost:8000
```

### Step 2: Start Auth Service (Go)
```bash
cd services/auth-service
go run cmd/main.go
# Running on http://localhost:8001
```

### Step 3: Start Product Service (Python)
```bash
cd services/product-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
# Running on http://localhost:8002
```

### Step 4: Start Payment Service (Node.js)
```bash
cd services/payment-service
npm install
npm run dev
# Running on http://localhost:8003
```

### Step 5: Start Frontend (React)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 7. API Reference & Verification Examples

### Health Check Endpoints
```bash
curl http://localhost:8000/health
curl http://localhost:8001/api/auth/health
curl http://localhost:8002/health
curl http://localhost:8003/health
```

### Auth Service (via Gateway)
- **Login**:
  ```bash
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "demo@example.com", "password": "password123"}'
  ```

- **Register**:
  ```bash
  curl -X POST http://localhost:8000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name": "Alice DevOps", "email": "alice@example.com", "password": "securepass"}'
  ```

### Product Service (via Gateway)
- **Get All Products**:
  ```bash
  curl http://localhost:8000/api/products
  ```

- **Get Single Product**:
  ```bash
  curl http://localhost:8000/api/products/1
  ```

### Payment Service (via Gateway)
- **Process Simulated Payment**:
  ```bash
  curl -X POST http://localhost:8000/api/payments \
    -H "Content-Type: application/json" \
    -d '{"user_id": 1, "product_id": 2, "amount": 49.50}'
  ```

- **Get User Payments**:
  ```bash
  curl http://localhost:8000/api/payments/user/1
  ```
