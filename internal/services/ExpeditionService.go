package services

import (
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type ExpeditionService struct {
	ExpRepo *repositories.ExpeditionRepository
}

func (s *ExpeditionService) GetExpedition(id int) (*models.Expedition, error) {
	return s.ExpRepo.FindById(id)
}

func (s *ExpeditionService) GetAllExpeditions() ([]*models.Expedition, error) {
	return s.ExpRepo.GetAllExpeditions()
}

func (s *ExpeditionService) CreateExpedition(expedition *models.Expedition) int {
	//Проверка на существование вложенных сущностей
	return s.ExpRepo.CreateExpedition(expedition)
}

func (s *ExpeditionService) UpdateExpedition(expedition *models.Expedition) (*models.Expedition, error) {
	//Проверка на существование вложенных сущностей
	oldExpedition, err := s.GetExpedition(expedition.ID)
	if err != nil {
		return nil, err
	}
	expedition.Name = utils.FirstNonEmptyString(expedition.Name, oldExpedition.Name)
	expedition.Description = utils.FirstNonEmptyString(expedition.Description, oldExpedition.Description)
	expedition.PointsID = utils.FirstNonEmptySlice(expedition.PointsID, oldExpedition.PointsID)
	expedition.CrewID = utils.FirstNonEmptySlice(expedition.CrewID, oldExpedition.CrewID)
	return s.ExpRepo.UpdateExpedition(expedition)
}
func (s *ExpeditionService) DeleteExpedition(id int) error {
	return s.ExpRepo.DeleteExpedition(id)
}
