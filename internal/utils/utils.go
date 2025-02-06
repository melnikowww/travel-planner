package utils

func FirstNonEmptyString(f string, s string) string {
	if f != "" {
		return f
	}
	return s
}

func FirstNonEmptyInt(f int, s int) int {
	if &f != nil {
		return f
	}
	return s
}
