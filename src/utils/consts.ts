export const FIELD_LENGTHS = {
	DEFAULT_NAME: 200,
	USER_NAME: 100,
	SUR_NAME: 100,
	NICK_NAME: 50,
	EMAIL: 100,
	ROLE: 5,
	AGE: 3
} as const

const maliciousPatterns = [ //GPT generated
    // SQL Injection
    /['"]/g,              // Jednoduché alebo dvojité úvodzovky
    /--/,                 // SQL komentáre
    /;/,                  // SQL ukončenie príkazu
    /\b(SELECT|INSERT|DELETE|UPDATE|DROP|WHERE|UNION|EXEC|OR|AND)\b/i,

    // XSS útoky
    /</g,                 // Otváracie HTML tagy
    />/g,                 // Zatváracie HTML tagy
    /script/i,            // Script tagy
    /on\w+=/i,            // HTML udalosti ako onclick

    // Path Traversal
    /\.\.\//,             // Cesta nadradenej zložky
    /\/etc\/passwd/,      // Pokus o prístup k citlivým súborom

    // Unicode útoky
    /[\x00-\x1F\x7F]/,    // ASCII kontrolné znaky
    /[\u202E\u200F]/,     // Unicode bidi override
]
