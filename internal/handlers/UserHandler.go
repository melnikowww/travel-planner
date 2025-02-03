package handlers

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
	"travelPlanner/internal/models"
	"travelPlanner/internal/services"
)

type UserHandler struct {
	UserService *services.UserService
}

func (h *UserHandler) GetUserHandler(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	person, err := h.UserService.GetUser(id)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		log.Fatalf("Error DB: %v", err)
	}
	c.JSON(http.StatusOK, person)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, err.Error())
	}
	id := h.UserService.CreateUser(&user)
	user.ID = id
	c.JSON(http.StatusOK, gin.H{"User": user})
}

func (h *UserHandler) HelloHandler(c *gin.Context) {
	c.JSON(http.StatusOK, "Hi")
}

func (h *UserHandler) RegisterRoutes() *gin.Engine {
	router := gin.Default()
	router.GET("/", h.HelloHandler)
	router.GET("/users", h.GetUserHandler)
	router.POST("/users", h.CreateUser)
	return router
}
