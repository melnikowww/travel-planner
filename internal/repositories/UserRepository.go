package repositories

import (
	"database/sql"
	"log"
	"travelPlanner/internal/models"
)

type UserRepository struct {
	DB *sql.DB
}

func (repo *UserRepository) FindById(id int) (*models.User, error) {
	var person models.User
	err := repo.DB.QueryRow(
		"SELECT * FROM persons WHERE id = $1",
		id,
	).Scan(&person.ID, &person.Name, &person.Email)
	if err != nil {
		return nil, err
	}
	return &person, nil
}

func (repo *UserRepository) CreateUser(person *models.User) int {
	var id int
	err := repo.DB.QueryRow("INSERT INTO persons (name, email) VALUES ($1, $2) RETURNING id", person.Name, person.Email).Scan(&id)
	if err != nil {
		log.Printf("Database error: %v", err)
		return -1 // или другое значение, указывающее на ошибку
	}
	log.Printf("ID: %v", id)
	person.ID = id
	return id
}
