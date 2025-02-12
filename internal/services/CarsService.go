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
		log.Printf("Ошибка при получении списка автомобилей: %v", err)
		return nil, err
	}
	return cars, nil
}
func (s *CarsService) GetCar(id int) (*models.Car, error) {
	car, err := s.CarsRepo.GetCar(id)
	if err != nil {
		log.Printf("Ошибка при получении автомобиля: %v", err)
		return nil, err
	}
	return car, nil
}
func (s *CarsService) CreateCar(car *models.Car) (int, error) {
	id, err := s.CarsRepo.CreateCar(car)
	if err != nil {
		log.Printf("Ошибка при создании автомобиля: %v", err)
		return id, err
	}
	var owner models.User
	s.CarsRepo.DB.First(&owner).Where("id = $1", car.UserID)
	owner.Cars = append(owner.Cars, *car)
	s.CarsRepo.DB.Save(&owner)
	return id, nil
}
func (s *CarsService) UpdateCar(car *models.Car) (*models.Car, error) {
	oldCar, err := s.GetCar(car.ID)
	car.Name = utils.FirstNonEmptyString(car.Name, oldCar.Name)
	car.UserID = utils.FirstNonEmptyInt(car.UserID, oldCar.UserID)

	updCar, err := s.CarsRepo.UpdateCar(car)
	if err != nil {
		log.Printf("Ошибка при обновлении автомобиля: %v", err)
		return nil, err
	}
	return updCar, nil
}
func (s *CarsService) DeleteCar(id int) error {
	err := s.CarsRepo.DeleteCar(id)
	if err != nil {
		log.Printf("Ошибка при удалении пользователя: %v", err)
		return err
	}
	return nil
}
