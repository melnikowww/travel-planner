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

func FirstNonEmptySlice(f []int32, s []int32) []int32 {
	if len(f) == 0 && len(s) == 0 {
		return f
	}
	if len(f) != 0 {
		return f
	}
	return s
}
