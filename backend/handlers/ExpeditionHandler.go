package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/backend/models"
	"travelPlanner/backend/services"
)

type ExpeditionHandler struct {
	ExpService *services.ExpeditionService
}

// GetExpedition Получение информации об экспедиции(ях)
// @Summary Получить экспедиции
// @Description Возвращает список всех экспедиций или конкретную экспедицию по ID
// @Tags Экспедиции
// @Produce json
// @Param id query int false "ID экспедиции"
// @Success 200 {object} []models.Expedition "Список экспедиций"
// @Success 200 {object} models.Expedition "Данные экспедиции"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 404 {string} string "Экспедиция не найдена"
// @Failure 500 {string} string "Внутренняя ошибка сервера"
// @Router /expeditions [get]
func (h *ExpeditionHandler) GetExpedition(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		expeditions, err := h.ExpService.GetAllExpeditions()
		if err != nil {
			c.String(http.StatusConflict, err.Error())
			return
		}
		c.JSON(http.StatusOK, expeditions)
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
			return
		}
		expedition, err := h.ExpService.GetExpedition(id)
		if err != nil {
			c.String(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, expedition)
	}
}

// GetDrivers Получение водителей экспедиции
// @Summary Получить водителей экспедиции
// @Description Возвращает список водителей для указанной экспедиции
// @Tags Экспедиции
// @Produce json
// @Param id query int true "ID экспедиции"
// @Success 200 {array} models.User "Список водителей"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 404 {string} string "Экспедиция не найдена"
// @Router /expedition_drivers [get]
func (h *ExpeditionHandler) GetDrivers(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	drivers, err := h.ExpService.GetDrivers(id)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, drivers)
	return
}

// CreateExpedition Создание новой экспедиции
// @Summary Создать экспедицию
// @Description Создание новой экспедиции. Требуются права авторизованного пользователя.
// @Tags Экспедиции
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param expedition body models.Expedition true "Данные экспедиции"
// @Success 201 {object} models.Expedition "Созданная экспедиция"
// @Failure 400 {string} string "Ошибка валидации данных"
// @Failure 401 {string} string "Неавторизованный доступ"
// @Failure 409 {string} string "Конфликт данных"
// @Router /expeditions [post]
func (h *ExpeditionHandler) CreateExpedition(c *gin.Context) {
	var expedition models.Expedition
	expedition.CreatorID = c.MustGet("id").(int)
	if err := c.ShouldBindJSON(&expedition); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	id, err := h.ExpService.CreateExpedition(&expedition)
	if id == 0 {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusCreated, &expedition)
}

// UpdateExpedition Обновление данных экспедиции
// @Summary Обновить экспедицию
// @Description Обновление данных экспедиции. Требуются права создателя.
// @Tags Экспедиции
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id query int true "ID экспедиции"
// @Param expedition body models.Expedition true "Обновляемые данные"
// @Success 200 {object} models.Expedition "Обновленные данные"
// @Failure 400 {string} string "Некорректные данные"
// @Failure 403 {string} string "Доступ запрещен"
// @Failure 404 {string} string "Экспедиция не найдена"
// @Router /expeditions [patch]
func (h *ExpeditionHandler) UpdateExpedition(c *gin.Context) {
	var newExpedition models.Expedition
	userId := c.MustGet("id").(int)
	if err := c.ShouldBindJSON(&newExpedition); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	newExpedition.ID = id
	updatedExpedition, err := h.ExpService.UpdateExpedition(&newExpedition, userId)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, updatedExpedition)
}

// DeleteExpedition Удаление экспедиции
// @Summary Удалить экспедицию
// @Description Удаление экспедиции. Требуются права создателя.
// @Tags Экспедиции
// @Produce json
// @Security ApiKeyAuth
// @Param id query int true "ID экспедиции"
// @Success 204 "Экспедиция удалена"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 403 {string} string "Доступ запрещен"
// @Failure 404 {string} string "Экспедиция не найдена"
// @Router /expeditions [delete]
func (h *ExpeditionHandler) DeleteExpedition(c *gin.Context) {
	key := c.Query("id")
	userId := c.MustGet("id").(int)
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	if err := h.ExpService.DeleteExpedition(id, userId); err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *ExpeditionHandler) RegisterRoutes(router *gin.RouterGroup) *gin.RouterGroup {
	router.GET("/expeditions", h.GetExpedition)
	router.GET("/expedition_drivers", h.GetDrivers)
	router.POST("/expeditions", h.CreateExpedition)
	router.PATCH("/expeditions", h.UpdateExpedition)
	router.DELETE("/expeditions", h.DeleteExpedition)
	return router
}
