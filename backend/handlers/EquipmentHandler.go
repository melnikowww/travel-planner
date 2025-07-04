package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/backend/models"
	"travelPlanner/backend/services"
	_ "travelPlanner/docs"
)

type EquipmentHandler struct {
	EquipService *services.EquipmentService
}

// GetEquip Обработчик для получения снаряжения
// @Summary Получить снаряжение
// @Description Получить список всего снаряжения или конкретный экземпляр по ID
// @Tags Снаряжение
// @Produce json
// @Param id query int false "ID снаряжения"
// @Success 200 {object} models.Equipment "Успешный ответ"
// @Success 200 {array} models.Equipment "Список снаряжения"
// @Failure 400 {string} string "Неверный ID"
// @Failure 404 {string} string "Снаряжение не найдено"
// @Router /equip [get]
func (h *EquipmentHandler) GetEquip(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		equips, err := h.EquipService.GetAllEquips()
		if err != nil {
			c.JSON(http.StatusConflict, err)
		}
		c.JSON(http.StatusOK, equips)
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
		}
		equip, err := h.EquipService.GetEquip(id)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
		}
		c.JSON(http.StatusOK, equip)
	}
}

// CreateEquip Обработчик для создания нового снаряжения
// @Summary Создать снаряжение
// @Description Создать новое снаряжение
// @Tags Снаряжение
// @Accept json
// @Produce json
// @Param equipment body models.Equipment true "Данные снаряжения"
// @Success 201 {object} models.Equipment "Созданное снаряжение"
// @Failure 400 {string} string "Ошибка валидации"
// @Failure 409 {string} string "Конфликт данных"
// @Router /equip [post]
func (h *EquipmentHandler) CreateEquip(c *gin.Context) {
	var equip models.Equipment
	if err := c.ShouldBindJSON(&equip); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	id, err := h.EquipService.CreateEquip(&equip)
	if id != 0 {
		equip.ID = id
		c.JSON(http.StatusCreated, &equip)
	} else {
		c.String(http.StatusConflict, err.Error())
	}
}

// DeleteEquip Обработчик для удаления снаряжения
// @Summary Удалить снаряжение
// @Description Удалить снаряжение по ID
// @Tags Снаряжение
// @Produce json
// @Param id query int true "ID снаряжения"
// @Success 204 "Снаряжение удалено"
// @Failure 400 {string} string "Неверный ID"
// @Failure 409 {string} string "Ошибка удаления"
// @Router /equip [delete]
func (h *EquipmentHandler) DeleteEquip(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid ID")
		return
	}
	if err := h.EquipService.DeleteEquip(id); err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

// UpdateEquip Обработчик для обновления снаряжения
// @Summary Обновить снаряжение
// @Description Частичное обновление данных снаряжения
// @Tags Снаряжение
// @Accept json
// @Produce json
// @Param id query int true "ID снаряжения"
// @Param equipment body models.Equipment true "Обновляемые поля"
// @Success 200 {object} models.Equipment "Обновленное снаряжение"
// @Failure 400 {string} string "Неверные данные"
// @Failure 404 {string} string "Снаряжение не найдено"
// @Failure 409 {string} string "Ошибка обновления"
// @Router /equip [patch]
func (h *EquipmentHandler) UpdateEquip(c *gin.Context) {
	var equip models.Equipment
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	if err = c.ShouldBindJSON(&equip); err != nil {
		c.String(http.StatusConflict, err.Error())
	}
	equip.ID = id
	updateEquip, err := h.EquipService.UpdateEquip(&equip)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, updateEquip)
}

func (h *EquipmentHandler) GetNotOwnedEquipment(c *gin.Context) {
	id := c.Query("id")
	expeditionId, err := strconv.Atoi(id)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
	}

	equipment, err := h.EquipService.GetNotOwned(expeditionId)
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
		return
	}
	c.JSON(http.StatusOK, equipment)
}

func (h *EquipmentHandler) RegisterRoutes(router *gin.RouterGroup) *gin.RouterGroup {
	router.GET("/equip", h.GetEquip)
	router.POST("/equip", h.CreateEquip)
	router.PATCH("/equip", h.UpdateEquip)
	router.DELETE("/equip", h.DeleteEquip)
	router.GET("/not_owned_equip", h.GetNotOwnedEquipment)
	return router
}
