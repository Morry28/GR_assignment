import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { TJwtObject } from '../types/types'

//Fn that helps keep clean "neck" of API, returns basic info from req if avalible
export const basicReqInfo = (req: Request): { language: string, userToken?: string, decoded?: TJwtObject } => {

    const language = req.headers['language'] as string
    let userToken
    let decoded

    if (req.headers['authorization']) {
        userToken = req.headers['authorization'].split(' ')[1]
        decoded = jwt.decode(userToken) as TJwtObject

        return { language, userToken, decoded  }

    } else {

        return { language }
    }


}