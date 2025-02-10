package repositories

import (
	"database/sql"
	"github.com/lib/pq"
	"log"
	"travelPlanner/internal/models"
)

type CrewRepository struct {
	DB *sql.DB
}

func (r *CrewRepository) FindByID(id int) (*models.Crew, error) {
	var crew models.Crew
	if err := r.DB.QueryRow("SELECT * FROM crews WHERE id = $1", id).Scan(&crew.ID, &crew.CarID,
		&crew.ExpeditionID, &crew.DriverID, pq.Array(&crew.EquipmentID), pq.Array(&crew.GoodID), pq.Array(&crew.MembersID)); err != nil {
		log.Printf("Find by id error: %v", err)
		return nil, err
	}
	return &crew, nil
}

func (r *CrewRepository) GetAllCrews() ([]*models.Crew, error) {
	var crews []*models.Crew
	rows, err := r.DB.Query("SELECT * FROM crews")
	if err != nil {
		log.Printf("Get all crews error: %v", err)
		return nil, err
	}
	for rows.Next() {
		crew := &models.Crew{}
		if err := rows.Scan(&crew.ID, &crew.CarID, &crew.ExpeditionID, &crew.DriverID, pq.Array(&crew.EquipmentID),
			pq.Array(&crew.GoodID), pq.Array(&crew.MembersID)); err != nil {
			log.Printf("Scan all crews error: %v", err)
			return nil, err
		}
		crews = append(crews, crew)
	}
	return crews, err
}

func (r *CrewRepository) CreateCrew(crew *models.Crew) int {
	var id int
	query := "INSERT INTO crews (car_id, expedition_id, driver_id, members_id, equipment_id, good_id) VALUES ($1, $2, $3, $4, $5, %6) RETURNING ID"
	if err := r.DB.QueryRow(query, &crew.CarID, &crew.ExpeditionID, &crew.DriverID, pq.Array(&crew.EquipmentID),
		pq.Array(&crew.GoodID), pq.Array(&crew.MembersID)).Scan(&id); err != nil {
		log.Printf("Insertion error: %v", err)
	}
	crew.ID = id
	return id
}

func (r *CrewRepository) UpdateCrew(crew *models.Crew) (*models.Crew, error) {
	if _, err := r.FindByID(crew.ID); err != nil {
		log.Printf("Crew not found: %v", err)
		return nil, err
	}
	query := "UPDATE crew SET car_id = $1, expedition_id = $2, driver_id = $3, members_id = $4, equipment_id = $5, good_id = $6"
	if _, err := r.DB.Exec(query, &crew.ExpeditionID, &crew.DriverID, pq.Array(&crew.EquipmentID), pq.Array(&crew.GoodID), pq.Array(&crew.MembersID)); err != nil {
		log.Printf("Update error: %v", err)
		return nil, err
	}
	return r.FindByID(crew.ID)
}

func (r *CrewRepository) DeleteCrew(id int) error {
	if _, err := r.FindByID(id); err != nil {
		log.Printf("Crew not found: %v", err)
		return err
	}
	if _, err := r.DB.Exec("DELETE FROM crews WHERE id = $1", id); err != nil {
		log.Printf("Delete error: %v", err)
	}
	return nil
}
