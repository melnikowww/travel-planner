package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/backend/models"
	"travelPlanner/backend/services"
	_ "travelPlanner/docs"
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
			c.String(http.StatusBadRequest, "Invalid user ID")
			return
		}
		person, err := h.UserService.GetUser(id)
		if err != nil {
			c.String(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, &person)
	}
}

// GetUserByEmail Поиск пользователя по email
// @Summary Найти пользователя по email
// @Description Поиск пользователя по email
// @Tags Пользователи
// @Produce json
// @Param id query int true "ID пользователя"
// @Success 200 "Пользователь удален"
// @Failure 401 {string} string "Ошибка поиска"
// @Router /user [get]
func (h *UserHandler) GetUserByEmail(c *gin.Context) {
	email := c.MustGet("email").(string)
	user, err := h.UserService.GetUserByEmail(email)
	if err != nil {
		c.Status(http.StatusBadGateway)
	}
	c.JSON(http.StatusOK, gin.H{"id": user.ID, "name": user.Name, "email": user.Email, "cars": user.Cars, "crews": user.Crews, "imgSrc": user.ImageSrc})
	c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
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
	if err = c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	user.ID = id
	updateUser, err := h.UserService.UpdateUser(&user)
	if err != nil {
		c.JSON(http.StatusConflict, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": updateUser.ID, "name": updateUser.Name, "email": updateUser.Email})
	c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
}

// GetExpeditionsByUser Получение экспедиций пользователя
// @Summary Получить экспедиции пользователя
// @Description Возвращает список всех экспедиций, связанных с текущим авторизованным пользователем
// @Tags Экспедиции
// @Produce json
// @Security ApiKeyAuth
// @Param Authorization header string true "Токен авторизации"
// @Success 200 {array} models.Expedition "Список экспедиций"
// @Failure 400 {string} string "Ошибка при получении данных"
// @Failure 401 {string} string "Неавторизованный доступ"
// @Router /user&exp [get]
func (h *UserHandler) GetExpeditionsByUser(c *gin.Context) {
	id := c.MustGet("id").(int)
	expeditions, err := h.UserService.GetUsersExpeditions(id)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, expeditions)
	return
}

func (h *UserHandler) RegisterRoutes(router *gin.RouterGroup) *gin.RouterGroup {
	router.GET("/users", h.GetUserHandler)
	router.GET("/user", h.GetUserByEmail)
	router.GET("/user&exp", h.GetExpeditionsByUser)
	router.DELETE("/users", h.DeleteUserHandler)
	router.PATCH("/users", h.PatchUserHandler)
	return router
}
