package services

import (
	"log"
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/security"
	"travelPlanner/internal/utils"
)

type UserService struct {
	UserRepo *repositories.UserRepository
}

func (s *UserService) GetAllUsers() ([]*models.User, error) {
	users, err := s.UserRepo.GetAllUsers()

	if err != nil {
		log.Printf("Ошибка при получении списка пользователей: %v", err)
		return nil, err
	}
	return users, nil
}
func (s *UserService) GetUser(id int) (*models.User, error) {
	user, err := s.UserRepo.FindById(id)
	if err != nil {
		log.Printf("Ошибка при извлечении записи пользователя: %v", err)
		return nil, err
	}
	return user, nil
}
func (s *UserService) CreateUser(user *models.User) (int, error) {
	id, err := s.UserRepo.CreateUser(user)
	if err != nil {
		log.Printf("Ошибка при создании пользователя: %v", err)
		return id, err
	}
	return id, nil
}
func (s *UserService) DeleteUser(id int) error {
	err := s.UserRepo.DeleteUser(id)
	if err != nil {
		log.Printf("Ошибка при удалении пользователя: %v", err)
		return err
	}
	return nil
}
func (s *UserService) UpdateUser(user *models.User) (*models.User, error) {
	oldUser, err := s.GetUser(user.ID)
	user.Name = utils.FirstNonEmptyString(user.Name, oldUser.Name)
	user.Email = utils.FirstNonEmptyString(user.Email, oldUser.Email)
	if user.Password == "" {
		user.Password = oldUser.Password
	} else {
		user.Password, err = security.HashPassword(user.Password)
	}
	updUser, err := s.UserRepo.UpdateUser(user)
	if err != nil {
		log.Printf("Ошибка при обновлении пользователя: %v", err)
		return nil, err
	}
	return updUser, nil
}
