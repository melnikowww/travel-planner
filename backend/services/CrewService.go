package services

import (
	"errors"
	"log"
	"travelPlanner/backend/models"
	"travelPlanner/backend/repositories"
	"travelPlanner/backend/utils"
)

type CrewService struct {
	CrewRepo *repositories.CrewRepository
}

func (s *CrewService) Create(crew *models.Crew) (int, error) {
	var user models.User
	err := s.CrewRepo.DB.First(&user, crew.DriverID).Error
	if err != nil {
		log.Printf("User not found")
		return 0, err
	}
	crew.Members = append(crew.Members, user)
	id, err := s.CrewRepo.CreateCrew(crew)
	if err != nil {
		log.Printf("Crew creation error: %v", err)
		return 0, err
	}
	return id, err
}

func (s *CrewService) FindByDriverAndExpedition(driverId int, expeditionId int) (*models.Crew, error) {
	crew, err := s.CrewRepo.FindByDriverAndExpedition(driverId, expeditionId)
	if err != nil {
		log.Printf("Crew by driver and expedition search error: %v", err)
		return nil, err
	}
	return crew, err
}

func (s *CrewService) Update(crew *models.Crew, userId int) (*models.Crew, error) {
	oldCrew, err := s.CrewRepo.FindByID(crew.ID)
	if err != nil {
		log.Printf("Crew select error: %v", err)
		return nil, err
	}
	if oldCrew.DriverID == userId {
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
	return nil, errors.New("you are not crews owner")
}

func (s *CrewService) Delete(id int, userId int) error {
	crew, err := s.GetCrew(id)
	if err != nil {
		log.Printf("Crew for delete not found: %v", err)
		return err
	}
	if crew.DriverID == userId {
		err = s.CrewRepo.DeleteCrew(id)
		if err != nil {
			log.Printf("Crew delete error: %v", err)
		}
		return err
	}
	return errors.New("you are not crews owner")
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
