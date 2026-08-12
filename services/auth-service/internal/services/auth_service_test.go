package services

import (
	"testing"

	"auth-service/internal/models"
	"auth-service/internal/repository"
)

func TestAuthService_LoginValidation(t *testing.T) {
	// Create repo with empty DSN (will fall back to offline demo user)
	repo, _ := repository.NewUserRepository("")
	service := NewAuthService(repo, "secret123")

	t.Run("Empty Credentials", func(t *testing.T) {
		_, err := service.Login(models.LoginRequest{Email: "", Password: ""})
		if err == nil {
			t.Errorf("Expected error for empty credentials, got nil")
		}
	})

	t.Run("Valid Demo Credentials", func(t *testing.T) {
		resp, err := service.Login(models.LoginRequest{
			Email:    "demo@example.com",
			Password: "password123",
		})

		if err != nil {
			t.Fatalf("Expected successful login, got error: %v", err)
		}

		if resp.Token == "" {
			t.Errorf("Expected non-empty JWT token")
		}

		if resp.User.Email != "demo@example.com" {
			t.Errorf("Expected user email demo@example.com, got %s", resp.User.Email)
		}
	})

	t.Run("Invalid Password", func(t *testing.T) {
		_, err := service.Login(models.LoginRequest{
			Email:    "demo@example.com",
			Password: "wrongpassword",
		})

		if err == nil {
			t.Errorf("Expected error for invalid password, got nil")
		}
	})
}
