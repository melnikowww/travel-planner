package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/backend/models"
)

type PointsRepository struct {
	DB *gorm.DB
}

func (r *PointsRepository) FindById(id int) (*models.Point, error) {
	var point *models.Point
	err := r.DB.First(&point, id)
	return point, err.Error
}

func (r *PointsRepository) GetAllPoints() ([]*models.Point, error) {
	var points []*models.Point
	err := r.DB.Find(&points)
	return points, err.Error
}

func (r *PointsRepository) CreatePoint(point *models.Point) (int, error) {
	result := r.DB.Create(&point)
	return point.ID, result.Error
}

func (r *PointsRepository) DeletePoint(id int) error {
	return r.DB.Delete(&models.Point{}, id).Error
}

func (r *PointsRepository) PatchPoint(point *models.Point) (*models.Point, error) {
	err := r.DB.Save(&point)
	return point, err.Error
}
