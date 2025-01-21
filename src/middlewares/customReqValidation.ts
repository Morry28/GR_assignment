import { idText } from "typescript"
import { log } from "../services/events"
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { Request, Response, NextFunction } from "express"
import { knownQueries } from '../utils/consts'
//2. custom middleware na validaciu emailu ak je pritomny
export const customReqValidation = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        const language = req.headers['language'] as string
        const email = req.body.email
        const queries = req.query as Record<string, string | undefined>

        if (email) {
            const emailStructureCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ //check pre strukturu emailu
            const forbiddenCharactersRegex = //check pre utok
                /[^a-zA-Z0-9._%+-@]|['"<>()\[\]{}\\\/&|`$]|(\b(SELECT|INSERT|DELETE|UPDATE|DROP|WHERE|UNION|EXEC|OR|AND|SLEEP|BENCHMARK|OUTFILE|SCRIPT|IFRAME|ONLOAD|ONERROR)\b)/i // just in case

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

                //overime ci je nazov query v zozname povolenych query
                if (key in knownQueries) {
                    //zistime aky typ ma byt querina
                    const expectedType = knownQueries[key as keyof typeof knownQueries]

                    //overime ci to co sa tvari ako cislo je cislo a zaroven spravne cislo
                    if (expectedType === 'number' && !(Number(value) % Number(value) === 0) && !validNums.test(value)) {
                        log('ATTACK', `POSSIBLE SQL ATTACK intercepted in middleware query: '${key}' '${value}', email: '${email}', IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                        res.status(400).json({
                            message: resposeTranslation[language].BAD_QUERY,
                        })
                        return

                        //overime ci to co sa tvari ako string splna bezpecnostne rozhranie
                    } else if (expectedType === 'string' && !validSearch.test(value)) {
                        log('ATTACK', `POSSIBLE SQL ATTACK intercepted in middleware query: '${key}' '${value}', email: '${email}', IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                        res.status(400).json({
                            message: resposeTranslation[language].BAD_QUERY,
                        })
                        return
                    }

                    //Ak je zly nazov query zaregistrujeme to ( mozno zbytocne )
                } else {
                    log('LOG', `invalid query: '${key}' '${value}', email: '${email}', IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                    res.status(400).json({
                        message: resposeTranslation[language].BAD_QUERY,
                    })
                    return
                }
            }
        }

        // posuvame request do routra api  
        next()

    }
}

