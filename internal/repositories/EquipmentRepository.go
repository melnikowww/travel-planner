package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/internal/models"
)

type EquipRepository struct {
	DB *gorm.DB
}

func (r *EquipRepository) FindById(id int) (*models.Equipment, error) {
	var equip *models.Equipment
	err := r.DB.First(&equip, id)
	r.DB.First(&equip.Expedition, equip.ExpeditionID)
	return equip, err.Error
}

func (r *EquipRepository) GetAllEquip() ([]*models.Equipment, error) {
	var equips []*models.Equipment
	err := r.DB.Find(&equips)
	for _, equip := range equips {
		r.DB.First(&equip.Expedition, equip.ExpeditionID)
	}
	if err != nil {
		return nil, err.Error
	}
	return equips, nil
}

func (r *EquipRepository) CreateEquip(equip *models.Equipment) (int, error) {
	r.DB.First(&equip.Expedition, equip.ExpeditionID)
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
	r.DB.First(&equip.Expedition, equip.ExpeditionID)
	err := r.DB.Save(&equip)
	return equip, err.Error
}
