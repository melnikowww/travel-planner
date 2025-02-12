package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/internal/models"
)

type GoodsRepository struct {
	DB *gorm.DB
}

func (r *GoodsRepository) FindById(id int) (*models.Good, error) {
	var good models.Good
	err := r.DB.First(&good, id)
	return &good, err.Error
}

func (r *GoodsRepository) GetAllGoods() ([]*models.Good, error) {
	var goods []*models.Good
	err := r.DB.Find(&goods)
	return goods, err.Error
}

func (r *GoodsRepository) CreateGood(good *models.Good) (int, error) {
	result := r.DB.Create(&good)
	return good.ID, result.Error
}

func (r *GoodsRepository) DeleteGood(id int) error {
	return r.DB.Delete(&models.Good{}, id).Error
}

func (r *GoodsRepository) PatchGood(good *models.Good) (*models.Good, error) {
	err := r.DB.Save(&good)
	return good, err.Error
}
