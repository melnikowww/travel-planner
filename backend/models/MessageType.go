package models

type MessageType string

const (
	CrewRequest   MessageType = "CrewRequest"
	News          MessageType = "News"
	NewExpedition MessageType = "NewExpedition"
)
