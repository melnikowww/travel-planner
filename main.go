package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/gin-gonic/gin"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"travelPlanner/backend/handlers"
	_ "travelPlanner/backend/handlers"
	"travelPlanner/backend/handlers/route"
	"travelPlanner/backend/models"
	_ "travelPlanner/backend/models"
	"travelPlanner/backend/repositories"
	"travelPlanner/backend/security"
	"travelPlanner/backend/services"
)

var db *gorm.DB

// @title Travel Planner
// @version 1.0
// @host localhost:8081
// @BasePath /
func main() {
	//cfg := config.Load()
	if os.Getenv("PROD") == "" {
		godotenv.Load()
	}
	var err error

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             2e6,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)
	db, err = gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{
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

	err = db.AutoMigrate(&models.User{}, &models.Car{}, &models.Expedition{}, &models.Point{}, &models.Good{}, &models.Equipment{}, &models.Crew{}, &models.Message{})
	if err != nil {
		log.Fatalf("Не удалось совершить миграцию БД %v", err)
	}
	router := gin.Default()
	auth := router.Group("/")

	log.Printf(os.Getenv("FRONTEND"))

	corsConfig := cors.Config{
		AllowAllOrigins:        false,
		AllowHeaders:           []string{"Origin", "Content-Type", "Authorization"},
		AllowOrigins:           []string{os.Getenv("FRONTEND")},
		AllowMethods:           []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowCredentials:       true,
		AllowWildcard:          true,
		AllowBrowserExtensions: false,
		AllowWebSockets:        true,
		AllowFiles:             true,
	}
	router.Use(cors.New(corsConfig))
	auth.Use(cors.New(corsConfig))

	auth.Use(security.AuthMiddleware())
	{
		auth = route.RegisterAllRoutes(auth, db)
	}

	loginHandler := handlers.LoginHandler{UserService: &services.UserService{UserRepo: &repositories.UserRepository{DB: db}}}
	router.POST("/login", loginHandler.LogIn)
	router.POST("/register", loginHandler.Register)

	err = router.Run(":" + os.Getenv("PORT"))
	if err != nil {
		log.Fatalf("Не удалось запустить сервер! %v", err)
	}
	log.Printf("Сервер запущен на http://localhost:%s\n", os.Getenv("PORT"))
}
