import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { TJwtObject } from '../types/types'
export const basicReqInfo = (req: Request): { language: string, userToken: string, decoded: TJwtObject } => {
    const language = req.headers['language'] as string
    const userToken = req.headers['authorization'].split(' ')[1]

    const decoded = jwt.decode(userToken) as TJwtObject

    return { language, userToken, decoded }
}