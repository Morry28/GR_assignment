import { Router, Request, Response, NextFunction } from 'express'

import { models, sequelize } from '../db'
import { isAdmin, isAuthorized } from '../services/auth'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { error } from '../services/events'
import { basicReqInfo } from '../helpers'
import { log } from '../services/events'

const {
    User_account,
    Exercise,
    Exercise_translation
} = models
//403 Forbidden
//201 Created
//200 OK
const router: Router = Router()

export default () => {
    //vytvor exercise
    // je potrebne do tela uviest translations: { sk: xxx}
    router.post('/exercises', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { name, translations, productID } = req.body
        const { sk } = translations
        if (!sk || !name) {
            error('NORMAL', '/admin/exercise missing requirements')

            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            const transaction = await sequelize.transaction()

            const results = await Exercise.create({
                name,
                productID: productID ?? null
            },
                { transaction }
            )

            await Exercise_translation.create(
                {
                    exerciseID: Exercise.id,
                    lang_code: 'sk',
                    name: sk,
                },
                { transaction }
            )

            await transaction.commit()

            log('INFO', 'New exercise created successfully,' + name)
            return res.status(201).json({
                data: results,
                message: resposeTranslation[language].EXERCISE_CREATED
            })
        }
        catch (e) {
            error('CRITICAL', '/admin/exercise, ' + e)

            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }

    })

    //zmen exercise
    /*
    template pre languages
    */
    router.patch('/exercises/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { id } = req.params
        const { name, translations, programID } = req.body
        const { sk } = translations


        if (!id || (!name && !sk)) {
            error('NORMAL', `/admin/exercise patch failed missing requirements like id or translation`)
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            const transaction = await sequelize.transaction()

            const exercise = await Exercise.findByPk(id, { transaction })
            if (!exercise) {
                error('NORMAL', `/admin/exercise patch failed, exercise id not found`)
                return res.status(404).json({
                    message: resposeTranslation[language].EXERCISE_NOT_FOUND
                })
            }

            if (name) {
                await exercise.update({
                    name,
                }, { transaction })
            }
            if (programID) {
                await exercise.update({
                    programID,
                }, { transaction })
            }

            if (sk) {
                const translation = await Exercise_translation.findOne({
                    where: {
                        exerciseID: id,
                        lang_code: 'sk'
                    },
                    transaction
                })

                if (translation) {
                    await translation.update({ name: sk }, { transaction })
                } else {
                    await Exercise_translation.create({
                        exerciseID: id,
                        lang_code: 'sk',
                        name: sk
                    },
                        { transaction }
                    )
                }
            }

            await transaction.commit()

            log('SUCCESS', `Exercise updated successfully, ID: ${id}`)
            return res.status(200).json({
                message: resposeTranslation[language].EXERCISE_UPDATED
            })
        } catch (e) {
            error('CRITICAL', `/admin/exercise update failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }



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