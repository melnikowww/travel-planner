package main

import (
	"database/sql"
	_ "github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"log"
	"travelPlanner/internal/config"
	"travelPlanner/internal/handlers"
	_ "travelPlanner/internal/handlers"
	_ "travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/services"
)

var db *sql.DB

func main() {
	cfg := config.Load()
	var err error
	db, err = sql.Open("postgres", cfg.DB.DSN)
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v ", err)
	}

	handler := handlers.UserHandler{UserService: &services.UserService{UserRepo: &repositories.UserRepository{DB: db}}}
	router := handler.RegisterRoutes()

	err = router.Run("localhost:8081")
	if err != nil {
		log.Fatalf("Не удалось запустить сервер! %v", err)
	}

	log.Printf("Сервер запущен на http://localhost:%s\n", cfg.Port)
}
