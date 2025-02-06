package main

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"travelPlanner/internal/handlers"
	"travelPlanner/internal/repositories"
	"travelPlanner/internal/services"
)

func RegisterAllRoutes(router *gin.Engine) *gin.Engine {

	userHandler := handlers.UserHandler{UserService: &services.UserService{UserRepo: &repositories.UserRepository{DB: db}}}
	pointsHandler := handlers.PointsHandler{PointsService: &services.PointsService{PointRepo: &repositories.PointsRepository{DB: db}}}
	equipHandler := handlers.EquipmentHandler{EquipService: &services.EquipmentService{EquipRepo: &repositories.EquipRepository{DB: db}}}
	goodsHandler := handlers.GoodsHandler{GoodsService: &services.GoodsService{GoodsRepo: &repositories.GoodsRepository{DB: db}}}

	router = userHandler.RegisterRoutes(router)
	router = pointsHandler.RegisterRoutes(router)
	router = equipHandler.RegisterRoutes(router)
	router = goodsHandler.RegisterRoutes(router)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return router
}
