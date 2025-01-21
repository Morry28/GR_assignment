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
    Exercise

} = models

export default () => {

    //Necitlive data iba pre reg users, vsetci useri
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
            error('NORMAL', 'Error at /users/ api endpoint while retrieving data from database: ' + e)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }


    })

    //Userove data
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
            error('NORMAL', 'Error at /users/e api endpoint while retrieving data from database: ' + e)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }


    })
    //Aktivne exercises
    router.get('/exercises/active', isAuthorized, async (req: Request, res: Response, _next: NextFunction) => {
        const { language, decoded } = basicReqInfo(req)
        const userId = decoded.id

        try {
            const activeExercises = await User_account_Exercise.findAll({
                where: {
                    id: userId,
                    endedAt: null
                },
                include: [{ all: true }]
            })

            log('INFO', `Active exercises fetched for user ${userId}`)
            return res.status(200).json({
                data: activeExercises,
                message: resposeTranslation[language].ACTIVE_EXERCISES_FETCHED
            })
        } catch (e) {
            error('CRITICAL', `/exercises/active fetch failed for user ${userId}, ${e}`)
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
                },
                include: [
                    //{ model: Exercise, as: 'exercise' } 
                ]
            })

            log('INFO', `Completed exercises fetched for user ${userId}`)
            return res.status(200).json({
                data: completedExercises,
                message: resposeTranslation[language].COMPLETED_EXERCISES_FETCHED
            })
        } catch (e) {
            error('CRITICAL', `/exercises/completed fetch failed for user ${userId}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //vymazanie z completed
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
            error('CRITICAL', `/exercises/completed delete failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    router.post('/start', async (req: Request, res: Response, _next: NextFunction) => {
        const { language, userToken, decoded } = basicReqInfo(req)
        const userId = decoded.id
        const { id } = req.body
        try {
            const exercise = await Exercise.findByPk(id)


            const result = await User_account_Exercise.create({
                exercise_id: id,
                user_account_id: 1

            })

        } catch (e) {
            console.log(e)

        }
    })

    router.post('/end', async (req: Request, res: Response, _next: NextFunction) => {
        const { language, userToken, decoded } = basicReqInfo(req)
        const userId = decoded.id
        const { id } = req.body
        console.log('id', id)

        try {

            const userExercise = await User_account_Exercise.findByPk(id) //aktivna
            console.log(userExercise)
            const startedAt = new Date(userExercise.createdAt)
            const now = new Date()
            const diffSeconds = Math.ceil((now.getTime() - startedAt.getTime()) / 1000)

            const completed = await Completed_Exercise.create({ // ukoncena
                time_start: startedAt,
                time_end: now,
                duration: diffSeconds,
                user_account_id: 1,
                exercise_id: userExercise.id


            })

            const result = await User_account_Exercise.destroy({ //zavriet aktivnu
                where: {
                    id: userExercise.id
                }

            })


        } catch (e) {
            console.log(e)
        }
    })

    return router
}