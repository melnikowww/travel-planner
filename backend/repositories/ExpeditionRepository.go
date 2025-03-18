package repositories

import (
	"fmt"
	"gorm.io/gorm"
	"time"
	"travelPlanner/backend/models"
)

type ExpeditionRepository struct {
	DB *gorm.DB
}

func (r *ExpeditionRepository) FindById(id int) (*models.Expedition, error) {
	var exp models.Expedition
	err := r.DB.Preload("Points").Preload("Crews").First(&exp, id)
	return &exp, err.Error
}

func (r *ExpeditionRepository) GetDrivers(id int) ([]*models.User, error) {
	var drivers []*models.User
	query := `
        SELECT u.* 
        FROM users u
        JOIN crews c ON u.id = c.driver_id
        WHERE c.expedition_id = ?`

	if err := r.DB.Raw(query, id).Scan(&drivers).Error; err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}

	if len(drivers) > 0 {
		driverIDs := make([]int, len(drivers))
		for i, d := range drivers {
			driverIDs[i] = d.ID
		}

		if err := r.DB.Preload("Crews").Preload("Cars").
			Find(&drivers, "id IN (?)", driverIDs).Error; err != nil {
			return nil, fmt.Errorf("preload failed: %v", err)
		}
	}

	return drivers, nil
}

func (r *ExpeditionRepository) GetAllFutureExpeditions() ([]*models.Expedition, error) {
	var exps []*models.Expedition
	err := r.DB.
		Preload("Points").
		Preload("Crews").
		Order("starts_at ASC").
		Where("starts_at > ?", time.Now()).
		Find(&exps)
	return exps, err.Error
}

func (r *ExpeditionRepository) GetArchiveExpeditions() ([]*models.Expedition, error) {
	var exps []*models.Expedition
	err := r.DB.
		Preload("Points").
		Preload("Crews").
		Order("starts_at ASC").
		Where("ends_at < ?", time.Now()).
		Find(&exps)
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
