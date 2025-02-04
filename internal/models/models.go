package models

type User struct {
	ID    int    `json:"id" example:"1"`
	Name  string `json:"name" example:"Alex"`
	Email string `json:"email" example:"alex@example.com"`
}

type Car struct {
	ID          int    `json:"id" example:"1"`
	Name        string `json:"name" example:"Toyota Land Cruiser 100"`
	EquipmentID []int  `json:"equipmentID" example:"1,2,3"`
	GoodsID     []int  `json:"goodsID" example:"4,5"`
}

type Expedition struct {
	ID       int    `json:"id" example:"1"`
	Name     string `json:"name" example:"Karjala"`
	PointsID []int  `json:"pointsID" example:"1,2"`
	CrewID   []int  `json:"crewID" example:"3,4"`
}

type Point struct {
	ID    int    `json:"id" example:"1"`
	Name  string `json:"name" example:"Gas Station"`
	Place string `json:"place" example:"Karelia, Russia"`
}

type Crew struct {
	ID           int   `json:"id" example:"1"`
	CarID        int   `json:"carID" example:"13"`
	MembersID    []int `json:"membersID" example:"1,2"`
	ExpeditionID int   `json:"expeditionID" example:"1"`
}

type Equipment struct {
	ID   int    `json:"id" example:"1"`
	Name string `json:"name" example:"GPS Navigator"`
}

type Good struct {
	ID   int    `json:"id" example:"1"`
	Name string `json:"name" example:"First Aid Kit"`
}
