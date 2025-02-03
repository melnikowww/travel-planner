package services

import (
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
)

type UserService struct {
	UserRepo *repositories.UserRepository
}

func (s *UserService) GetUser(id int) (*models.User, error) {
	return s.UserRepo.FindById(id)
}
func (s *UserService) CreateUser(user *models.User) int {
	return s.UserRepo.CreateUser(user)
}
