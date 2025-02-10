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
	).Scan(&person.ID, &person.Name, &person.Email, &person.Password)
	if err != nil {
		return nil, err
	}
	return &person, nil
}

func (repo *UserRepository) FindByEmail(email string) (*models.User, error) {
	var person models.User
	err := repo.DB.QueryRow(
		"SELECT * FROM persons WHERE email = $1",
		&email,
	).Scan(&person.ID, &person.Name, &person.Email, &person.Password)
	if err != nil {
		return nil, err
	}
	return &person, nil
}

func (repo *UserRepository) GetAllUsers() ([]*models.User, error) {
	var users []*models.User
	rows, err := repo.DB.Query("SELECT * FROM persons")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		user := &models.User{}
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Password)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (repo *UserRepository) CreateUser(person *models.User) int {
	var id int
	err := repo.DB.QueryRow("INSERT INTO persons (name, email, password) VALUES ($1, $2, $3) RETURNING id",
		person.Name, person.Email, person.Password).Scan(&id)
	if err != nil {
		log.Printf("Database error: %v", err)
		return -1
	}
	person.ID = id
	return id
}

func (repo *UserRepository) DeleteUser(id int) error {
	_, err := repo.FindById(id)
	if err != nil {
		return err
	}
	_, err = repo.DB.Exec("DELETE FROM persons WHERE ID = $1;", id)
	return nil
}

func (repo *UserRepository) UpdateUser(user *models.User) (*models.User, error) {
	_, err := repo.FindById(user.ID)
	if err != nil {
		return nil, err
	}
	_, err = repo.DB.Exec("UPDATE persons SET name = $1, email = $2, password = $3 WHERE id = $4;",
		user.Name, user.Email, user.Password, user.ID)
	return repo.FindByEmail(user.Email)
}
