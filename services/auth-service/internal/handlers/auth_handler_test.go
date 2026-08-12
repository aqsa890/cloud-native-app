package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"auth-service/internal/models"
	"auth-service/internal/repository"
	"auth-service/internal/services"
)

func TestAuthHandler_Endpoints(t *testing.T) {
	repo, _ := repository.NewUserRepository("")
	service := services.NewAuthService(repo, "secret123")
	handler := NewAuthHandler(service)

	t.Run("Health Endpoint", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/auth/health", nil)
		rr := httptest.NewRecorder()

		handler.Health(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Expected status 200, got %d", rr.Code)
		}
	})

	t.Run("Login Endpoint Success", func(t *testing.T) {
		payload, _ := json.Marshal(models.LoginRequest{
			Email:    "demo@example.com",
			Password: "password123",
		})

		req := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBuffer(payload))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		handler.Login(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Expected status 200, got %d", rr.Code)
		}
	})
}
