import { Router, Request, Response, NextFunction } from 'express'

import { models } from '../db'
import { isAdmin, isAuthorized } from '../services/auth'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { error } from '../services/events'

const { User_account } = models
//403 Forbidden
//201 Created
//200 OK
const router: Router = Router()

export default () => {
    router.patch('/', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

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
    return router
}