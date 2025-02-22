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
		log.Printf("Get point error: %v", err)
		return nil, err
	}
	return point, err
}
func (s *PointsService) GetAllPoints() ([]*models.Point, error) {
	points, err := s.PointRepo.GetAllPoints()
	if err != nil {
		log.Printf("Get all points error: %v", err)
		return nil, err
	}
	return points, err
}

func (s *PointsService) CreatePoint(point *models.Point) (int, error) {
	id, err := s.PointRepo.CreatePoint(point)
	if err != nil {
		log.Printf("Create point error: %v", err)
	}
	return id, err
}
func (s *PointsService) DeletePoint(id int) error {
	err := s.PointRepo.DeletePoint(id)
	if err != nil {
		log.Printf("Delete point error: %v", err)
	}
	return err
}
func (s *PointsService) UpdatePoint(point *models.Point) (*models.Point, error) {
	oldPoint, err := s.GetPoint(point.ID)
	point.Name = utils.FirstNonEmptyString(point.Name, oldPoint.Name)
	point.Location = utils.FirstNonEmptyString(point.Location, oldPoint.Location)
	updPoint, err := s.PointRepo.PatchPoint(point)
	if err != nil {
		log.Printf("Update point error: %v", err)
		return nil, err
	}
	return updPoint, err
}
