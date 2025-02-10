package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	_ "travelPlanner/docs"
	"travelPlanner/internal/models"
	"travelPlanner/internal/services"
	"travelPlanner/internal/utils"
)

type PointsHandler struct {
	PointsService *services.PointsService
}

// GetPoint Обработчик для получения точек
// @Summary Получить точку/точки
// @Description Получить все точки или конкретную точку по ID
// @Tags Контрольные точки
// @Produce json
// @Param id query int false "ID точки"
// @Success 200 {object} []models.Point "Успешный ответ"
// @Success 200 {object} models.Point "Успешный ответ для одной точки"
// @Failure 400 {string} string "Неверный ID"
// @Failure 404 {string} string "Точка не найдена"
// @Router /points [get]
func (h *PointsHandler) GetPoint(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		points, err := h.PointsService.GetAllPoints()
		if err != nil {
			c.JSON(http.StatusConflict, err)
		}
		c.JSON(http.StatusOK, points)
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
		}
		point, err := h.PointsService.GetPoint(id)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
		}
		c.JSON(http.StatusOK, point)
	}
}

// CreatePoint Создание новой точки
// @Summary Создать новую точку
// @Description Добавление новой географической точки
// @Tags Контрольные точки
// @Accept json
// @Produce json
// @Param point body models.Point true "Данные точки"
// @Success 201 {object} models.Point "Созданная точка"
// @Failure 400 {string} string "Неверный формат данных"
// @Failure 409 {string} string "Конфликт данных"
// @Router /points [post]
func (h *PointsHandler) CreatePoint(c *gin.Context) {
	var point models.Point
	if err := c.ShouldBindJSON(&point); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	id := h.PointsService.CreatePoint(&point)
	if id != -1 {
		point.ID = id
		c.JSON(http.StatusCreated, &point)
	} else {
		c.String(http.StatusConflict, "Point already exists")
	}
}

// DeletePoint Удаление точки
// @Summary Удалить точку
// @Description Удаление точки по ID
// @Tags Контрольные точки
// @Produce json
// @Param id query int true "ID точки"
// @Success 204 "Точка удалена"
// @Failure 400 {string} string "Неверный ID"
// @Failure 404 {string} string "Точка не найдена"
// @Router /points [delete]
func (h *PointsHandler) DeletePoint(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid ID")
		return
	}
	if err := h.PointsService.DeletePoint(id); err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

// UpdatePoint Обновление точки
// @Summary Обновить точку
// @Description Частичное или полное обновление данных точки
// @Tags Контрольные точки
// @Accept json
// @Produce json
// @Param id query int true "ID точки"
// @Param point body models.Point true "Обновленные данные"
// @Success 200 {object} models.Point "Обновленная точка"
// @Failure 400 {string} string "Неверные данные"
// @Failure 404 {string} string "Точка не найдена"
// @Failure 409 {string} string "Конфликт данных"
// @Router /points [patch]
func (h *PointsHandler) UpdatePoint(c *gin.Context) {
	var point models.Point
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	oldPoint, err := h.PointsService.GetPoint(id)
	if err != nil {
		c.Status(http.StatusNotFound)
	}
	if err = c.ShouldBindJSON(&point); err != nil {
		c.String(http.StatusConflict, err.Error())
	}
	point.Name = utils.FirstNonEmptyString(point.Name, oldPoint.Name)
	point.Location = utils.FirstNonEmptyString(point.Location, oldPoint.Location)
	point.ID = id
	updatePoint, err := h.PointsService.UpdatePoint(&point)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, updatePoint)
}

func (h *PointsHandler) RegisterRoutes(router *gin.Engine) *gin.Engine {
	router.GET("/points", h.GetPoint)
	router.POST("/points", h.CreatePoint)
	router.PATCH("/points", h.UpdatePoint)
	router.DELETE("/points", h.DeletePoint)
	return router
}
