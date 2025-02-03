package models

type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Car struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	EquipmentID []int  `json:"equipmentID"`
	GoodsID     []int  `json:"goodsID"`
}

type Expedition struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	PointsID []int  `json:"pointsID"`
	CrewID   []int  `json:"crewID"`
}

type Point struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Place string `json:"place"`
}

type Crew struct {
	ID           int   `json:"id"`
	CarID        int   `json:"carID"`
	MembersID    []int `json:"membersID"`
	ExpeditionID int   `json:"expeditionID"`
}

type Equipment struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Good struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
