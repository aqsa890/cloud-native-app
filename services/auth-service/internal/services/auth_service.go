package services

import (
	"errors"
	"time"

	"auth-service/internal/models"
	"auth-service/internal/repository"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService struct {
	repo      *repository.UserRepository
	jwtSecret string
}

func NewAuthService(repo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) Login(req models.LoginRequest) (*models.AuthResponse, error) {
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email and password are required")
	}

	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if user.Password != req.Password {
		return nil, errors.New("invalid credentials")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, errors.New("failed to generate auth token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.AuthResponse, error) {
	if req.Name == "" || req.Email == "" || req.Password == "" {
		return nil, errors.New("name, email, and password are required")
	}

	user, err := s.repo.Create(&req)
	if err != nil {
		return nil, errors.New("could not create user or email already exists")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) generateToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"name":    user.Name,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
