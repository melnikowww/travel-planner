package utils

func FirstNonEmptyString(f string, s string) string {
	if f != "" {
		return f
	}
	return s
}

func FirstNonEmptyInt(f int, s int) int {
	if &f != nil && f != 0 {
		return f
	}
	return s
}

type Credentials struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
