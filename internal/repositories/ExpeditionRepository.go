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
	err := r.DB.First(&exp, id)
	return &exp, err.Error
}

func (r *ExpeditionRepository) FindPointsByExpeditionId(id int) ([]*models.Point, error) {
	var points []*models.Point
	err := r.DB.Where("expedition_id = ?", id).Find(&points).Error
	return points, err
}

func (r *ExpeditionRepository) FindCrewsByExpeditionId(id int) ([]*models.Crew, error) {
	var crews []*models.Crew
	r.DB.Where("expedition_id = ?", id).Find(&crews)
	return crews, nil
}

func (r *ExpeditionRepository) GetAllExpeditions() ([]*models.Expedition, error) {
	var exps []*models.Expedition
	err := r.DB.Find(&exps)
	return exps, err.Error
}

func (r *ExpeditionRepository) CreateExpedition(exp *models.Expedition) (int, error) {
	//r.DB.Find(&exp.Points, exp.PointsID).Where("ExpeditionID = $1", exp.ID)
	err := r.DB.Create(exp)
	return exp.ID, err.Error
}

func (r *ExpeditionRepository) UpdateExpedition(exp *models.Expedition) (*models.Expedition, error) {
	//r.DB.Find(&exp.Points, exp.PointsID).Where("ExpeditionID = $1", exp.ID)
	err := r.DB.Save(exp)
	return exp, err.Error
}

func (r *ExpeditionRepository) DeleteExpedition(id int) error {
	return r.DB.Delete(&models.Expedition{}, id).Error
}
