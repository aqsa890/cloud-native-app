.PHONY: lint test lint-frontend lint-gateway lint-payment lint-auth lint-product test-frontend test-gateway test-payment test-auth test-product

lint: lint-frontend lint-gateway lint-payment lint-auth lint-product

test: test-frontend test-gateway test-payment test-auth test-product

lint-frontend:
	cd frontend && npm run lint

lint-gateway:
	cd gateway && npm run lint

lint-payment:
	cd services/payment-service && npm run lint

lint-auth:
	cd services/auth-service && make lint

lint-product:
	cd services/product-service && make lint

test-frontend:
	cd frontend && npm test

test-gateway:
	cd gateway && npm test

test-payment:
	cd services/payment-service && npm test

test-auth:
	cd services/auth-service && make test

test-product:
	cd services/product-service && make test
