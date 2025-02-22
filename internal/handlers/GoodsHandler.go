package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	_ "travelPlanner/docs"
	"travelPlanner/internal/models"
	"travelPlanner/internal/services"
)

type GoodsHandler struct {
	GoodsService *services.GoodsService
}

// GetGoods Обработчик для получения списка продуктов
// @Summary Получить список продуктов
// @Description Получение списка всех продуктов или конкретной позиции по ID
// @Tags Продукты
// @Produce json
// @Param id query int false "ID продукта"
// @Success 200 {object} []models.Good "Список продуктов"
// @Success 200 {object} models.Good "Конкретная позиция"
// @Failure 400 {string} string "Некорректный запрос"
// @Failure 404 {string} string "Не найдено"
// @Failure 500 {string} string "Ошибка сервера"
// @Router /goods [get]
func (h *GoodsHandler) GetGoods(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		points, err := h.GoodsService.GetAllGoods()
		if err != nil {
			c.JSON(http.StatusConflict, err)
		}
		c.JSON(http.StatusOK, points)
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
		}
		good, err := h.GoodsService.GetGood(id)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
		}
		c.JSON(http.StatusOK, good)
	}
}

// CreateGood Обработчик для создания продукта
// @Summary Создать новую позицию
// @Description Создание новой позиции продуктов
// @Tags Продукты
// @Accept json
// @Produce json
// @Param good body models.Good true "Данные продукта"
// @Success 201 {object} models.Good "Созданная позиция"
// @Failure 400 {string} string "Некорректные данные"
// @Failure 409 {string} string "Конфликт - позиция уже существует"
// @Router /goods [post]
func (h *GoodsHandler) CreateGood(c *gin.Context) {
	var good models.Good
	if err := c.ShouldBindJSON(&good); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	id, err := h.GoodsService.CreateGood(&good)
	if id != 0 {
		good.ID = id
		c.JSON(http.StatusCreated, &good)
	} else {
		c.String(http.StatusConflict, err.Error())
	}
}

// DeleteGood Обработчик для удаления продукта из списка
// @Summary Удалить позицию
// @Description Удаление позиции продукта по ID
// @Tags Продукты
// @Produce json
// @Param id query int true "ID продукта"
// @Success 204 "Успешное удаление"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 404 {string} string "Не найдено"
// @Failure 500 {string} string "Ошибка сервера"
// @Router /goods [delete]
func (h *GoodsHandler) DeleteGood(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid ID")
		return
	}
	if err := h.GoodsService.DeleteGood(id); err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

// UpdateGood Обработчик для измененния данных продукта
// @Summary Обновить позицию
// @Description Обновление существующей позиции (частичное обновление)
// @Tags Продукты
// @Accept json
// @Produce json
// @Param id query int true "ID продукта"
// @Param good body models.Good true "Данные для обновления"
// @Success 200 {object} models.Good "Обновленная позиция"
// @Failure 400 {string} string "Некорректный запрос"
// @Failure 404 {string} string "Не найдено"
// @Failure 409 {string} string "Конфликт данных"
// @Router /goods [patch]
func (h *GoodsHandler) UpdateGood(c *gin.Context) {
	var good models.Good
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	if err = c.ShouldBindJSON(&good); err != nil {
		c.String(http.StatusConflict, err.Error())
	}
	good.ID = id
	updateGood, err := h.GoodsService.UpdateGood(&good)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, updateGood)
}

func (h *GoodsHandler) RegisterRoutes(router *gin.RouterGroup) *gin.RouterGroup {
	router.GET("/goods", h.GetGoods)
	router.POST("/goods", h.CreateGood)
	router.PATCH("/goods", h.UpdateGood)
	router.DELETE("/goods", h.DeleteGood)
	return router
}
