package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
)

type FileHandler struct{}

// Upload Загрузка аватарки пользователя
// @Summary Загрузить аватар пользователя
// @Description Загрузка изображения аватара пользователя. Файл будет автоматически переименован в формат "avatar_<user_id>.jpg"
// @Tags Файлы
// @Accept multipart/form-data
// @Produce json
// @Security ApiKeyAuth
// @Param file formData file true "Файл изображения (jpg, png, gif)"
// @Success 200 {object} map[string]string "Сообщение об успешной загрузке"
// @Failure 400 {object} map[string]string "Ошибка при получении файла"
// @Failure 500 {object} map[string]string "Ошибка при сохранении файла"
// @Router /upload [post]
func (h *FileHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to retrieve the file",
		})
		return
	}
	fileName := "avatar_" + strconv.Itoa(c.MustGet("id").(int)) + ".jpg"
	//filepath.Ext(file.Filename)
	log.Printf(fileName)
	file.Filename = filepath.Clean(file.Filename) + ".jpg"
	log.Printf(filepath.Base(file.Filename))
	filePath := filepath.Join("frontend/src/uploads", fileName)
	log.Printf(filePath)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save the file",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("File '%s' uploaded successfully!", file.Filename),
	})
	c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
}

func (h *FileHandler) RegisterRoutes(router *gin.RouterGroup) *gin.RouterGroup {
	router.POST("/upload", h.Upload)
	return router
}
