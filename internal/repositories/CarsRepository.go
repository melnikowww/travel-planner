package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/internal/models"
)

type CarsRepository struct {
	DB *gorm.DB
}

func (r *CarsRepository) GetAllCars() ([]*models.Car, error) {
	var cars []*models.Car
	err := r.DB.Find(&cars)
	for _, car := range cars {
		r.DB.First(&car.Owner, car.UserID)
	}
	if err.Error != nil {
		return nil, err.Error
	}
	return cars, nil
}

func (r *CarsRepository) GetCar(id int) (*models.Car, error) {
	var car *models.Car
	err := r.DB.First(&car, id)
	r.DB.First(&car.Owner, car.UserID)
	return car, err.Error
}

func (r *CarsRepository) CreateCar(car *models.Car) (int, error) {
	r.DB.First(&car.Owner, car.UserID)
	err := r.DB.Create(&car)
	if err.Error != nil {
		return car.ID, err.Error
	}
	return car.ID, nil
}

func (r *CarsRepository) UpdateCar(car *models.Car) (*models.Car, error) {
	r.DB.First(&car.Owner, car.UserID)
	err := r.DB.Save(&car)
	return car, err.Error
}

func (r *CarsRepository) DeleteCar(id int) error {
	return r.DB.Delete(&models.Car{}, id).Error
}
