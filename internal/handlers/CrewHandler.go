package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/internal/models"
	"travelPlanner/internal/services"
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
	id, err := h.CrewService.Create(crew)
	if id == 0 {
		c.String(http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, &crew)
}

func (h *CrewHandler) Update(c *gin.Context) {
	var crew *models.Crew
	if err := c.ShouldBindJSON(&crew); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	crew.ID = id
	updatedCrew, err := h.CrewService.Update(crew)
	if err != nil {
		c.Status(http.StatusConflict)
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
	if err = h.CrewService.Delete(id); err != nil {
		c.Status(http.StatusConflict)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *CrewHandler) RegisterRoutes(router *gin.Engine) *gin.Engine {
	router.GET("/crew", h.Get)
	router.POST("/crew", h.Create)
	router.PATCH("/crew", h.Update)
	router.DELETE("/crew", h.Delete)
	return router
}
