package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/backend/models"
	"travelPlanner/backend/services"
)

type CrewHandler struct {
	CrewService *services.CrewService
}

// Get Получение информации об экипаже(ах)
// @Summary Получить экипажи
// @Description Возвращает список всех экипажей или конкретный экипаж по ID
// @Tags Экипажи
// @Produce json
// @Param id query int false "ID экипажа"
// @Success 200 {object} []models.Crew "Список экипажей"
// @Success 200 {object} models.Crew "Данные экипажа"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 404 {string} string "Экипаж не найден"
// @Failure 409 {string} string "Конфликт данных"
// @Router /crews [get]
func (h *CrewHandler) Get(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		crews, err := h.CrewService.GetAllCrews()
		if err != nil {
			c.Status(http.StatusConflict)
			return
		}
		c.JSON(http.StatusOK, crews)
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		crew, err := h.CrewService.GetCrew(id)
		if err != nil {
			c.Status(http.StatusNotFound)
			return
		}
		c.JSON(http.StatusOK, crew)
	}
}

// Create Создание нового экипажа
// @Summary Создать экипаж
// @Description Создание нового экипажа. Требуется авторизация водителя.
// @Tags Экипажи
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param crew body models.Crew true "Данные экипажа"
// @Success 201 {object} models.Crew "Созданный экипаж"
// @Failure 400 {string} string "Некорректные данные"
// @Failure 401 {string} string "Неавторизованный доступ"
// @Failure 409 {string} string "Конфликт данных"
// @Router /crews [post]
func (h *CrewHandler) Create(c *gin.Context) {
	var crew *models.Crew
	if err := c.ShouldBindJSON(&crew); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	crew.DriverID = c.MustGet("id").(int)
	id, err := h.CrewService.Create(crew)
	if id == 0 {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, &crew)
}

// GetByDriverAndExpedition Поиск экипажа
// @Summary Найти экипаж по водителю и экспедиции
// @Description Поиск экипажа по связке водитель-экспедиция
// @Tags Экипажи
// @Produce json
// @Param driver_id query int true "ID водителя"
// @Param expedition_id query int true "ID экспедиции"
// @Success 200 {object} models.Crew "Данные экипажа"
// @Failure 400 {string} string "Некорректные параметры"
// @Failure 404 {string} string "Экипаж не найден"
// @Router /crew [get]
func (h *CrewHandler) GetByDriverAndExpedition(c *gin.Context) {
	driverId, err := strconv.Atoi(c.Query("driver_id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	expeditionId, err := strconv.Atoi(c.Query("expedition_id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	crew, err := h.CrewService.FindByDriverAndExpedition(driverId, expeditionId)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, crew)
}

// Update Обновление экипажа
// @Summary Обновить экипаж
// @Description Обновление данных экипажа. Требуются права создателя.
// @Tags Экипажи
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id query int true "ID экипажа"
// @Param crew body models.Crew true "Обновленные данные"
// @Success 200 {object} models.Crew "Обновленный экипаж"
// @Failure 400 {string} string "Некорректные данные"
// @Failure 403 {string} string "Доступ запрещен"
// @Failure 404 {string} string "Экипаж не найден"
// @Router /crews [patch]
func (h *CrewHandler) Update(c *gin.Context) {
	var crew *models.Crew
	if err := c.ShouldBindJSON(&crew); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	userId := c.MustGet("id").(int)
	crew.ID = id
	updatedCrew, err := h.CrewService.Update(crew, userId)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, updatedCrew)
}

// Delete Удаление экипажа
// @Summary Удалить экипаж
// @Description Удаление экипажа. Требуются права создателя.
// @Tags Экипажи
// @Produce json
// @Security ApiKeyAuth
// @Param id query int true "ID экипажа"
// @Success 204 "Экипаж удален"
// @Failure 400 {string} string "Некорректный ID"
// @Failure 403 {string} string "Доступ запрещен"
// @Failure 404 {string} string "Экипаж не найден"
// @Router /crews [delete]
func (h *CrewHandler) Delete(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	userId := c.MustGet("id").(int)
	if err = h.CrewService.Delete(id, userId); err != nil {
		c.Status(http.StatusConflict)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *CrewHandler) RegisterRoutes(router *gin.RouterGroup) *gin.RouterGroup {
	router.GET("/crews", h.Get)
	router.POST("/crews", h.Create)
	router.PATCH("/crews", h.Update)
	router.DELETE("/crews", h.Delete)
	router.GET("/crew", h.GetByDriverAndExpedition)
	return router
}
