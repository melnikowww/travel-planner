package services

import (
	"log"
	"travelPlanner/backend/models"
	"travelPlanner/backend/repositories"
	"travelPlanner/backend/security"
	"travelPlanner/backend/utils"
)

type UserService struct {
	UserRepo *repositories.UserRepository
}

func (s *UserService) GetAllUsers() ([]*models.User, error) {
	users, err := s.UserRepo.GetAllUsers()

	if err != nil {
		log.Printf("Get all users error: %v", err)
		return nil, err
	}
	return users, err
}
func (s *UserService) GetUser(id int) (*models.User, error) {
	user, err := s.UserRepo.FindById(id)
	if err != nil {
		log.Printf("Get user error: %v", err)
		return nil, err
	}
	return user, err
}
func (s *UserService) GetUsersExpeditions(id int) ([]*models.Expedition, error) {
	expeditions, err := s.UserRepo.GetUsersExpeditions(id)
	if err != nil {
		log.Printf("Get users expeditions error: %v", err)
		return nil, err
	}
	return expeditions, err
}
func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	user, err := s.UserRepo.FindByEmail(email)
	if err != nil {
		log.Printf("Get user by email error: %v", err)
		return nil, err
	}
	return user, err
}
func (s *UserService) CreateUser(user *models.User) (int, error) {
	user.ImageSrc = "/src/assets/avatar.png"
	id, err := s.UserRepo.CreateUser(user)
	if err != nil {
		log.Printf("Create user error: %v", err)
	}
	return id, err
}
func (s *UserService) DeleteUser(id int) error {
	err := s.UserRepo.DeleteUser(id)
	if err != nil {
		log.Printf("Delete user error: %v", err)
	}
	return err
}
func (s *UserService) UpdateUser(user *models.User) (*models.User, error) {
	oldUser, err := s.GetUser(user.ID)
	user.Name = utils.FirstNonEmptyString(user.Name, oldUser.Name)
	user.Email = utils.FirstNonEmptyString(user.Email, oldUser.Email)
	if len(user.Password) == 0 {
		user.Password = oldUser.Password
	} else {
		user.Password, err = security.HashPassword(user.Password)
	}
	updUser, err := s.UserRepo.UpdateUser(user)
	if err != nil {
		log.Printf("Update user error: %v", err)
		return nil, err
	}
	return updUser, err
}
