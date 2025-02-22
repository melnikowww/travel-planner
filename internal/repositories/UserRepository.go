package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/internal/models"
)

type UserRepository struct {
	DB *gorm.DB
}

func (r *UserRepository) FindById(id int) (*models.User, error) {
	var person models.User
	err := r.DB.
		Preload("Cars").
		Preload("Crews").
		//Select("id", "name", "email").
		First(&person, id)
	return &person, err.Error
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var person models.User
	err := r.DB.
		Preload("Crews").
		Preload("Cars").
		Where("email = ?", email).
		First(&person)
	return &person, err.Error
}

func (r *UserRepository) GetAllUsers() ([]*models.User, error) {
	var users []*models.User
	err := r.DB.
		Preload("Cars").
		Preload("Crews").
		Select("id", "name", "email").
		Find(&users)
	return users, err.Error
}

func (r *UserRepository) CreateUser(person *models.User) (int, error) {
	result := r.DB.Preload("Cars").Create(&person)
	return person.ID, result.Error
}

func (r *UserRepository) DeleteUser(id int) error {
	return r.DB.Delete(&models.User{}, id).Error
}

func (r *UserRepository) UpdateUser(user *models.User) (*models.User, error) {
	err := r.DB.Save(&user)
	return user, err.Error
}
