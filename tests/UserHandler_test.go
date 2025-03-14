package tests

//
//import (
//	"bytes"
//	"encoding/json"
//	"github.com/gin-gonic/gin"
//	"github.com/stretchr/testify/assert"
//	"github.com/stretchr/testify/mock"
//	"net/http"
//	"net/http/httptest"
//	"testing"
//	"travelPlanner/backend/models"
//	"travelPlanner/mocks"
//)
//
//func TestRegisterHandler(t *testing.T) {
//	router := gin.Default()
//	//userService := mocks.
//	loginHandler := &LoginHandler{UserService: userService}
//	router.POST("/register", loginHandler.Register)
//
//	user := models.User{
//		Name:     "Alice",
//		Email:    "alice@example.com",
//		Password: "password123",
//	}
//
//	userService.On("CreateUser", mock.AnythingOfType("*models.User")).
//		Return(1, nil).Once()
//
//	userJSON, _ := json.Marshal(user)
//	req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(userJSON))
//	req.Header.Set("Content-Type", "application/json")
//
//	rr := httptest.NewRecorder()
//	router.ServeHTTP(rr, req)
//
//	assert.Equal(t, http.StatusCreated, rr.Code)
//	assert.JSONEq(t, `{"id":1,"name":"Alice","email":"alice@example.com"}`, rr.Body.String())
//	userService.AssertExpectations(t)
//}
