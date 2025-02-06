package repositories

import (
	"database/sql"
	"log"
	"travelPlanner/internal/models"
)

type EquipRepository struct {
	DB *sql.DB
}

func (r *EquipRepository) FindById(id int) (*models.Equipment, error) {
	var equip models.Equipment
	err := r.DB.QueryRow("SELECT * FROM equipment WHERE ID = $1", id).Scan(&equip.ID, &equip.Name, &equip.ExpeditionID)
	if err != nil {
		log.Printf("Find by id error: %v", err)
		return nil, err
	}
	return &equip, nil
}

func (r *EquipRepository) GetAllEquip() ([]*models.Equipment, error) {
	var equips []*models.Equipment
	rows, err := r.DB.Query("SELECT * FROM equipment")
	if err != nil {
		log.Printf("Get all equipment error: %v", err)
		return nil, err
	}
	for rows.Next() {
		equip := &models.Equipment{}
		err := rows.Scan(&equip.ID, &equip.Name, &equip.ExpeditionID)
		if err != nil {
			log.Printf("Get all equip scan error: %v", err)
			return nil, err
		}
		equips = append(equips, equip)
	}
	return equips, nil
}

func (r *EquipRepository) CreateEquip(equip *models.Equipment) int {
	var id int
	err := r.DB.QueryRow("INSERT INTO equipment (name, expedition_id) VALUES ($1, $2) RETURNING ID",
		&equip.Name, &equip.ExpeditionID).Scan(&id)
	if err != nil {
		log.Printf("Insert equip error: %v", err)
		return -1
	}
	equip.ID = id
	return id
}

func (r *EquipRepository) DeleteEquip(id int) error {
	_, err := r.FindById(id)
	if err != nil {
		log.Printf("Delete by id find error: %v", err)
		return err
	}
	_, err = r.DB.Exec("DELETE FROM equipment WHERE id = $1", &id)
	if err != nil {
		log.Printf("Delete by id sql error: %v", err)
	}
	return nil
}

func (r *EquipRepository) PatchEquip(equip *models.Equipment) (*models.Equipment, error) {
	_, err := r.FindById(equip.ID)
	if err != nil {
		log.Printf("Patch find error: %v", err)
		return nil, err
	}
	_, err = r.DB.Exec("UPDATE equipment SET name = $1, expedition_id = $2 WHERE id = $3",
		&equip.Name, &equip.ExpeditionID, &equip.ID)
	return r.FindById(equip.ID)
}
