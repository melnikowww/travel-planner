package services

import (
	"log"
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type CarsService struct {
	CarsRepo *repositories.CarsRepository
}

func (s *CarsService) GetAllCars() ([]*models.Car, error) {
	cars, err := s.CarsRepo.GetAllCars()
	if err != nil {
		log.Printf("Get cars list error: %v", err)
		return nil, err
	}
	return cars, err
}
func (s *CarsService) GetCar(id int) (*models.Car, error) {
	car, err := s.CarsRepo.GetCar(id)
	if err != nil {
		log.Printf("Get car error: %v", err)
		return nil, err
	}
	return car, err
}
func (s *CarsService) CreateCar(car *models.Car) (int, error) {
	id, err := s.CarsRepo.CreateCar(car)
	if err != nil {
		log.Printf("Create car error: %v", err)
		return id, err
	}
	return id, err
}
func (s *CarsService) UpdateCar(car *models.Car) (*models.Car, error) {
	oldCar, err := s.GetCar(car.ID)
	car.Name = utils.FirstNonEmptyString(car.Name, oldCar.Name)
	car.UserID = utils.FirstNonEmptyInt(car.UserID, oldCar.UserID)
	updCar, err := s.CarsRepo.UpdateCar(car)
	if err != nil {
		log.Printf("Update car error: %v", err)
		return nil, err
	}
	return updCar, err
}
func (s *CarsService) DeleteCar(id int) error {
	err := s.CarsRepo.DeleteCar(id)
	if err != nil {
		log.Printf("Delete car error: %v", err)
	}
	return err
}
