package repositories

import (
	"gorm.io/gorm"
	"travelPlanner/backend/models"
)

type MessagesRepository struct {
	DB *gorm.DB
}

func (r *MessagesRepository) CreateMessage(message *models.Message) (int, error) {
	result := r.DB.Create(&message)
	return message.ID, result.Error
}

func (r *MessagesRepository) GetMessageById(id int) (*models.Message, error) {
	var message *models.Message
	err := r.DB.First(&message, id).Error
	return message, err
}

func (r *MessagesRepository) GetMessagesByConsumer(id int) ([]*models.Message, error) {
	var messages []*models.Message
	err := r.DB.Find(&messages, id).Order("consumerId").Error
	return messages, err
}

func (r *MessagesRepository) GetMessagesLastTen() ([]*models.Message, error) {
	var messages []*models.Message
	err := r.DB.Find(&messages).Order("consumerId").Limit(10).Error
	return messages, err
}

func (r *MessagesRepository) UpdateMessage(message *models.Message) (*models.Message, error) {
	err := r.DB.Save(&message).Error
	return message, err
}

func (r *MessagesRepository) DeleteMessage(id int) error {
	err := r.DB.Delete(&models.Message{}, id).Error
	return err
}
