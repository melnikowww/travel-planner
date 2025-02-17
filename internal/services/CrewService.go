package services

import (
	"log"
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type CrewService struct {
	CrewRepo *repositories.CrewRepository
}

func (s *CrewService) Create(crew *models.Crew) (int, error) {
	return s.CrewRepo.CreateCrew(crew)
}

func (s *CrewService) Update(crew *models.Crew) (*models.Crew, error) {
	oldCrew, err := s.CrewRepo.FindByID(crew.ID)
	if err != nil {
		return nil, err
	}
	crew.ExpeditionID = utils.FirstNonEmptyInt(crew.ExpeditionID, oldCrew.ExpeditionID)
	crew.DriverID = utils.FirstNonEmptyInt(crew.DriverID, oldCrew.DriverID)
	crew.CarID = utils.FirstNonEmptyInt(crew.CarID, oldCrew.CarID)
	return s.CrewRepo.UpdateCrew(crew)
}

func (s *CrewService) Delete(id int) error {
	return s.CrewRepo.DeleteCrew(id)
}

func (s *CrewService) GetCrew(id int) (*models.Crew, error) {
	crew, err := s.CrewRepo.FindByID(id)
	if err != nil {
		log.Printf("Ошибка при извлечении пользователя: %v", err)
		return nil, err
	}
	return crew, nil
}

func (s *CrewService) GetAllCrews() ([]*models.Crew, error) {
	crews, err := s.CrewRepo.GetAllCrews()
	if err != nil {
		log.Printf("Ошибка при получении списка экипажей: %v", err)
	}
	return crews, nil
}
