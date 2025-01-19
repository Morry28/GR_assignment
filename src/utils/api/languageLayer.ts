import { Request, Response, NextFunction } from "express"

export const languageLayer = () => {
    return (req: Request, _res: Response, next: NextFunction) =>{

        const languageHeader = req.headers['language']

        req.headers['language'] = Array.isArray(languageHeader)
            ? languageHeader[0]
            : languageHeader || 'en'

        next()
    }
}