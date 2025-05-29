package services

import (
	"log"
	"travelPlanner/backend/models"
	"travelPlanner/backend/repositories"
)

type MessagesService struct {
	Repo *repositories.MessagesRepository
}

func (s *MessagesService) CreateMessage(msg *models.Message) (int, error) {
	id, err := s.Repo.CreateMessage(msg)
	if err != nil {
		log.Printf("Create message error: %v", err)
	}
	return id, err
}

func (s *MessagesService) GetMessageById(id int) (*models.Message, error) {
	msg, err := s.Repo.GetMessageById(id)
	if err != nil {
		log.Printf("Get message by id error: %v", err)
	}
	return msg, err
}

func (s *MessagesService) GetMessagesByConsumer(id int) ([]*models.Message, error) {
	msgs, err := s.Repo.GetMessagesByConsumer(id)
	if err != nil {
		log.Printf("Get message by consumer error: %v", err)
	}
	return msgs, err
}

func (s *MessagesService) GetMessagesByProducer(id int) ([]*models.Message, error) {
	msgs, err := s.Repo.GetMessagesByProducer(id)
	if err != nil {
		log.Printf("Get message by producer error: %v", err)
	}
	return msgs, err
}

func (s *MessagesService) GetMessagesLastTen() ([]*models.Message, error) {
	msgs, err := s.Repo.GetMessagesLastTen()
	if err != nil {
		log.Printf("Get messages error: %v", err)
	}
	return msgs, err
}

func (s *MessagesService) UpdateMessage(msg *models.Message) (*models.Message, error) {
	updMsg, err := s.Repo.UpdateMessage(msg)
	if err != nil {
		log.Printf("Update message error: %v", err)
	}
	return updMsg, err
}

func (s *MessagesService) DeleteMessage(id int) error {
	err := s.Repo.DeleteMessage(id)
	if err != nil {
		log.Printf("Delete message error: %v", err)
	}
	return err
}
