package services

import (
	"travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
)

type EquipmentService struct {
	EquipRepo *repositories.EquipRepository
}

func (s *EquipmentService) GetEquip(id int) (*models.Equipment, error) {
	return s.EquipRepo.FindById(id)
}
func (s *EquipmentService) GetAllEquips() ([]*models.Equipment, error) {
	return s.EquipRepo.GetAllEquip()
}
func (s *EquipmentService) CreateEquip(point *models.Equipment) int {
	// Нужно добавить проверку на существование экспедиции
	return s.EquipRepo.CreateEquip(point)
}
func (s *EquipmentService) DeleteEquip(id int) error {
	return s.EquipRepo.DeleteEquip(id)
}
func (s *EquipmentService) UpdateEquip(point *models.Equipment) (*models.Equipment, error) {
	return s.EquipRepo.PatchEquip(point)
}
