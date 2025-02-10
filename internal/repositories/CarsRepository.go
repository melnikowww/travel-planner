package repositories

import (
	"database/sql"
	"log"
	"travelPlanner/internal/models"
)

type CarsRepository struct {
	DB *sql.DB
}

func (r *CarsRepository) GetAllCars() ([]*models.Car, error) {
	var cars []*models.Car
	rows, err := r.DB.Query("SELECT * FROM cars")
	if err != nil {
		log.Printf("Get all cars error: %v", err)
		return nil, err
	}
	for rows.Next() {
		car := models.Car{}
		if err := rows.Scan(&car.ID, &car.Name, &car.OwnerID); err != nil {
			log.Printf("Scanning entity error: %v", err)
			return nil, err
		}
		cars = append(cars, &car)
	}
	return cars, nil
}

func (r *CarsRepository) GetCar(id int) (*models.Car, error) {
	var car models.Car
	if err := r.DB.QueryRow("SELECT * FROM cars WHERE ID = $1", id).Scan(&car.ID, &car.Name, &car.OwnerID); err != nil {
		log.Printf("Get car error: %v", err)
		return nil, err
	}
	return &car, nil
}

func (r *CarsRepository) CreateCar(car *models.Car) int {
	var id int
	if err := r.DB.QueryRow("INSERT INTO cars (name, owner_id) VALUES ($1, $2) RETURNING ID", &car.Name, &car.OwnerID).Scan(&id); err != nil {
		log.Printf("Insertion error: %v", err)
		return -1
	}
	car.ID = id
	return id
}

func (r *CarsRepository) UpdateCar(car *models.Car) (*models.Car, error) {
	if _, err := r.GetCar(car.ID); err != nil {
		log.Printf("Object does not exist: %v", err)
		return nil, err
	}
	if _, err := r.DB.Exec("UPDATE cars SET name = $1, owner_id = $2 WHERE id = $3",
		&car.Name, &car.OwnerID, &car.ID); err != nil {
		log.Printf("Update error: %v", err)
		return nil, err
	}
	return r.GetCar(car.ID)
}

func (r *CarsRepository) DeleteCar(id int) error {
	if _, err := r.GetCar(id); err != nil {
		log.Printf("Object does not exist: %v", err)
		return err
	}
	if _, err := r.DB.Exec("DELETE FROM cars WHERE id = $1", &id); err != nil {
		log.Printf("Delete error: %v", err)
		return err
	}
	return nil
}
