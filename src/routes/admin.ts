import { Router, Request, Response, NextFunction } from 'express'

import { models } from '../db'
import { isAdmin, isAuthorized } from '../services/auth'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { error } from '../services/events'
import { basicReqInfo } from '../helpers'

const { User_account } = models
//403 Forbidden
//201 Created
//200 OK
const router: Router = Router()

export default () => {
    //vytvor exercise
    /*
    template pre languages
    */
    router.post('/exercises', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

    })

    //zmen exercise
    /*
    template pre languages
    */
    router.patch('/exercises/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

    })

    //vymaz exercise
    router.delete('/exercises/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

    })

    //pridaj / odober exercise z programu
    router.post('/programs/:programID/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

    })

    //odober exercise z programu
    router.post('/programs/:programID/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

    })
    //Vsetky data jedneho usera
    router.get('/users/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

    })

    //Vsetci useri vsetky data
    router.get('/users', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

    })

    //Pridavanie attributov userovi
    router.patch('/users/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, userToken, decoded } = basicReqInfo(req)

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