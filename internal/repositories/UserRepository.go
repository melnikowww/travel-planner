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
	err := r.DB.First(&person, id)
	return &person, err.Error
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var person models.User
	err := r.DB.First(&person).Where("email = $1", email)
	return &person, err.Error
}

func (r *UserRepository) FindCarsByUserId(id int) ([]*models.Car, error) {
	var cars []*models.Car
	err := r.DB.Where("user_id = ?", id).Find(&cars).Error
	return cars, err
}

func (r *UserRepository) FindCrewsByUserId(id int) ([]*models.Crew, error) {
	var crews []*models.Crew
	if err := r.DB.Joins("JOIN crews_users ON crews.id = crews_users.crew_id").
		Where("crews_users.user_id = ?", id).
		Find(&crews).Error; err != nil {
		return nil, err
	}

	return crews, nil
}

func (r *UserRepository) GetAllUsers() ([]*models.User, error) {
	var users []*models.User
	err := r.DB.Find(&users)
	return users, err.Error
}

func (r *UserRepository) CreateUser(person *models.User) (int, error) {
	result := r.DB.Create(&person)
	return person.ID, result.Error
}

func (r *UserRepository) DeleteUser(id int) error {
	return r.DB.Delete(&models.User{}, id).Error
}

func (r *UserRepository) UpdateUser(user *models.User) (*models.User, error) {
	err := r.DB.Save(&user)
	return user, err.Error
}
