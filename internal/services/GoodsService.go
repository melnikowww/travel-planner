package services

import (
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
)

type GoodsService struct {
	GoodsRepo *repositories.GoodsRepository
}

func (s *GoodsService) GetGood(id int) (*models.Good, error) {
	return s.GoodsRepo.FindById(id)
}
func (s *GoodsService) GetAllGoods() ([]*models.Good, error) {
	return s.GoodsRepo.GetAllGoods()
}
func (s *GoodsService) CreateGood(point *models.Good) int {
	// Нужно добавить проверку на существование экспедиции
	return s.GoodsRepo.CreateGood(point)
}
func (s *GoodsService) DeleteGood(id int) error {
	return s.GoodsRepo.DeleteGood(id)
}
func (s *GoodsService) UpdateGood(point *models.Good) (*models.Good, error) {
	return s.GoodsRepo.PatchGood(point)
}
