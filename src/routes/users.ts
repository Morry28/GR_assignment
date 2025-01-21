import { Router, Request, Response, NextFunction } from 'express'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { models, sequelize } from '../db'
import { isAuthorized } from '../services/auth'
import { log, error } from '../services/events'
import jwt from 'jsonwebtoken'
import { TJwtObject } from '../types/types'
import { basicReqInfo } from '../helpers'
import { ExerciseModel } from '../db/exercise'
import user_account from '../db/user_account'
import { Transaction } from 'sequelize'

const router: Router = Router()

const {
    User_account,
    User_account_Exercise,
    Completed_Exercise,
    Exercise,
    Exercise_translation

} = models

export default () => {

    //non-important data
    router.get('/', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)

        try {
            const result = await User_account.findAll({
                attributes: ['id', 'nick_name']
            })

            return res.status(200).json({
                data: result,
                message: resposeTranslation[language].LIST_OF_USERS
            })
        } catch (e) {
            error('NORMAL', ` at /users/ api endpoint while retrieving data from database: ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }


    })

    //User data
    router.get('/me', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {

        const { language, decoded } = basicReqInfo(req)

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
            error('NORMAL', `Error at /users/e api endpoint while retrieving data from database: ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }


    })
    //active exercises
    router.get('/exercises/active', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {
        const { language, decoded } = basicReqInfo(req)
        const userId = decoded.id

        try {
            const activeExercises = await User_account_Exercise.findAll({
                where: {
                    id: 1,
                },
                include: [
                    { all: true },
                    {
                        model: Exercise,
                        as: 'exercise',
                        include: [
                            {
                                model: Exercise_translation,
                                as: 'translations',
                                attributes: ['name'], 
                                where: {
                                    lang_code: 'sk' 
                                },
                                required: false 
                            }
                        ]
                    }
                ]
            })

            log('INFO', `Active exercises fetched for user ${userId}`)
            return res.status(200).json({
                data: activeExercises,
                message: resposeTranslation[language].ACTIVE_EXERCISES_FETCHED
            })
        } catch (e) {
            error('NORMAL', `/exercises/active fetch failed for user ${userId}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //ukoncene exercises
    router.get('/exercises/completed', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {
        const { language, decoded } = basicReqInfo(req)
        const userId = decoded.id

        try {
            const completedExercises = await Completed_Exercise.findAll({
                where: {
                    id: userId
                }
            })

            log('INFO', `Completed exercises fetched for user ${userId}`)
            return res.status(200).json({
                data: completedExercises,
                message: resposeTranslation[language].COMPLETED_EXERCISES_FETCHED
            })
        } catch (e) {
            error('NORMAL', `/exercises/completed fetch failed for user ${userId}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //delete from completed
    router.delete('/exercises/completed/:id', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {
        const { language, userToken, decoded } = basicReqInfo(req)
        const iserId = decoded.id
        const { id } = req.params

        if (!id) {
            error('NORMAL', `/exercises/completed delete failed, missing exercise ID`)
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            const completedExercise = await Completed_Exercise.findOne({
                where: {
                    id: id,
                    user_account_id: iserId
                }
            })

            if (!completedExercise) {
                error('NORMAL', `/exercises/completed delete failed, record not found`)
                return res.status(404).json({
                    message: resposeTranslation[language].EXERCISE_NOT_FOUND
                })
            }

            await completedExercise.destroy()

            log('SUCCESS', `Completed exercise deleted successfully, ID: ${id}`)
            return res.status(200).json({
                message: resposeTranslation[language].COMPLETED_EXERCISE_DELETED
            })
        } catch (e) {
            error('NORMAL', `/exercises/completed delete failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })
    return router
}