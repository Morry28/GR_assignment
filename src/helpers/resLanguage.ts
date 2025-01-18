import { Request } from "express"

export const resLanguage = (req:Request):string => {
    return Array.isArray(req.headers['language']) 
    ? req.headers['language'][0] 
    : req.headers['language'] || 'en'
}