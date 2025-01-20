import { log } from "../../services/events"
import { resposeTranslation } from './multiLangResponse'
import { Request, Response, NextFunction } from "express"

//2. custom middleware na validaciu emailu ak je pritomny
export const customReqValidation = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        const language = req.headers['language'] as string
        const email = req.body.email

        if (email) {
            const emailStructureCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ //check pre strukturu emailu
            const forbiddenCharactersRegex =
             /[^a-zA-Z0-9._%+-@]|['";<>()\[\]{}\\\/&|`$]|(\b(SELECT|INSERT|DELETE|UPDATE|DROP|WHERE|UNION|EXEC|OR|AND|SLEEP|BENCHMARK|OUTFILE|SCRIPT|IFRAME|ONLOAD|ONERROR)\b)/i // just in case

             if (!emailStructureCheckRegex.test(email) ||  forbiddenCharactersRegex.test(email)) {

                log('ATTACK', `SQL ATTACK ON USER REGISTRATION email: '${email}' IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                return res.status(400).json({
                    message: resposeTranslation[language].INVALID_EMAIL
                })
            }
        }

        // posuvame request do routra api  
        next()

    }
}

