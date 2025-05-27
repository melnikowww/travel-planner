package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/backend/models"
	"travelPlanner/backend/services"
)

type MessagesHandler struct {
	Service *services.MessagesService
}

func (h *MessagesHandler) CreateMessage(c *gin.Context) {
	var message *models.Message
	var err error
	if err = c.ShouldBindJSON(&message); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	id, err := h.Service.CreateMessage(message)
	if id != 0 {
		message.ID = id
		c.JSON(http.StatusCreated, message)
	} else {
		c.JSON(http.StatusConflict, err)
	}
}

func (h *MessagesHandler) GetById(c *gin.Context) {
	key := c.Query("id")
	if key != "" {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
			return
		}
		message, err := h.Service.GetMessageById(id)
		if err != nil {
			c.String(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, &message)
	}
}

func (h *MessagesHandler) GetByConsumer(c *gin.Context) {
	key := c.Query("user")
	if key != "" {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.String(http.StatusBadRequest, err.Error())
			return
		}
		message, err := h.Service.GetMessagesByConsumer(id)
		if err != nil {
			c.String(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, &message)
	}
}

func (h *MessagesHandler) GetLastTen(c *gin.Context) {
	message, err := h.Service.GetMessagesLastTen()
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
		return
	}
	c.JSON(http.StatusOK, &message)
}

func (h *MessagesHandler) UpdateMessage(c *gin.Context) {
	var message *models.Message
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid message ID")
		return
	}
	if err = c.ShouldBindJSON(&message); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	message.ID = id
	updateMessage, err := h.Service.UpdateMessage(message)
	if err != nil {
		c.JSON(http.StatusConflict, err)
		return
	}
	c.JSON(http.StatusOK, updateMessage)
}

func (h *MessagesHandler) DeleteMessage(c *gin.Context) {
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid message ID")
		return
	}
	err = h.Service.DeleteMessage(id)
	if err != nil {
		c.String(http.StatusNotFound, "User not found")
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *MessagesHandler) RegisterRoutes(router *gin.RouterGroup) *gin.RouterGroup {
	router.POST("/message", h.CreateMessage)
	router.GET("/users_messages", h.GetByConsumer)
	router.GET("/last_messages", h.GetLastTen)
	router.GET("/message", h.GetById)
	router.DELETE("/messages", h.DeleteMessage)
	router.PATCH("/message", h.UpdateMessage)
	return router
}
