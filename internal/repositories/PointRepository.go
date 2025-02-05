package repositories

import (
	"database/sql"
	"log"
	"travelPlanner/internal/models"
)

type PointsRepository struct {
	DB *sql.DB
}

func (r *PointsRepository) FindById(id int) (*models.Point, error) {
	var point models.Point
	err := r.DB.QueryRow("SELECT * FROM points WHERE ID = $1", id).Scan(&point.ID, &point.Name, &point.Location)
	if err != nil {
		log.Printf("Find by id error: %v", err)
		return nil, err
	}
	return &point, nil
}

func (r *PointsRepository) GetAllPoints() ([]*models.Point, error) {
	var points []*models.Point
	rows, err := r.DB.Query("SELECT * FROM points")
	if err != nil {
		log.Printf("Get all points error: %v", err)
		return nil, err
	}
	for rows.Next() {
		point := &models.Point{}
		err := rows.Scan(&point.ID, &point.Name, &point.Location)
		if err != nil {
			log.Printf("Get all points scan error: %v", err)
			return nil, err
		}
		points = append(points, point)
	}
	return points, nil
}

func (r *PointsRepository) CreatePoint(point *models.Point) int {
	var id int
	err := r.DB.QueryRow("INSERT INTO points (name, location) VALUES ($1, $2) RETURNING ID",
		&point.Name, &point.Location).Scan(&id)
	if err != nil {
		log.Printf("Insert point error: %v", err)
		return -1
	}
	point.ID = id
	return id
}

func (r *PointsRepository) DeletePoint(id int) error {
	_, err := r.FindById(id)
	if err != nil {
		log.Printf("Delete by id find error: %v", err)
		return err
	}
	_, err = r.DB.Exec("DELETE FROM points WHERE id = $1", &id)
	if err != nil {
		log.Printf("Delete by id sql error: %v", err)
	}
	return nil
}

func (r *PointsRepository) PatchPoint(point *models.Point) (*models.Point, error) {
	_, err := r.FindById(point.ID)
	if err != nil {
		log.Printf("Patch find error: %v", err)
		return nil, err
	}
	_, err = r.DB.Exec("UPDATE points SET name = $1, location = $2 WHERE id = $3",
		&point.Name, &point.Location, &point.ID)
	return r.FindById(point.ID)
}
