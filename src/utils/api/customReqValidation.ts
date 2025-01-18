import { resLanguage } from "../../helpers/resLanguage"
import { log } from "../../services/events"
import { resposeTranslation } from './multiLangResponse'
import { Request, Response, NextFunction } from "express"
import { maliciousPatterns } from "../consts"

export const customReqValidation = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        const language = resLanguage(req)
        const email = req.body.email

        if (email) {
            const emailCheckRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //trdo skopirovane
            if (!emailCheckRegex.test(email)) {

                log('WARNING', `Invalid email format | email: ${email} IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                return res.status(400).json({
                    message: resposeTranslation[language].INVALID_EMAIL
                })
            }
        }

        for (const pattern of maliciousPatterns) {
            if (pattern.test(email)) {

                log('ATTACK', `Attack FOUND | email: ${email} IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)

                return res.status(400).json({
                    message: resposeTranslation[language].INVALID_EMAIL
                })
            }
        }

        // posuvame request do api a prechadzame na dalsi request
        next()

    }
}

