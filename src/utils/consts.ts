export const FIELD_LENGTHS = {
	DEFAULT_NAME: 200,
	USER_NAME: 100,
	SUR_NAME: 100,
	NICK_NAME: 50,
	EMAIL: 100,
	ROLE: 5,
	AGE: 3
} as const

//Query filter
export const KNOWN_QUERIES = {
	search: 'string',
	programID: 'number',
	limit: 'number',
	page: 'number'
} as const