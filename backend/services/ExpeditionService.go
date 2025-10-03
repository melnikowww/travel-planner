package services

import (
	"errors"
	"log"
	"travelPlanner/backend/models"
	"travelPlanner/backend/repositories"
	"travelPlanner/backend/utils"
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
	expeditions, err := s.ExpRepo.GetAllFutureExpeditions()
	if err != nil {
		log.Printf("Get all expeditions error: %v", err)
		return nil, err
	}
	return expeditions, err
}

func (s *ExpeditionService) GetDrivers(id int) ([]*models.User, error) {
	drivers, err := s.ExpRepo.GetDrivers(id)
	if err != nil {
		log.Printf("Get drivers in expedition error: %v", err)
		return nil, err
	}
	return drivers, err
}

func (s *ExpeditionService) CreateExpedition(expedition *models.Expedition) (int, error) {
	id, err := s.ExpRepo.CreateExpedition(expedition)
	if err != nil {
		log.Printf("Create expedition error: %v", err)
		return 0, err
	}
	return id, err
}

func (s *ExpeditionService) UpdateExpedition(expedition *models.Expedition, userId int) (*models.Expedition, error) {
	oldExpedition, err := s.GetExpedition(expedition.ID)
	if err != nil {
		log.Printf("Get expedition while update error: %v", err)
		return nil, err
	}
	if oldExpedition.CreatorID == userId {
		expedition.Name = utils.FirstNonEmptyString(expedition.Name, oldExpedition.Name)
		expedition.Description = utils.FirstNonEmptyString(expedition.Description, oldExpedition.Description)
		expedition.CreatorID = utils.FirstNonEmptyInt(expedition.CreatorID, oldExpedition.CreatorID)
		exp, err := s.ExpRepo.UpdateExpedition(expedition)
		if err != nil {
			log.Printf("Update expedition error: %v", err)
			return nil, err
		}
		return exp, err
	}
	return nil, errors.New("you are not expeditions creator")
}

func (s *ExpeditionService) DeleteExpedition(id int, userId int) error {
	expedition, err := s.GetExpedition(id)
	if err != nil {
		log.Printf("Expedition not found")
		return err
	}
	if expedition.CreatorID == userId {
		err = s.ExpRepo.DeleteExpedition(id)
		if err != nil {
			log.Printf("Delete expedition error: %v", err)
		}
		return err
	}
	return errors.New("you are not expeditions owner")
}
