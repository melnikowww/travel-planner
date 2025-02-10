package models

type User struct {
	ID       int    `gorm:"primarykey" json:"id" example:"1"`
	Name     string `gorm:"type:varchar(100);not null" json:"name" example:"Alex"`
	Email    string `gorm:"type:varchar(100);uniqueIndex;not null" json:"email" example:"alex@example.com"`
	Password string `gorm:"type:varchar(100);not null" example:"password"`
}

type Car struct {
	ID     int    `gorm:"primaryKey" json:"id" example:"1"`
	Name   string `gorm:"type:varchar(100);not null" json:"name" example:"Toyota Land Cruiser 100"`
	Owner  User   `gorm:"not null;foreignKey:UserID" json:"owner" example:"1"`
	UserID int
}

type Expedition struct {
	ID          int     `gorm:"primaryKey" json:"id" example:"1"`
	Name        string  `gorm:"type:varchar(100);not null" json:"name" example:"Karjala"`
	Description string  `gorm:"type:text" json:"description" example:"Good vibes only"`
	Points      []Point `gorm:"one2many:expeditions_points;" json:"points"`
	Crews       []Crew  `gorm:"one2many:expeditions_crews;" json:"crews"`
	PointsID    []int32
	CrewID      []int32
}

type Point struct {
	ID       int    `gorm:"primaryKey" json:"id" example:"1"`
	Name     string `gorm:"type:varchar(100);not null" json:"name" example:"Teriberka"`
	Location string `gorm:"type:varchar(100);not null" json:"location" example:"69.164529, 35.138287"`
}

type Crew struct {
	ID           int `gorm:"primaryKey" json:"id" example:"1"`
	CarID        int `gorm:"not null" json:"car_id" example:"13"`
	ExpeditionID int `gorm:"not null" json:"expedition_id" example:"1"`
	DriverID     int `gorm:"not null" json:"driver_id" example:"1"`
	MembersID    []int32
	Members      []User `gorm:"many2many:crews_users;" json:"members"`
	EquipmentID  []int32
	Equipment    []Equipment `gorm:"one2many:crew_equipment" json:"equipment"`
	GoodID       []int32
	Goods        []Good `gorm:"one2many:crew_goods" json:"goods"`
}
type Equipment struct {
	ID           int        `gorm:"primaryKey" json:"id" example:"1"`
	Name         string     `gorm:"type:varchar(100);not null" json:"name" example:"GPS Navigator"`
	Expedition   Expedition `gorm:"not null" json:"expedition_equips" example:"1"`
	ExpeditionID int
}

type Good struct {
	ID           int        `gorm:"primaryKey" json:"id" example:"1"`
	Name         string     `gorm:"type:varchar(100);not null" json:"name" example:"First Aid Kit"`
	Expedition   Expedition `gorm:"not null" json:"expedition_goods" example:"1"`
	ExpeditionID int
}
