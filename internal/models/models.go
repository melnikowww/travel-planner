package models

type User struct {
	ID       int    `gorm:"primarykey" json:"id" example:"1"`
	Name     string `gorm:"type:varchar(100);not null" json:"name" example:"Alex"`
	Email    string `gorm:"type:varchar(100);uniqueIndex;not null" json:"email" example:"alex@example.com"`
	Password string `gorm:"type:varchar(100);not null" example:"password" json:"password"`
	Cars     []Car  `gorm:"foreignKey:user_id;constraint:OnDelete:CASCADE;" json:"cars"`
	Crews    []Crew `gorm:"many2many:crews_users;constraint:OnDelete:CASCADE;" json:"crews"`
}

type Car struct {
	ID     int    `gorm:"primaryKey" json:"id" example:"1"`
	Name   string `gorm:"type:varchar(100);not null" json:"name" example:"Toyota Land Cruiser 100"`
	UserID int    `json:"user_id"`
}

type Expedition struct {
	ID          int     `gorm:"primaryKey" json:"id" example:"1"`
	Name        string  `gorm:"type:varchar(100);not null" json:"name" example:"Karjala"`
	Description string  `gorm:"type:text" json:"description" example:"Good vibes only"`
	Points      []Point `gorm:"foreignKey:expedition_id;constraint:OnDelete:CASCADE;" json:"points"`
	Crews       []Crew  `gorm:"foreignKey:expedition_id;constraint:OnDelete:CASCADE;" json:"crews"`
}

type Point struct {
	ID           int    `gorm:"primaryKey" json:"id" example:"1"`
	Name         string `gorm:"type:varchar(100);not null" json:"name" example:"Teriberka"`
	Location     string `gorm:"type:varchar(100);not null" json:"location" example:"69.164529, 35.138287"`
	ExpeditionID int    `json:"expedition_id"`
}

type Crew struct {
	ID           int         `gorm:"primaryKey" json:"id" example:"1"`
	CarID        int         `gorm:"not null" json:"car_id" example:"13"`
	ExpeditionID int         `gorm:"not null" json:"expedition_id" example:"1"`
	DriverID     int         `gorm:"not null" json:"driver_id" example:"1"`
	Members      []User      `gorm:"many2many:crews_users;constraint:OnDelete:CASCADE;" json:"members"`
	Equipment    []Equipment `gorm:"foreignKey:crew_id;constraint:OnDelete:CASCADE;" json:"equipment"`
	Goods        []Good      `gorm:"foreignKey:crew_id;constraint:OnDelete:CASCADE;" json:"goods"`
}

type Equipment struct {
	ID     int    `gorm:"primaryKey" json:"id" example:"1"`
	Name   string `gorm:"type:varchar(100);not null" json:"name" example:"GPS Navigator"`
	CrewID int    `json:"crew_id"`
}

type Good struct {
	ID     int    `gorm:"primaryKey" json:"id" example:"1"`
	Name   string `gorm:"type:varchar(100);not null" json:"name" example:"First Aid Kit"`
	CrewID int    `json:"crew_id"`
}
