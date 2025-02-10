package services

import (
	"log"
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type GoodsService struct {
	GoodsRepo *repositories.GoodsRepository
}

func (s *GoodsService) GetGood(id int) (*models.Good, error) {
	good, err := s.GoodsRepo.FindById(id)
	if err != nil {
		log.Printf("Ошибка при получении записи продукта: %v", err)
		return nil, err
	}
	return good, nil
}
func (s *GoodsService) GetAllGoods() ([]*models.Good, error) {
	goods, err := s.GoodsRepo.GetAllGoods()
	if err != nil {
		log.Printf("Ошибка при получении списка продуктов: %v", err)
		return nil, err
	}
	return goods, nil
}
func (s *GoodsService) CreateGood(good *models.Good) (int, error) {
	id, err := s.GoodsRepo.CreateGood(good)
	if err != nil {
		log.Printf("Ошибка при создании продукта: %v", err)
		return id, err
	}
	return id, nil
}
func (s *GoodsService) DeleteGood(id int) error {
	err := s.GoodsRepo.DeleteGood(id)
	if err != nil {
		log.Printf("Ошибка при удалении продукта: %v", err)
		return err
	}
	return nil
}
func (s *GoodsService) UpdateGood(good *models.Good) (*models.Good, error) {
	oldGood, err := s.GetGood(good.ID)
	good.Name = utils.FirstNonEmptyString(good.Name, oldGood.Name)
	good.ExpeditionID = utils.FirstNonEmptyInt(good.ExpeditionID, oldGood.ExpeditionID)
	updGood, err := s.GoodsRepo.PatchGood(good)
	if err != nil {
		log.Printf("Ошибка при обновлении продукта: %v", err)
		return nil, err
	}
	return updGood, nil
}
