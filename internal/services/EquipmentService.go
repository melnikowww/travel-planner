package services

import (
	"log"
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/utils"
)

type EquipmentService struct {
	EquipRepo *repositories.EquipRepository
}

func (s *EquipmentService) GetEquip(id int) (*models.Equipment, error) {
	equip, err := s.EquipRepo.FindById(id)
	if err != nil {
		log.Printf("Ошибка при получении снаряжения: %v", err)
		return nil, err
	}
	return equip, nil
}
func (s *EquipmentService) GetAllEquips() ([]*models.Equipment, error) {
	equips, err := s.EquipRepo.GetAllEquip()
	if err != nil {
		log.Printf("Ошибка при получении списка снаряжения: %v", err)
		return nil, err
	}
	return equips, nil
}
func (s *EquipmentService) CreateEquip(equipment *models.Equipment) (int, error) {
	id, err := s.EquipRepo.CreateEquip(equipment)
	if err != nil {
		log.Printf("Ошибка при создании снаряжения: %v", err)
		return id, err
	}
	return id, err
}
func (s *EquipmentService) DeleteEquip(id int) error {
	err := s.EquipRepo.DeleteEquip(id)
	if err != nil {
		log.Printf("Ошибка при удалении снаряжения: %v", err)
		return err
	}
	return nil
}
func (s *EquipmentService) UpdateEquip(equipment *models.Equipment) (*models.Equipment, error) {
	oldEquip, err := s.GetEquip(equipment.ID)
	equipment.Name = utils.FirstNonEmptyString(equipment.Name, oldEquip.Name)
	equipment.ExpeditionID = utils.FirstNonEmptyInt(equipment.ExpeditionID, oldEquip.ExpeditionID)
	updEquip, err := s.EquipRepo.PatchEquip(equipment)
	if err != nil {
		log.Printf("Ошибка при обновлении снаряжения: %v", err)
		return nil, err
	}
	return updEquip, nil
}
