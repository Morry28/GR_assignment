import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { resposeTranslation } from '../../utils/api/multiLangResponse'
import jwt from 'jsonwebtoken'
import { resLanguage } from '../../helpers/resLanguage'
import { log } from '../../services/events'

dotenv.config()

//Overenie user tokenu pri volani na chranene APIs
export const jwtValidation = (req: Request, res: Response, _next: NextFunction) => {

    const userToken = req.headers['authorization'].split(' ')[1]

    const language = resLanguage(req)
    if (!userToken) {
        log('WARNING',`Unauthorized API access attempt (missing token)| IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)
        return res.status(401).json({
            message: resposeTranslation[language].MISSING_TOKEN
        })
    }

    jwt.verify(userToken, process.env.JWT_SECRET_KEY)



}