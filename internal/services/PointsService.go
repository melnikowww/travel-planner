package services

import (
	"log"
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type PointsService struct {
	PointRepo *repositories.PointsRepository
}

func (s *PointsService) GetPoint(id int) (*models.Point, error) {
	point, err := s.PointRepo.FindById(id)
	if err != nil {
		log.Printf("Ошибка при получении записи точки: %v", err)
		return nil, err
	}
	return point, nil
}
func (s *PointsService) GetAllPoints() ([]*models.Point, error) {
	points, err := s.PointRepo.GetAllPoints()
	if err != nil {
		log.Printf("Ошибка при получении списка точек: %v", err)
		return nil, err
	}
	return points, nil
}

func (s *PointsService) CreatePoint(point *models.Point) (int, error) {
	id, err := s.PointRepo.CreatePoint(point)
	if err != nil {
		log.Printf("Ошибка при создании точки: %v", err)
		return id, err
	}
	return id, nil
}
func (s *PointsService) DeletePoint(id int) error {
	err := s.PointRepo.DeletePoint(id)
	if err != nil {
		log.Printf("Ошибка при удалении точки: %v", err)
		return err
	}
	return nil
}
func (s *PointsService) UpdatePoint(point *models.Point) (*models.Point, error) {
	oldPoint, err := s.GetPoint(point.ID)
	point.Name = utils.FirstNonEmptyString(point.Name, oldPoint.Name)
	point.Location = utils.FirstNonEmptyString(point.Location, oldPoint.Location)
	updPoint, err := s.PointRepo.PatchPoint(point)
	if err != nil {
		log.Printf("Ошибка при обновлении точки: %v", err)
		return nil, err
	}
	return updPoint, nil
}
