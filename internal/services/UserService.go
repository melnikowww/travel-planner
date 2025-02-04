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
func (s *UserService) DeleteUser(id int) error {
	return s.UserRepo.DeleteUser(id)
}
func (s *UserService) UpdateUser(user *models.User) (*models.User, error) {
	return s.UserRepo.UpdateUser(user)
}
func (s *UserService) GetAllUsers() ([]*models.User, error) {
	return s.UserRepo.GetAllUsers()
}
