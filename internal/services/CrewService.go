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
	id, err := s.CrewRepo.CreateCrew(crew)
	if err != nil {
		log.Printf("Ошибка при создании экипажа: %v", err)
		return 0, err
	}
	return id, err
}

func (s *CrewService) Update(crew *models.Crew) (*models.Crew, error) {
	oldCrew, err := s.CrewRepo.FindByID(crew.ID)
	if err != nil {
		log.Printf("Crew select error: %v", err)
		return nil, err
	}
	crew.ExpeditionID = utils.FirstNonEmptyInt(crew.ExpeditionID, oldCrew.ExpeditionID)
	crew.DriverID = utils.FirstNonEmptyInt(crew.DriverID, oldCrew.DriverID)
	crew.CarID = utils.FirstNonEmptyInt(crew.CarID, oldCrew.CarID)
	crew, err = s.CrewRepo.UpdateCrew(crew)
	if err != nil {
		log.Printf("Crew update error: %v", err)
		return nil, err
	}
	return crew, err
}

func (s *CrewService) Delete(id int) error {
	err := s.CrewRepo.DeleteCrew(id)
	if err != nil {
		log.Printf("Crew delete error: %v", err)
	}
	return err
}

func (s *CrewService) GetCrew(id int) (*models.Crew, error) {
	crew, err := s.CrewRepo.FindByID(id)
	if err != nil {
		log.Printf("Get crew error: %v", err)
		return nil, err
	}
	return crew, err
}

func (s *CrewService) GetAllCrews() ([]*models.Crew, error) {
	crews, err := s.CrewRepo.GetAllCrews()
	if err != nil {
		log.Printf("Get all crews error: %v", err)
	}
	return crews, err
}
