package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/internal/models"
	"travelPlanner/internal/services"
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

func (h *ExpeditionHandler) CreateExpedition(c *gin.Context) {
	var expedition models.Expedition
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
	if err := c.ShouldBindJSON(&newExpedition); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	newExpedition.ID = id
	updatedExpedition, err := h.ExpService.UpdateExpedition(&newExpedition)
	if err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, updatedExpedition)
}

func (h *ExpeditionHandler) DeleteExpedition(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
	}
	if err := h.ExpService.DeleteExpedition(id); err != nil {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *ExpeditionHandler) RegisterRoutes(router *gin.Engine) *gin.Engine {
	router.GET("/expeditions", h.GetExpedition)
	router.POST("/expeditions", h.CreateExpedition)
	router.PATCH("/expeditions", h.UpdateExpedition)
	router.DELETE("/expeditions", h.DeleteExpedition)
	return router
}
