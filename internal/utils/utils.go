package utils

func FirstNonEmpty(f string, s string) string {
	if f != "" {
		return f
	}
	return s
}
