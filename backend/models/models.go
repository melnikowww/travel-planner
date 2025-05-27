package models

import (
	"time"
)

type User struct {
	ID       int    `gorm:"primarykey" json:"id" example:"1"`
	Name     string `gorm:"type:varchar(100);not null" json:"name" example:"Alex"`
	Email    string `gorm:"type:varchar(100);uniqueIndex;not null" json:"email" example:"alex@example.com"`
	Password string `gorm:"type:varchar(100);not null" example:"password" json:"password"`
	ImageSrc string `json:"imageSrc,omitempty"`
	Cars     []Car  `gorm:"foreignKey:user_id;constraint:OnDelete:CASCADE;" json:"cars"`
	Crews    []Crew `gorm:"many2many:crews_users;constraint:OnDelete:CASCADE;" json:"crews"`
}

type Crew struct {
	ID             int         `gorm:"primaryKey" json:"id" example:"1"`
	CarID          int         `gorm:"not null" json:"car_id" example:"13"`
	ExpeditionID   int         `gorm:"not null" json:"expedition_id" example:"1"`
	DriverID       int         `gorm:"not null;constraint:OnDelete:CASCADE;" json:"driver_id" example:"1"`
	Members        []User      `gorm:"many2many:crews_users;constraint:OnDelete:CASCADE;" json:"members" swaggerignore:"true"`
	PassengerSeats int         `json:"seats" example:"1"`
	Equipment      []Equipment `gorm:"foreignKey:crew_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"equipment"`
	Goods          []Good      `gorm:"foreignKey:crew_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"goods"`
}

type Car struct {
	ID     int    `gorm:"primaryKey" json:"id" example:"1"`
	Name   string `gorm:"type:varchar(100);not null" json:"name" example:"Toyota Land Cruiser 100"`
	UserID int    `json:"user_id"`
}

type Expedition struct {
	ID          int         `gorm:"primaryKey" json:"id" example:"1"`
	Name        string      `gorm:"type:varchar(100);not null" json:"name" example:"Karjala"`
	Description string      `gorm:"type:text" json:"description" example:"Good vibes only"`
	CreatorID   int         `json:"creator_id"`
	StartsAt    time.Time   `json:"starts_at"`
	EndsAt      time.Time   `json:"ends_at"`
	Points      []Point     `gorm:"foreignKey:expedition_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"points"`
	Crews       []Crew      `gorm:"foreignKey:expedition_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"crews"`
	Equipment   []Equipment `gorm:"foreignKey:expedition_id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"equipment"`
}

type Point struct {
	ID           int    `gorm:"primaryKey" json:"id" example:"1"`
	Name         string `gorm:"type:varchar(100);not null" json:"name" example:"Teriberka"`
	Location     string `gorm:"type:varchar(100);not null" json:"location" example:"69.164529, 35.138287"`
	Position     int    `gorm:"type:bigint;" json:"position"`
	ExpeditionID int    `json:"expedition_id"`
}

type Equipment struct {
	ID           int    `gorm:"primaryKey" json:"id" example:"1"`
	Name         string `gorm:"type:varchar(100);not null" json:"name" example:"GPS Navigator"`
	ExpeditionId *int   `gorm:"index;foreignKey:ExpeditionId" json:"expedition_id,omitempty"`
	CrewID       *int   `gorm:"index;foreignKey:CrewID" json:"crew_id,omitempty"`
}

type Good struct {
	ID     int    `gorm:"primaryKey" json:"id" example:"1"`
	Name   string `gorm:"type:varchar(100);not null" json:"name" example:"First Aid Kit"`
	CrewID int    `json:"crew_id"`
}

type Message struct {
	ID           int         `gorm:"primaryKey" json:"id" example:"1"`
	Type         MessageType `gorm:"type:varchar(50);not null" json:"type" example:"CrewRequest"`
	ProducerId   int         `gorm:"type:bigint" json:"producerId,omitempty" example:"1"`
	ConsumerId   int         `gorm:"type:bigint" json:"consumerId,omitempty" example:"1"`
	CreatedAt    time.Time   `json:"CreatedAt"`
	Description  string      `gorm:"type:varchar(255)" json:"description,omitempty"`
	ExpeditionId int         `gorm:"type:bigint" json:"expeditionId,omitempty" example:"1"`
	CrewId       int         `gorm:"type:bigint" json:"crewId,omitempty" example:"1"`
}
