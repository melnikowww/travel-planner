package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/backend/models"
)

type EquipRepository struct {
	DB *gorm.DB
}

func (r *EquipRepository) FindById(id int) (*models.Equipment, error) {
	var equip *models.Equipment
	err := r.DB.First(&equip, id)
	return equip, err.Error
}

func (r *EquipRepository) GetAllEquip() ([]*models.Equipment, error) {
	var equips []*models.Equipment
	err := r.DB.Find(&equips)
	if err != nil {
		return nil, err.Error
	}
	return equips, nil
}

func (r *EquipRepository) CreateEquip(equip *models.Equipment) (int, error) {
	err := r.DB.Create(&equip)
	if err != nil {
		return equip.ID, err.Error
	}
	return equip.ID, nil
}

func (r *EquipRepository) DeleteEquip(id int) error {
	return r.DB.Delete(&models.Equipment{}, id).Error
}

func (r *EquipRepository) PatchEquip(equip *models.Equipment) (*models.Equipment, error) {
	err := r.DB.Save(&equip)
	return equip, err.Error
}
