import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { resposeTranslation } from '../../utils/api/multiLangResponse'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { resLanguage } from '../../helpers/resLanguage'
import { log } from '../events'
dotenv.config()

//validacna fn
export const jwtValidation = (userToken: string): JwtPayload | null => {
    try {
        const result = jwt.verify(userToken, process.env.JWT_SECRET_KEY, {
            maxAge: process.env.JTW_TIME_RESTRICTION,
        }) as JwtPayload
        return result
    } catch (e) {
        return null
    }
}