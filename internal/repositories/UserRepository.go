package repositories

import (
	"gorm.io/gorm"
	"log"
	"travelPlanner/internal/models"
)

type UserRepository struct {
	DB *gorm.DB
}

func (repo *UserRepository) FindById(id int) (*models.User, error) {
	var person models.User
	repo.DB.First(&person, id)
	return &person, nil
}

func (repo *UserRepository) FindByEmail(email string) (*models.User, error) {
	var person models.User
	repo.DB.First(&person).Where("email = $1", email)
	return &person, nil
}

func (repo *UserRepository) GetAllUsers() ([]*models.User, error) {
	var users []*models.User
	result := repo.DB.Find(&users)
	if result.Error != nil {
		log.Printf("Ошибка при извлечении всех записей: %v", result.Error)
		return nil, result.Error
	}
	return users, nil
}

func (repo *UserRepository) CreateUser(person *models.User) uint {
	var newUser *models.User
	result := repo.DB.Create(&person).Scan(&newUser)
	if result.Error != nil {
		log.Printf("Ошибка при создании записи: %v", result.Error)
	}
	return newUser.ID
}

func (repo *UserRepository) DeleteUser(id int) error {
	return repo.DB.Delete(&models.User{}, id).Error
}

func (repo *UserRepository) UpdateUser(user *models.User) (*models.User, error) {
	repo.DB.Save(&user)
	return repo.FindByEmail(user.Email)
}
