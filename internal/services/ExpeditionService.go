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
		log.Printf("Ошибка при получении записи об экспедиции: %v", err)
	}
	points, err := s.ExpRepo.FindPointsByExpeditionId(expedition.ID)
	for _, point := range points {
		expedition.Points = append(expedition.Points, *point)
	}
	crews, err := s.ExpRepo.FindCrewsByExpeditionId(expedition.ID)
	for _, crew := range crews {

		expedition.Crews = append(expedition.Crews, *crew)
	}
	return expedition, err
}

func (s *ExpeditionService) GetAllExpeditions() ([]*models.Expedition, error) {
	var expeditions []*models.Expedition
	expeditions, err := s.ExpRepo.GetAllExpeditions()
	for _, expedition := range expeditions {
		points, _ := s.ExpRepo.FindPointsByExpeditionId(expedition.ID)
		for _, point := range points {
			expedition.Points = append(expedition.Points, *point)
		}
	}
	return expeditions, err
}

func (s *ExpeditionService) CreateExpedition(expedition *models.Expedition) (int, error) {
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
	return s.ExpRepo.UpdateExpedition(expedition)
}
func (s *ExpeditionService) DeleteExpedition(id int) error {
	return s.ExpRepo.DeleteExpedition(id)
}
