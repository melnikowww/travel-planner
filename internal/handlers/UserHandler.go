package handlers

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
	_ "travelPlanner/docs"
	"travelPlanner/internal/models"
	"travelPlanner/internal/services"
)

type UserHandler struct {
	UserService *services.UserService
}

// @Summary Get user by ID
// @Description Получить пользователя по ID. Если id не передан, получить всех пользователей.
// @Accept json
// @Produce json
// @Param id query int false "User ID"
// @Success 200 {array} models.User "Success"
// @Failure 404 {string} string "User not found"
// @Failure 409 {string} string "Error fetching users"
// @Router /users [get]
func (h *UserHandler) GetUserHandler(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		users, err := h.UserService.GetAllUsers()
		if err != nil {
			c.JSON(http.StatusConflict, err)
			return // Не забываем завершать выполнение функции
		}
		c.JSON(http.StatusOK, users)
		return // Не забываем завершать выполнение функции
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			log.Printf("Error: %v", err)
			c.String(http.StatusBadRequest, "Invalid user ID")
			return // Обработка ошибок
		}
		person, err := h.UserService.GetUser(id)
		if err != nil {
			c.String(http.StatusNotFound, err.Error())
			log.Printf("Error DB: %v", err)
			return // Обработка ошибок
		}
		c.JSON(http.StatusOK, person)
	}
}

// @Summary Create a new user
// @Description Создать нового пользователя
// @Accept json
// @Produce json
// @Param user body models.User true "User object"
// @Success 200 {object} models.User "Created user"
// @Failure 400 {string} string "Invalid input"
// @Failure 409 {string} string "User already exists"
// @Router /users [post]
func (h *UserHandler) CreateUserHandler(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return // Завершение функции
	}
	id := h.UserService.CreateUser(&user)
	if id != -1 {
		user.ID = id
		c.JSON(http.StatusOK, gin.H{"User": user})
	} else {
		c.JSON(http.StatusConflict, "User already exists")
	}
}

// @Summary Delete user by ID
// @Description Удалить пользователя по ID
// @Accept json
// @Produce json
// @Param id query int true "User ID"
// @Success 204 {string} string "User deleted"
// @Failure 400 {string} string "Invalid user ID"
// @Failure 404 {string} string "User not found"
// @Router /users [delete]
func (h *UserHandler) DeleteUserHandler(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid user ID")
		return // Завершение функции
	}
	err = h.UserService.DeleteUser(id)
	if err != nil {
		log.Printf("Delete error: %v", err)
		c.String(http.StatusNotFound, "User not found")
		return // Завершение функции
	}
	c.Status(http.StatusNoContent) // Успешное удаление
}

// @Summary Update user by ID
// @Description Обновить данные пользователя по ID
// @Accept json
// @Produce json
// @Param id query int true "User ID"
// @Param user body models.User true "User object"
// @Success 200 {object} models.User "Updated user"
// @Failure 400 {string} string "Invalid input"
// @Failure 404 {string} string "User not found"
// @Router /users [patch]
func (h *UserHandler) PatchUserHandler(c *gin.Context) {
	var user models.User
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid user ID")
		return // Завершение функции
	}
	if err = c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return // Завершение функции
	}
	user.ID = id
	newUser, err := h.UserService.UpdateUser(&user)
	if err != nil {
		log.Printf("Update error: %v", err)
		c.JSON(http.StatusConflict, err)
		return // Завершение функции
	}
	c.JSON(http.StatusOK, gin.H{"Patched user": newUser})
}

// @Summary Hello endpoint
// @Description Проверка работоспособности API
// @Produce json
// @Success 200 {string} string "Hi"
// @Router / [get]
func (h *UserHandler) HelloHandler(c *gin.Context) {
	c.JSON(http.StatusOK, "Hi")
}

// RegisterRoutes registers all routes for the UserHandler
func (h *UserHandler) RegisterRoutes(router *gin.Engine) *gin.Engine {
	router.GET("/", h.HelloHandler)
	router.GET("/users", h.GetUserHandler)
	router.POST("/users", h.CreateUserHandler)
	router.DELETE("/users", h.DeleteUserHandler)
	router.PATCH("/users", h.PatchUserHandler)
	return router
}
