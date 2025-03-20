package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"travelPlanner/backend/models"
	"travelPlanner/backend/security"
	"travelPlanner/backend/services"
)

type LoginHandler struct {
	UserService *services.UserService
}

// LogIn Аутентификация пользователя
// @Summary Войти в систему
// @Description Аутентификация пользователя по email и паролю с получением JWT токена
// @Tags Аутентификация
// @Accept json
// @Produce json
// @Success 200 {object} map[string]string "JWT токен"
// @Failure 400 {object} map[string]string "Некорректный запрос"
// @Failure 401 {object} map[string]string "Неверные учетные данные"
// @Failure 500 {object} map[string]string "Ошибка генерации токена"
// @Router /login [post]
func (h *LoginHandler) LogIn(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := h.UserService.UserRepo.FindByEmail(credentials.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	if !security.CheckPasswordHash(user.Password, credentials.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	token, err := security.GenerateToken(user.Email, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	c.Set("Authorization", "Bearer "+token)
	c.JSON(http.StatusOK, gin.H{"token": token})
	c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
}

// Register Создание нового пользователя
// @Summary Создать пользователя
// @Description Регистрация нового пользователя в системе. Пароль автоматически хешируется.
// @Tags Аутентификация
// @Accept json
// @Produce json
// @Param user body models.User true "Данные пользователя" example({"name": "Иван Иванов", "email": "user@example.com", "password": "secret"})
// @Success 201 {object} models.User "Созданный пользователь"
// @Failure 400 {object} map[string]string "Некорректные входные данные"
// @Failure 409 {object} map[string]string "Конфликт данных (пользователь существует)"
// @Failure 500 {object} map[string]string "Внутренняя ошибка сервера"
// @Router /register [post]
func (h *LoginHandler) Register(c *gin.Context) {
	var user models.User
	var err error
	if err = c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	user.Password, err = security.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusConflict, "Password hash error")
	}
	id, err := h.UserService.CreateUser(&user)
	if id != 0 {
		user.ID = id
		c.JSON(http.StatusCreated, gin.H{"id": user.ID, "name": user.Name, "email": user.Email})
	} else {
		c.JSON(http.StatusConflict, err)
	}
}
