import { Router, Request, Response, NextFunction } from 'express'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import bcrypt from 'bcrypt'
import { models } from '../db'
import { generateJwt } from '../services/auth/jwtGenerate'
import { isAuthorized } from '../services/auth'
import { log, error } from '../services/events'

const router: Router = Router()

const {
    User_account

} = models

export default () => {
    //Necitlive data iba pre reg users
    router.get('/', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {

        const language = req.headers['language'] as string
        try {
            const result = User_account.findAll({
                attributes: ['id', 'nick_name']
            })
            return res.status(200).json({
                data: result,
                message: resposeTranslation[language].LIST_OF_USERS
            })
        } catch (e) {
            error('NORMAL', 'Error at /users/ api endpoint while retrieving data from database: ' + e)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }


    })

    //registracia noveho usera



    return router
}