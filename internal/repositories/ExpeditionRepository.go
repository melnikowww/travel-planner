package repositories

import (
	"database/sql"
	"github.com/lib/pq"
	"log"
	"travelPlanner/internal/models"
)

type ExpeditionRepository struct {
	DB *sql.DB
}

func (r *ExpeditionRepository) FindById(id int) (*models.Expedition, error) {
	var exp models.Expedition
	if err := r.DB.QueryRow("SELECT * FROM expeditions WHERE id = $1", id).Scan(&exp.ID, &exp.Name,
		&exp.Description, pq.Array(&exp.PointsID), pq.Array(&exp.CrewID)); err != nil {
		log.Printf("Find by id error: %v", err)
		return nil, err
	}
	return &exp, nil
}

func (r *ExpeditionRepository) GetAllExpeditions() ([]*models.Expedition, error) {
	var exps []*models.Expedition
	rows, err := r.DB.Query("SELECT * FROM expeditions")
	if err != nil {
		log.Printf("Get all expeditions error: %v", err)
		return nil, err
	}
	for rows.Next() {
		exp := &models.Expedition{}
		if err := rows.Scan(&exp.ID, &exp.Name, &exp.Description, pq.Array(&exp.PointsID), pq.Array(&exp.CrewID)); err != nil {
			log.Printf("Scan all expeditions error: %v", err)
			return nil, err
		}
		exps = append(exps, exp)
	}
	return exps, err
}

func (r *ExpeditionRepository) CreateExpedition(exp *models.Expedition) int {
	var id int
	query := "INSERT INTO expeditions (name, description, points_id, crew_id) VALUES ($1, $2, $3, $4) RETURNING ID"
	if err := r.DB.QueryRow(query, &exp.Name, &exp.Description, pq.Array(exp.PointsID), pq.Array(exp.CrewID)).Scan(&id); err != nil {
		log.Printf("Insertion error: %v", err)
	}
	exp.ID = id
	return id
}

func (r *ExpeditionRepository) UpdateExpedition(exp *models.Expedition) (*models.Expedition, error) {
	if _, err := r.FindById(exp.ID); err != nil {
		log.Printf("Expedition not found: %v", err)
		return nil, err
	}
	query := "UPDATE expeditions SET name = $1, description = $2, points_id = $3, crew_id = $4"
	if _, err := r.DB.Exec(query, &exp.Name, &exp.Description, pq.Array(&exp.PointsID), pq.Array(exp.CrewID)); err != nil {
		log.Printf("Update error: %v", err)
		return nil, err
	}
	return r.FindById(exp.ID)
}

func (r *ExpeditionRepository) DeleteExpedition(id int) error {
	if _, err := r.FindById(id); err != nil {
		log.Printf("Expedition not found: %v", err)
		return err
	}
	if _, err := r.DB.Exec("DELETE FROM expeditions WHERE id = $1", id); err != nil {
		log.Printf("Delete error: %v", err)
	}
	return nil
}
