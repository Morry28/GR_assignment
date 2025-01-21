import { idText } from "typescript"
import { log } from "../services/events"
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { Request, Response, NextFunction } from "express"
import { KNOWN_QUERIES } from '../utils/consts'

//2. custom middleware for emails and query validation
export const customReqValidation = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        const language = req.headers['language'] as string
        const email = req.body.email
        const queries = req.query as Record<string, string | undefined>

        if (email) {
            //check emailu
            const emailStructureCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ 
            //check for attack
            const forbiddenCharactersRegex = /[^a-zA-Z0-9._%+-@]|['"<>()\[\]{}\\\/&|`$]|(\b(SELECT|INSERT|DELETE|UPDATE|DROP|WHERE|UNION|EXEC|OR|AND|SLEEP|BENCHMARK|OUTFILE|SCRIPT|IFRAME|ONLOAD|ONERROR)\b)/i // just in case

            if (forbiddenCharactersRegex.test(email)) {

                log('ATTACK', `SQL ATTACK intercepted in middlewate (email) email: '${email}' IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                return res.status(400).json({
                    message: resposeTranslation[language].INVALID_EMAIL
                })
            }
            if (!emailStructureCheckRegex.test(email)) {
                log('WARNING', `Invalid email: '${email}' IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                return res.status(400).json({
                    message: resposeTranslation[language].INVALID_EMAIL
                })
            }
        }
        if (queries) {
            const validNums = /^\d+$/
            const validSearch = /^[a-zA-Z0-9._%+-]*$/
            const dataEntries = Object.entries(queries)

            for (const [key, value] of dataEntries) {

                //ensure query passes filter
                if (key in KNOWN_QUERIES) {
                    //check query type
                    const expectedType = KNOWN_QUERIES[key as keyof typeof KNOWN_QUERIES]

                    //ensure that what seems like a number is really a number and also valid number
                    if (expectedType === 'number' && !(Number(value) % Number(value) === 0) && !validNums.test(value)) {
                        log('ATTACK', `POSSIBLE SQL ATTACK intercepted in middleware query: '${key}' '${value}', email: '${email}', IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                        res.status(400).json({
                            message: resposeTranslation[language].BAD_QUERY,
                        })
                        return

                        //ensure that what seems like string is valid string
                    } else if (expectedType === 'string' && !validSearch.test(value)) {
                        log('ATTACK', `POSSIBLE SQL ATTACK intercepted in middleware query: '${key}' '${value}', email: '${email}', IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                        res.status(400).json({
                            message: resposeTranslation[language].BAD_QUERY,
                        })
                        return
                    }

                    //if query is not in filter log it ( perhaps redundant )
                } else {
                    log('LOG', `invalid query: '${key}' '${value}', email: '${email}', IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                    res.status(400).json({
                        message: resposeTranslation[language].BAD_QUERY,
                    })
                    return
                }
            }
        }

        // pass req into api router
        next()

    }
}

