package services

import (
	"log"
	"travelPlanner/backend/models"
	"travelPlanner/backend/repositories"
	"travelPlanner/backend/utils"
)

type GoodsService struct {
	GoodsRepo *repositories.GoodsRepository
}

func (s *GoodsService) GetGood(id int) (*models.Good, error) {
	good, err := s.GoodsRepo.FindById(id)
	if err != nil {
		log.Printf("Get good error: %v", err)
		return nil, err
	}
	return good, nil
}
func (s *GoodsService) GetAllGoods() ([]*models.Good, error) {
	goods, err := s.GoodsRepo.GetAllGoods()
	if err != nil {
		log.Printf("Get all goods error: %v", err)
		return nil, err
	}
	return goods, nil
}
func (s *GoodsService) CreateGood(good *models.Good) (int, error) {
	id, err := s.GoodsRepo.CreateGood(good)
	if err != nil {
		log.Printf("Create good error: %v", err)
		return id, err
	}
	return id, nil
}
func (s *GoodsService) DeleteGood(id int) error {
	err := s.GoodsRepo.DeleteGood(id)
	if err != nil {
		log.Printf("Delete good error: %v", err)
	}
	return err
}
func (s *GoodsService) UpdateGood(good *models.Good) (*models.Good, error) {
	oldGood, err := s.GetGood(good.ID)
	good.Name = utils.FirstNonEmptyString(good.Name, oldGood.Name)
	good.CrewID = utils.FirstNonEmptyInt(good.CrewID, oldGood.CrewID)
	updGood, err := s.GoodsRepo.PatchGood(good)
	if err != nil {
		log.Printf("Update good error: %v", err)
		return nil, err
	}
	return updGood, err
}
