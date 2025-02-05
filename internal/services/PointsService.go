package services

import (
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
)

type PointsService struct {
	PointRepo *repositories.PointsRepository
}

func (s *PointsService) GetPoint(id int) (*models.Point, error) {
	return s.PointRepo.FindById(id)
}
func (s *PointsService) GetAllPoints() ([]*models.Point, error) {
	return s.PointRepo.GetAllPoints()
}
func (s *PointsService) CreatePoint(point *models.Point) int {
	return s.PointRepo.CreatePoint(point)
}
func (s *PointsService) DeletePoint(id int) error {
	return s.PointRepo.DeletePoint(id)
}
func (s PointsService) UpdatePoint(point *models.Point) (*models.Point, error) {
	return s.PointRepo.PatchPoint(point)
}
