import { resLanguage } from "../../helpers"
import { log } from "../../services/events"
import { resposeTranslation } from './multiLangResponse'
import { Request, Response, NextFunction } from "express"
import { maliciousPatterns } from "../consts"

export const customReqValidation = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        const language = resLanguage(req)
        const email = req.body.email

        if (email) {
            const emailCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ //check pre strukturu emailu
            const forbiddenCharactersRegex = /[^a-zA-Z0-9._%+-@]/ // check pre znaky pouzivane pri utokoch
            console.log('checking email')
            if (!emailCheckRegex.test(email) ||  forbiddenCharactersRegex.test(email)) {

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

