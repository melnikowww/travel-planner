package handlers

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
	_ "travelPlanner/docs"
	"travelPlanner/internal/models"
	"travelPlanner/internal/security"
	"travelPlanner/internal/services"
	"travelPlanner/internal/utils"
)

type UserHandler struct {
	UserService *services.UserService
}

// GetUserHandler Получение информации о пользователе(ях)
// @Summary Получить пользователя/пользователей
// @Description Возвращает конкретного пользователя по ID или всех пользователей, если ID не указан
// @Tags Пользователи
// @Produce json
// @Param id query int false "ID пользователя"
// @Success 200 {object} []models.User "Список пользователей"
// @Success 200 {object} models.User "Данные пользователя"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 404 {string} string "Пользователь не найден"
// @Failure 500 {string} string "Внутренняя ошибка сервера"
// @Router /users [get]
func (h *UserHandler) GetUserHandler(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		users, err := h.UserService.GetAllUsers()
		if err != nil {
			c.JSON(http.StatusConflict, err)
		}
		c.JSON(http.StatusOK, users)
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			log.Printf("Error: %v", err)
			c.String(http.StatusBadRequest, "Invalid user ID")
			return
		}
		person, err := h.UserService.GetUser(id)
		if err != nil {
			c.String(http.StatusNotFound, err.Error())
			log.Printf("Error DB: %v", err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"id": person.ID, "name": person.Name, "email": person.Email})
	}
}

// CreateUserHandler Создание нового пользователя
// @Summary Создать пользователя
// @Description Регистрация нового пользователя в системе
// @Tags Пользователи
// @Accept json
// @Produce json
// @Param user body models.User true "Данные пользователя"
// @Success 201 {object} models.User "Созданный пользователь"
// @Failure 400 {string} string "Некорректные входные данные"
// @Failure 409 {string} string "Пользователь уже существует"
// @Failure 500 {string} string "Ошибка хеширования пароля"
// @Router /users [post]
func (h *UserHandler) CreateUserHandler(c *gin.Context) {
	var user models.User
	var err error
	if err := c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	user.Password, err = security.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusConflict, "Password hash error")
	}
	id := h.UserService.CreateUser(&user)
	if id != 1 {
		user.ID = id
		c.JSON(http.StatusCreated, gin.H{"id": user.ID, "name": user.Name, "email": user.Email})
	} else {
		c.JSON(http.StatusConflict, "User already exists")
	}
}

// DeleteUserHandler Удаление пользователя
// @Summary Удалить пользователя
// @Description Удаление пользователя по ID
// @Tags Пользователи
// @Produce json
// @Param id query int true "ID пользователя"
// @Success 204 "Пользователь удален"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 404 {string} string "Пользователь не найден"
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

// PatchUserHandler Обновление данных пользователя
// @Summary Обновить пользователя
// @Description Частичное обновление данных пользователя. Пароль будет автоматически хеширован.
// @Tags Пользователи
// @Accept json
// @Produce json
// @Param id query int true "ID пользователя"
// @Param user body models.User true "Обновляемые данные"
// @Success 200 {object} models.User "Обновленные данные"
// @Failure 400 {string} string "Некорректные данные"
// @Failure 404 {string} string "Пользователь не найден"
// @Failure 409 {string} string "Конфликт данных"
// @Router /users [patch]
func (h *UserHandler) PatchUserHandler(c *gin.Context) {
	var user models.User
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid user ID")
		return
	}

	oldUser, err := h.UserService.GetUser(id)
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
	}

	if err = c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	user.Name = utils.FirstNonEmptyString(user.Name, oldUser.Name)
	user.Email = utils.FirstNonEmptyString(user.Email, oldUser.Email)
	if user.Password == "" {
		user.Password = oldUser.Password
	} else {
		user.Password, err = security.HashPassword(user.Password)
	}
	user.ID = uint(id)
	updateUser, err := h.UserService.UpdateUser(&user)
	if err != nil {
		log.Printf("Update error: %v", err)
		c.JSON(http.StatusConflict, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": updateUser.ID, "name": updateUser.Name, "email": updateUser.Email})
}

// RegisterRoutes registers all routes for the UserHandler
func (h *UserHandler) RegisterRoutes(router *gin.Engine) *gin.Engine {
	router.GET("/users", h.GetUserHandler)
	router.POST("/users", h.CreateUserHandler)
	router.DELETE("/users", h.DeleteUserHandler)
	router.PATCH("/users", h.PatchUserHandler)
	return router
}
