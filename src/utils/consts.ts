export const FIELD_LENGTHS = {
	DEFAULT_NAME: 200,
	USER_NAME: 100,
	SUR_NAME: 100,
	NICK_NAME: 50,
	EMAIL: 100,
	ROLE: 5,
	AGE: 3
} as const

export const knownQueries = {
	search: 'string',
	programID: 'number',
	limit: 'number',
	page: 'number'
} as const