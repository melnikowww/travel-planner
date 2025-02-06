package repositories

import (
	"database/sql"
	"log"
	"travelPlanner/internal/models"
)

type GoodsRepository struct {
	DB *sql.DB
}

func (r *GoodsRepository) FindById(id int) (*models.Good, error) {
	var good models.Good
	err := r.DB.QueryRow("SELECT * FROM goods WHERE ID = $1", id).Scan(&good.ID, &good.Name, &good.ExpeditionID)
	if err != nil {
		log.Printf("Find by id error: %v", err)
		return nil, err
	}
	return &good, nil
}

func (r *GoodsRepository) GetAllGoods() ([]*models.Good, error) {
	var goods []*models.Good
	rows, err := r.DB.Query("SELECT * FROM goods")
	if err != nil {
		log.Printf("Get all goods error: %v", err)
		return nil, err
	}
	for rows.Next() {
		good := &models.Good{}
		err := rows.Scan(&good.ID, &good.Name, &good.ExpeditionID)
		if err != nil {
			log.Printf("Get all goods scan error: %v", err)
			return nil, err
		}
		goods = append(goods, good)
	}
	return goods, nil
}

func (r *GoodsRepository) CreateGood(good *models.Good) int {
	var id int
	err := r.DB.QueryRow("INSERT INTO goods (name, expedition_id) VALUES ($1, $2) RETURNING ID",
		&good.Name, &good.ExpeditionID).Scan(&id)
	if err != nil {
		log.Printf("Insert good error: %v", err)
		return -1
	}
	good.ID = id
	return id
}

func (r *GoodsRepository) DeleteGood(id int) error {
	_, err := r.FindById(id)
	if err != nil {
		log.Printf("Delete by id find error: %v", err)
		return err
	}
	_, err = r.DB.Exec("DELETE FROM goods WHERE id = $1", &id)
	if err != nil {
		log.Printf("Delete by id sql error: %v", err)
	}
	return nil
}

func (r *GoodsRepository) PatchGood(good *models.Good) (*models.Good, error) {
	_, err := r.FindById(good.ID)
	if err != nil {
		log.Printf("Patch find error: %v", err)
		return nil, err
	}
	_, err = r.DB.Exec("UPDATE goods SET name = $1, expedition_id = $2 WHERE id = $3",
		&good.Name, &good.ExpeditionID, &good.ID)
	return r.FindById(good.ID)
}
