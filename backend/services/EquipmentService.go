package services

import (
	"log"
	"travelPlanner/backend/models"
	"travelPlanner/backend/repositories"
	"travelPlanner/backend/utils"
)

type EquipmentService struct {
	EquipRepo *repositories.EquipRepository
}

func (s *EquipmentService) GetEquip(id int) (*models.Equipment, error) {
	equip, err := s.EquipRepo.FindById(id)
	if err != nil {
		log.Printf("Get equipment error: %v", err)
		return nil, err
	}
	return equip, err
}
func (s *EquipmentService) GetAllEquips() ([]*models.Equipment, error) {
	equips, err := s.EquipRepo.GetAllEquip()
	if err != nil {
		log.Printf("Get all equipment error: %v", err)
		return nil, err
	}
	return equips, err
}
func (s *EquipmentService) CreateEquip(equipment *models.Equipment) (int, error) {
	id, err := s.EquipRepo.CreateEquip(equipment)
	if err != nil {
		log.Printf("Create equipment error: %v", err)
		return id, err
	}
	return id, err
}
func (s *EquipmentService) DeleteEquip(id int) error {
	err := s.EquipRepo.DeleteEquip(id)
	if err != nil {
		log.Printf("Delete equipment error: %v", err)
	}
	return err
}
func (s *EquipmentService) UpdateEquip(equipment *models.Equipment) (*models.Equipment, error) {
	oldEquip, err := s.GetEquip(equipment.ID)
	equipment.Name = utils.FirstNonEmptyString(equipment.Name, oldEquip.Name)
	equipment.CrewID = utils.FirstNonEmptyIntPointer(equipment.CrewID, oldEquip.CrewID)
	updEquip, err := s.EquipRepo.PatchEquip(equipment)
	if err != nil {
		log.Printf("Update equipment error: %v", err)
		return nil, err
	}
	return updEquip, err
}

func (s *EquipmentService) GetNotOwned(expeditionId int) ([]*models.Equipment, error) {
	equipment, err := s.EquipRepo.GetNotOwned(expeditionId)
	if err != nil {
		log.Printf("Expedition equipment get error : %v", err)
		return nil, err
	}
	return equipment, err
}
