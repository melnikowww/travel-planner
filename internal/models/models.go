package models

// Done
type User struct {
	ID       int    `json:"id" example:"1"`
	Name     string `json:"name" example:"Alex"`
	Email    string `json:"email" example:"alex@example.com"`
	Password string `json:"password" example:"password"`
}

// Done
type Car struct {
	ID      int    `json:"id" example:"1"`
	Name    string `json:"name" example:"Toyota Land Cruiser 100"`
	OwnerID int    `json:"owner_id" example:"1"`
}

// Done
type Expedition struct {
	ID          int     `json:"id" example:"1"`
	Name        string  `json:"name" example:"Karjala"`
	Description string  `json:"description" example:"Good vibes only"`
	PointsID    []int32 `json:"points_id" example:"1,2"`
	CrewID      []int32 `json:"crew_id" example:"3,4"`
}

// Done
type Point struct {
	ID       int    `json:"id" example:"1"`
	Name     string `json:"name" example:"Teriberka"`
	Location string `json:"location" example:"69.164529, 35.138287"`
}

type Crew struct {
	ID           int     `json:"id" example:"1"`
	CarID        int     `json:"car_id" example:"13"`
	ExpeditionID int     `json:"expedition_id" example:"1"`
	DriverID     int     `json:"driver_id" example:"1"`
	MembersID    []int32 `json:"members_id" example:"1,2"`
	EquipmentID  []int32 `json:"equipment_id" example:"1,2"`
	GoodID       []int32 `json:"good_id" example:"1,2"`
}

// Done
type Equipment struct {
	ID           int    `json:"id" example:"1"`
	Name         string `json:"name" example:"GPS Navigator"`
	ExpeditionID int    `json:"expedition_id" example:"1"`
}

// Done
type Good struct {
	ID           int    `json:"id" example:"1"`
	Name         string `json:"name" example:"First Aid Kit"`
	ExpeditionID int    `json:"expedition_id" example:"1"`
}
