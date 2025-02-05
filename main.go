package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"log"
	"travelPlanner/internal/config"
	"travelPlanner/internal/handlers"
	_ "travelPlanner/internal/handlers"
	_ "travelPlanner/internal/models"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/services"
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

	userHandler := handlers.UserHandler{UserService: &services.UserService{UserRepo: &repositories.UserRepository{DB: db}}}
	pointsHandler := handlers.PointsHandler{PointsService: &services.PointsService{PointRepo: &repositories.PointsRepository{DB: db}}}
	router := gin.Default()
	router = userHandler.RegisterRoutes(router)
	router = pointsHandler.RegisterRoutes(router)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	err = router.Run("localhost:8081")
	if err != nil {
		log.Fatalf("Не удалось запустить сервер! %v", err)
	}

	log.Printf("Сервер запущен на http://localhost:%s\n", cfg.Port)
}
