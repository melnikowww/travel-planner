package services

import (
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
)

type CarsService struct {
	CarsRepo *repositories.CarsRepository
}

func (s *CarsService) GetAllCars() ([]*models.Car, error) {
	return s.CarsRepo.GetAllCars()
}

func (s *CarsService) GetCar(id int) (*models.Car, error) {
	return s.CarsRepo.GetCar(id)
}
func (s *CarsService) CreateCar(car *models.Car) int {
	return s.CarsRepo.CreateCar(car)
}
func (s *CarsService) UpdateCar(car *models.Car) (*models.Car, error) {
	return s.CarsRepo.UpdateCar(car)
}
func (s *CarsService) DeleteCar(id int) error {
	return s.CarsRepo.DeleteCar(id)
}
