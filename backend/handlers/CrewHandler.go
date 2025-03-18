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
