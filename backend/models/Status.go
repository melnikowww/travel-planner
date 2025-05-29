package models

type Status string

const (
	active   Status = "active"
	approved Status = "approved"
	rejected Status = "rejected"
	empty    Status = "empty"
)
