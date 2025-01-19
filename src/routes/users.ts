import { Router, Request, Response, NextFunction } from 'express'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { models } from '../db'
import { isAuthorized } from '../services/auth'
import { log, error } from '../services/events'
import jwt from 'jsonwebtoken'
import { TJwtObject } from '../types/types'
import { createDeflate } from 'zlib'

const router: Router = Router()

const {
    User_account

} = models

export default () => {
    //Necitlive data iba pre reg users, vsetci useri
    router.get('/', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {

        const language = req.headers['language'] as string

        try {
            const result = await User_account.findAll({
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
    //Userove data
    router.get('/me', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {

        const language = req.headers['language'] as string
        const userToken = req.headers['authorization'].split(' ')[1]

        const decoded = jwt.decode(userToken) as TJwtObject

        try {
            const result = await User_account.findOne({
                attributes: ['name', 'sur_name', 'age', 'nick_name', 'email', 'role', 'createdAt', 'deletedAt'],
                where: {
                    email: decoded.email
                }
            })
            if (!result) res.status(500).json({ message: resposeTranslation[language].SOMETHING_WENT_WRONG })
            console.log(result)

            return res.status(200).json({
                data: result,
                message: resposeTranslation[language].SUCCESS
            })
        } catch (e) {
            error('NORMAL', 'Error at /users/e api endpoint while retrieving data from database: ' + e)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }


    })
    //Aktivne exercises
    router.get('/excercises/active', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {})

    //Ukoncene exercises
    router.get('/excercises/completed', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {})


    return router
}