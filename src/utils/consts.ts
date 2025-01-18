export const FIELD_LENGTHS = {
	DEFAULT_NAME: 200,
	USER_NAME: 100,
	SUR_NAME: 100,
	NICK_NAME: 50,
	EMAIL: 100,
	ROLE: 5,
	AGE: 3
} as const

export const maliciousPatterns = [ //*GPT Generated
    // SQL Injection
    /['"]/g,                      // Jednoduché alebo dvojité úvodzovky
    /--/,                         // SQL komentáre
    /;/,                          // SQL ukončenie príkazu
    /\b(SELECT|INSERT|DELETE|UPDATE|DROP|WHERE|UNION|EXEC|OR|AND)\b/i, // Kľúčové slová SQL
    /\b(SLEEP|BENCHMARK|LOAD_FILE|OUTFILE)\b/i, // Špecifické SQL funkcie
    /\b(OR 1=1|AND 1=1|UNION SELECT)\b/i,      // Typické SQL injekcie

    // XSS útoky
    /<script.*?>.*?<\/script>/gi, // Script tagy
    /<.*?(on\w+|style|href|src)=.*?>/gi, // HTML atribúty na útoky
    /javascript:/i,               // JavaScript protokol
    /vbscript:/i,                 // VBScript protokol
    /data:/i,                     // Data URI schéma
    /<iframe.*?>.*?<\/iframe>/gi, // IFrame tagy
    /<img.*?src=.*?>/gi,          // Obrázky s podozrivými src

    // Path Traversal
    /\.\.\//g,                    // Navigácia do nadradenej zložky
    /\/etc\/passwd/,              // Linux heslá
    /\/proc\/self\/environ/,      // Linux procesné údaje
    /C:\\Windows\\System32/,      // Windows systémové súbory
    /boot.ini/,                   // Windows boot súbor

    // Unicode útoky
    /[\x00-\x1F\x7F]/,            // ASCII kontrolné znaky
    /[\u202E\u200F]/,             // Unicode bidi override
    /[\uFFFD]/,                   // Unicode náhradný znak
    /[\uD800-\uDFFF]/,            // Nepovolené surrogáty

    // NoSQL Injection
    /\{\s*\$ne\s*:/,              // MongoDB `$ne` operátor
    /\{\s*\$eq\s*:/,              // MongoDB `$eq` operátor
    /\{\s*\$gt\s*:/,              // MongoDB `$gt` operátor
    /\{\s*\$regex\s*:/,           // MongoDB `$regex` operátor

    // Remote Code Execution (RCE)
    /\b(eval|exec|system|popen|proc_open)\b/i, // Funkcie spúšťajúce príkazy
    /\$\{.*?\}/,                   // Dynamická evaluácia v šablónach
    /\(\s*.*?\s*\)\s*=>/,          // Arrow funkcie s podozrivými výrazmi

    // Command Injection
    /&\s*.*?;/,                   // Unix príkazy (napr. `ls; rm -rf /`)
    /\|/,                         // Pipelining príkazov
    /\`/,                         // Spúšťanie príkazov v shelli
    /\$\(/,                       // Spúšťanie príkazov v shelli
    /\b(cat|curl|wget|nc|bash|sh|powershell|cmd)\b/i, // Známe príkazy

    // Other Generic Patterns
    /\b(alert|prompt|confirm)\b/i, // JavaScript funkcie na XSS
    /base64,/i,                   // Base64 útoky
    /\b(load|open|include|require|import)\b/i // Dynamické načítanie zdrojov
];

