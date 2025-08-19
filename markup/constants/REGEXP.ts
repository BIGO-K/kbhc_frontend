export const REGEXP = {
	LOGIN_ID: /[a-zA-Z0-9]/,
	PASSWORD: /[a-zA-Z0-9{}[\]()<>/\\|,.?;:'"`~!@#$%^&*-_=+]/,
	NUMBER: /[0-9]/,
} as const;