import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { TJwtObject } from '../../types/types'
import { log, error } from '../../services/events'
import { resposeTranslation } from '../../utils/api/multiLangResponse'

//Auth layer --Only for admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {

    const userToken = req.headers['authorization'].split(' ')[1]
    const language = req.headers['language'] as string // uistujeme Ts ze to bude string a nie string[]

    try{
        const result = jwt.decode(userToken) as TJwtObject
        if(result.role !== 'admin'){
            log('INFO', `A non-Admin entity is trying to access admin API [DENIDED] | userID: ${result.id}, IP: ${req.ip}, Endpoint: ${req.originalUrl}, Method: ${req.method}`)
            return res.status(403).json({
                message: resposeTranslation[language].FORBIDDEN
            })
        }else(
            next()
        )

    }catch(e){
        error('CRITICAL', `(isAdmin)`+ e)

    }

}