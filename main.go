package main

import (
	"database/sql"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"log"
	"travelPlanner/internal/config"
	_ "travelPlanner/internal/handlers"
	"travelPlanner/internal/handlers/route"
	_ "travelPlanner/internal/models"
)

var db *sql.DB

// @title Travel Planner
// @version 1.0
// @host localhost:8081
// @BasePath /
func main() {
	cfg := config.Load()
	var err error
	db, err = sql.Open("postgres", cfg.DB.DSN)
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v ", err)
	}

	_, err = migrate.New("file://migrations", cfg.DB.DSN)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	router := gin.Default()

	router = route.RegisterAllRoutes(router, db)

	router.Use(cors.Default())

	err = router.Run("localhost:8081")
	if err != nil {
		log.Fatalf("Не удалось запустить сервер! %v", err)
	}

	log.Printf("Сервер запущен на http://localhost:%s\n", cfg.Port)
}
