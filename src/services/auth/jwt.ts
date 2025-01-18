import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { resposeTranslation } from '../../utils/multiLangResponse'
import { idText } from 'typescript'
import jwt from 'jsonwebtoken'

dotenv.config()

//Overenie user tokenu pri volani na chranene APIs
export const jwtValidation = (req: Request, res: Response, _next: NextFunction) => {

    const userToken = req.headers['authorization'].split(' ')[1]

    const language = Array.isArray(req.headers['language']) ?
        req.headers['language'][0] :
        req.headers['language'] || 'en'

    if (!userToken) {
        return res.status(401).json({
            message: resposeTranslation[language].MISSING_TOKEN
        })
    }

    jwt.verify(userToken, process.env.JWT_SECRET_KEY)



}