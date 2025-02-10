package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"travelPlanner/internal/models"
	"travelPlanner/internal/services"
	"travelPlanner/internal/utils"
)

type CarsHandler struct {
	CarsService *services.CarsService
}

// Get godoc
// @Summary Получить автомобиль(и)
// @Description Получить список всех автомобилей или конкретный автомобиль по ID
// @Tags Автомобили
// @Produce json
// @Param id query int false "Идентификатор автомобиля (необязательно)"
// @Success 200 {object} []models.Car "Успешное получение списка автомобилей"
// @Success 200 {object} models.Car "Успешное получение автомобиля"
// @Failure 400 {string} string "Некорректный запрос"
// @Failure 404 {string} string "Автомобиль не найден"
// @Router /cars [get]
func (h *CarsHandler) Get(c *gin.Context) {
	key := c.Query("id")
	if key == "" {
		cars, err := h.CarsService.GetAllCars()
		if err != nil {
			c.JSON(http.StatusConflict, err)
		}
		c.JSON(http.StatusOK, &cars)
	} else {
		id, err := strconv.Atoi(key)
		if err != nil {
			c.JSON(http.StatusConflict, err)
		}
		car, err := h.CarsService.GetCar(id)
		if err != nil {
			c.Status(http.StatusBadRequest)
		}
		c.JSON(http.StatusOK, &car)
	}
}

// Create godoc
// @Summary Создать автомобиль
// @Description Добавить новый автомобиль в базу данных
// @Tags Автомобили
// @Accept json
// @Produce json
// @Param car body models.Car true "Данные автомобиля"
// @Success 201 {object} models.Car "Автомобиль успешно создан"
// @Failure 400 {string} string "Некорректные входные данные"
// @Failure 409 {string} string "Конфликт данных"
// @Router /cars [post]
func (h *CarsHandler) Create(c *gin.Context) {
	var car models.Car
	if err := c.ShouldBindJSON(&car); err != nil {
		c.JSON(http.StatusBadRequest, err)
	}
	id := h.CarsService.CreateCar(&car)
	if id != -1 {
		car.ID = id
		c.JSON(http.StatusCreated, &car)
	} else {
		c.Status(http.StatusConflict)
	}
}

// Update godoc
// @Summary Обновить автомобиль
// @Description Частичное обновление данных автомобиля
// @Tags Автомобили
// @Accept json
// @Produce json
// @Param id query int true "Идентификатор автомобиля"
// @Param car body models.Car true "Данные для обновления"
// @Success 200 {object} models.Car "Автомобиль успешно обновлен"
// @Failure 400 {string} string "Некорректный ID или данные"
// @Failure 404 {string} string "Автомобиль не найден"
// @Router /cars [patch]
func (h *CarsHandler) Update(c *gin.Context) {
	var newCar models.Car
	key := c.Query("id")
	id, err := strconv.Atoi(key)
	if err != nil {
		c.Status(http.StatusBadRequest)
	}
	if err := c.ShouldBindJSON(&newCar); err != nil {
		c.Status(http.StatusBadRequest)
	}
	oldCar, err := h.CarsService.GetCar(id)
	if err != nil {
		c.Status(http.StatusNotFound)
	}
	newCar.Name = utils.FirstNonEmptyString(newCar.Name, oldCar.Name)
	newCar.OwnerID = utils.FirstNonEmptyInt(newCar.OwnerID, oldCar.OwnerID)

	newCar.OwnerID = oldCar.OwnerID

	newCar.ID = id
	updateCar, err := h.CarsService.UpdateCar(&newCar)
	if err != nil {
		c.JSON(http.StatusConflict, err)
	}
	c.JSON(http.StatusOK, &updateCar)
}

// Delete godoc
// @Summary Удалить автомобиль
// @Description Удаление автомобиля по идентификатору
// @Tags Автомобили
// @Produce json
// @Param id query int true "Идентификатор автомобиля"
// @Success 204 "Автомобиль успешно удален"
// @Failure 400 {string} string "Некорректный ID"
// @Router /cars [delete]
func (h *CarsHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
	}
	if err = h.CarsService.DeleteCar(id); err != nil {
		c.Status(http.StatusConflict)
	}
	c.Status(http.StatusNoContent)
}

func (h *CarsHandler) RegisterRoutes(router *gin.Engine) *gin.Engine {
	router.GET("/cars", h.Get)
	router.POST("/cars", h.Create)
	router.PATCH("/cars", h.Update)
	router.DELETE("/cars", h.Delete)
	return router
}
