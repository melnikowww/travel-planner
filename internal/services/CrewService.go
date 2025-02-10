package services

import (
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type CrewService struct {
	CrewRepo *repositories.CrewRepository
}

func (s *CrewService) Create(crew *models.Crew) int {
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
	crew.EquipmentID = utils.FirstNonEmptySlice(crew.EquipmentID, oldCrew.EquipmentID)
	crew.GoodID = utils.FirstNonEmptySlice(crew.GoodID, oldCrew.GoodID)
	crew.MembersID = utils.FirstNonEmptySlice(crew.MembersID, oldCrew.MembersID)

	return s.CrewRepo.UpdateCrew(crew)
}

func (s *CrewService) Delete(id int) error {
	return s.CrewRepo.DeleteCrew(id)
}

func (s *CrewService) GetCrew(id int) (*models.Crew, error) {
	return s.CrewRepo.FindByID(id)
}

func (s *CrewService) GetAllCrews() ([]*models.Crew, error) {
	return s.CrewRepo.GetAllCrews()
}
