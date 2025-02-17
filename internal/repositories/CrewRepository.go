package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/internal/models"
)

type CrewRepository struct {
	DB *gorm.DB
}

func (r *CrewRepository) FindByID(id int) (*models.Crew, error) {
	var crew *models.Crew
	err := r.DB.Preload("Members").Preload("Goods").Preload("Equipment").First(&crew, id)
	return crew, err.Error
}

func (r *CrewRepository) GetAllCrews() ([]*models.Crew, error) {
	var crews []*models.Crew
	err := r.DB.Find(&crews)
	return crews, err.Error
}

func (r *CrewRepository) CreateCrew(crew *models.Crew) (int, error) {
	err := r.DB.Create(&crew)
	return crew.ID, err.Error
}

func (r *CrewRepository) UpdateCrew(crew *models.Crew) (*models.Crew, error) {
	err := r.DB.Save(&crew)
	return crew, err.Error
}

func (r *CrewRepository) DeleteCrew(id int) error {
	return r.DB.Delete(&models.Crew{}, id).Error
}
