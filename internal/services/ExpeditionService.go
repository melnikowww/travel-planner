package services

import (
	"log"
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type ExpeditionService struct {
	ExpRepo *repositories.ExpeditionRepository
}

func (s *ExpeditionService) GetExpedition(id int) (*models.Expedition, error) {
	var expedition *models.Expedition
	expedition, err := s.ExpRepo.FindById(id)
	if err != nil {
		log.Printf("Get expedition error: %v", err)
	}
	return expedition, err
}

func (s *ExpeditionService) GetAllExpeditions() ([]*models.Expedition, error) {
	var expeditions []*models.Expedition
	expeditions, err := s.ExpRepo.GetAllExpeditions()
	if err != nil {
		log.Printf("Get all expeditions error: %v", err)
		return nil, err
	}
	return expeditions, err
}

func (s *ExpeditionService) CreateExpedition(expedition *models.Expedition) (int, error) {
	id, err := s.ExpRepo.CreateExpedition(expedition)
	if err != nil {
		log.Printf("Create expedition error: %v", err)
		return 0, err
	}
	return id, err
}

func (s *ExpeditionService) UpdateExpedition(expedition *models.Expedition) (*models.Expedition, error) {
	oldExpedition, err := s.GetExpedition(expedition.ID)
	if err != nil {
		log.Printf("Get expedition while update error: %v", err)
		return nil, err
	}
	expedition.Name = utils.FirstNonEmptyString(expedition.Name, oldExpedition.Name)
	expedition.Description = utils.FirstNonEmptyString(expedition.Description, oldExpedition.Description)
	exp, err := s.ExpRepo.UpdateExpedition(expedition)
	if err != nil {
		log.Printf("Update expedition error: %v", err)
		return nil, err
	}
	return exp, err
}
func (s *ExpeditionService) DeleteExpedition(id int) error {
	err := s.ExpRepo.DeleteExpedition(id)
	if err != nil {
		log.Printf("Delete expedition error: %v", err)
	}
	return err
}
