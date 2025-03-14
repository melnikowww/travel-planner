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
