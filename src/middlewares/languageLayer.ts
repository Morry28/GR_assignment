import { Request, Response, NextFunction } from "express"


//1. custom middleware na nastavenie jazyku komunikacie
export const languageLayer = () => {
    return (req: Request, _res: Response, next: NextFunction) =>{

        const languageHeader = req.headers['language']

        req.headers['language'] = Array.isArray(languageHeader)
            ? languageHeader[0]
            : languageHeader || 'en'

        // posuvame request do routra api  
        next()
    }
}