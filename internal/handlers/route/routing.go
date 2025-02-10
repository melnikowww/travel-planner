package route

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
	"travelPlanner/internal/handlers"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/services"
)

func RegisterAllRoutes(router *gin.Engine, db *gorm.DB) *gin.Engine {

	userHandler := handlers.UserHandler{UserService: &services.UserService{UserRepo: &repositories.UserRepository{DB: db}}}
	pointsHandler := handlers.PointsHandler{PointsService: &services.PointsService{PointRepo: &repositories.PointsRepository{DB: db}}}
	equipHandler := handlers.EquipmentHandler{EquipService: &services.EquipmentService{EquipRepo: &repositories.EquipRepository{DB: db}}}
	goodsHandler := handlers.GoodsHandler{GoodsService: &services.GoodsService{GoodsRepo: &repositories.GoodsRepository{DB: db}}}
	carsHandler := handlers.CarsHandler{CarsService: &services.CarsService{CarsRepo: &repositories.CarsRepository{DB: db}}}
	//expHandler := handlers.ExpeditionHandler{ExpService: &services.ExpeditionService{ExpRepo: &repositories.ExpeditionRepository{DB: db}}}
	//crewHandler := handlers.CrewHandler{CrewService: &services.CrewService{CrewRepo: &repositories.CrewRepository{DB: db}}}

	router = userHandler.RegisterRoutes(router)
	router = pointsHandler.RegisterRoutes(router)
	router = equipHandler.RegisterRoutes(router)
	router = goodsHandler.RegisterRoutes(router)
	router = carsHandler.RegisterRoutes(router)
	//router = expHandler.RegisterRoutes(router)
	//router = crewHandler.RegisterRoutes(router)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return router
}
