package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"travelPlanner/internal/config"
	_ "travelPlanner/internal/handlers"
	"travelPlanner/internal/handlers/route"
	_ "travelPlanner/internal/models"
)

var db *gorm.DB

// @title Travel Planner
// @version 1.0
// @host localhost:8081
// @BasePath /
func main() {
	cfg := config.Load()
	var err error

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             2e6,         // Время, после которого запрос считается медленным
			LogLevel:                  logger.Info, // Уровень логирования (Info, Warn, Error, Silent)
			IgnoreRecordNotFoundError: true,        // Игнорировать ошибку "record not found"
			Colorful:                  true,        // Включить цветной вывод
		},
	)
	db, err = gorm.Open(postgres.Open(cfg.DB.DSN), &gorm.Config{
		Logger:                                   newLogger,
		DryRun:                                   false,
		PrepareStmt:                              false,
		DisableAutomaticPing:                     false,
		DisableForeignKeyConstraintWhenMigrating: false,
		IgnoreRelationshipsWhenMigrating:         false,
		DisableNestedTransaction:                 false,
		AllowGlobalUpdate:                        false,
		QueryFields:                              false,
		CreateBatchSize:                          0,
		TranslateError:                           false,
		PropagateUnscoped:                        false,
		ClauseBuilders:                           nil,
		ConnPool:                                 nil,
		Dialector:                                nil,
		Plugins:                                  nil,
	})
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
