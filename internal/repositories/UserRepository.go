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
	result, err := repo.DB.Exec("INSERT INTO persons (name, email) VALUES ($1, $2)", person.Name, person.Email)
	if err != nil {
		log.Fatalf("Database error: %v", err)
	}
	id, _ := result.LastInsertId()
	person.ID = int(id)
	return person.ID
}
