import { Request, Response, NextFunction } from "express"
import { jwtValidation } from './jwtValidation'
import { log } from "../events/logHandler"
import { resposeTranslation } from "../../utils/api/multiLangResponse"

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {

    const userToken = req.headers['authorization'].split(' ')[1]
    const language = req.headers['language'] as string // uistujeme Ts ze to bude string a nie string[]

    if (!userToken) {
        log('LOG', `Unauthorized API access attempt (missing token)| IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)
        return res.status(401).json({
            message: resposeTranslation[language].MISSING_TOKEN
        })
    }
    
    const isValid = jwtValidation(userToken)
    
    if (isValid) next()
    else return res.status(401).json({
        message: resposeTranslation[language].AUTHORIZE
    })



}