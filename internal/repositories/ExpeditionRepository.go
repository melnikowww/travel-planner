package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/internal/models"
)

type ExpeditionRepository struct {
	DB *gorm.DB
}

func (r *ExpeditionRepository) FindById(id int) (*models.Expedition, error) {
	var exp models.Expedition
	err := r.DB.Preload("Points").Preload("Crews").First(&exp, id)
	return &exp, err.Error
}

func (r *ExpeditionRepository) GetAllExpeditions() ([]*models.Expedition, error) {
	var exps []*models.Expedition
	err := r.DB.Find(&exps)
	return exps, err.Error
}

func (r *ExpeditionRepository) CreateExpedition(exp *models.Expedition) (int, error) {
	err := r.DB.Create(exp)
	return exp.ID, err.Error
}

func (r *ExpeditionRepository) UpdateExpedition(exp *models.Expedition) (*models.Expedition, error) {
	err := r.DB.Save(exp)
	return exp, err.Error
}

func (r *ExpeditionRepository) DeleteExpedition(id int) error {
	return r.DB.Delete(&models.Expedition{}, id).Error
}
