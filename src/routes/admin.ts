import { Router, Request, Response, NextFunction } from 'express'

import { models, sequelize } from '../db'
import { isAdmin, isAuthorized } from '../services/auth'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { error } from '../services/events'
import { basicReqInfo } from '../helpers'
import { log } from '../services/events'
import bcrypt from 'bcrypt'

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

    //create exercise
    // add also translations: { sk: xxx}
    router.post('/exercises', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { name, difficulty, translations, programID } = req.body
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
                difficulty,
                program_id: programID ?? null
            },
                { transaction }
            )

            await Exercise_translation.create(
                {
                    exercise_id: Exercise.id,
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
            error('NORMAL', '/admin/exercise, ' + e)

            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }

    })

    //change exercise, translation, name...
    router.patch('/exercises/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { id } = req.params
        const { name, translations, difficulty } = req.body
        const { sk } = translations


        if (!id || (!name && !sk)) {
            error('NORMAL', `/admin/exercise patch failed missing requirements like ID or translation`)
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
            if(difficulty){
                await exercise.update({
                    difficulty,

                }, { transaction })
            }

            if (sk) {
                const translation = await Exercise_translation.findOne({
                    where: {
                        exercise_id: id,
                        lang_code: 'sk'
                    },
                    transaction
                })

                if (translation) {
                    await translation.update({
                        name: sk
                    }, { transaction })
                } else {
                    await Exercise_translation.create({
                        exercise_id: id,
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
            error('NORMAL', `/admin/exercise update failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }



    })

    //vymaz exercise
    router.delete('/exercises/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { id } = req.params

        if (!id) {
            error('NORMAL', `/admin/exercise delete failed, missing exercise ID`)
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            const transaction = await sequelize.transaction()

            const exercise = await Exercise.findByPk(
                id,
                { transaction })

            if (!exercise) {
                error('NORMAL', `/admin/exercise delete failed, exercise ID not found: ${id}`)
                return res.status(404).json({
                    message: resposeTranslation[language].EXERCISE_NOT_FOUND
                })
            }

            await Exercise_translation.destroy({
                where: { exercise_id: id },
                transaction
            })

            await exercise.destroy({ transaction })

            await transaction.commit()

            log('SUCCESS', `Exercise deleted successfully, ID: ${id}`)
            return res.status(200).json({
                message: resposeTranslation[language].EXERCISE_DELETED
            })

        } catch (e) {
            error('NORMAL', `/admin/exercise delete failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //add exercise into program
    router.patch('/exercises/:id/program', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { id } = req.params
        const { programID } = req.body

        if (!id || !programID) {
            error('NORMAL', `/exercises program update failed, missing ID or programID`)
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            const transaction = await sequelize.transaction()

            const exercise = await Exercise.findByPk(
                id,
                { transaction })

            if (!exercise) {
                error('NORMAL', `/exercises program update failed, exercise ID not found: ${id}`)
                return res.status(404).json({
                    message: resposeTranslation[language].EXERCISE_NOT_FOUND
                })
            }
            
            await exercise.update({
                program_id:programID
            }, { transaction })

            await transaction.commit()

            log('SUCCESS', `Exercise program updated successfully, ID: ${id}, ProgramID: ${programID}`)
            return res.status(200).json({
                message: resposeTranslation[language].EXERCISE_PROGRAM_UPDATED
            })

        } catch (e) {
            error('NORMAL', `/exercises program update failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //delete exercise from program
    router.delete('/exercises/:id/program', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { id } = req.params

        if (!id) {
            error('NORMAL', `/exercises program removal failed, missing exercise ID`)
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            const transaction = await sequelize.transaction()

            const exercise = await Exercise.findByPk(
                id,
                { transaction })

            if (!exercise) {
                error('NORMAL', `/exercises program removal failed, exercise ID not found: ${id}`)
                return res.status(404).json({
                    message: resposeTranslation[language].EXERCISE_NOT_FOUND
                })
            }

            await exercise.update({
                program_id: null
            }, { transaction })

            await transaction.commit()

            log('SUCCESS', `Program removed successfully from exercise, ID: ${id}`)
            return res.status(200).json({
                message: resposeTranslation[language].EXERCISE_PROGRAM_REMOVED
            })
        } catch (e) {
            error('NORMAL', `/exercises program removal failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //all data one user
    router.get('/users/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { id } = req.params

        if (!id) {
            error('NORMAL', `/users fetch failed, missing user ID`)
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            // Find the user by ID
            const user = await User_account.findByPk(
                id,
            )

            if (!user) {
                error('NORMAL', `/users fetch failed, user ID not found: ${id}`)
                return res.status(404).json({
                    message: resposeTranslation[language].USER_NOT_FOUND
                })
            }

            return res.status(200).json({
                data: user,
                message: resposeTranslation[language].USER_DATA_FETCHED
            })
        } catch (e) {
            error('NORMAL', `/users fetch failed for ID: ${id}, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //all data all users
    router.get('/users', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)

        try {
            const users = await User_account.findAll()

            return res.status(200).json({
                data: users,
                message: resposeTranslation[language].USERS_DATA_FETCHED
            })
        } catch (e) {
            error('NORMAL', `/users fetch failed, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //change user data
    router.patch('/users/:id', isAuthorized, isAdmin, async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { id } = req.params
        const { name, sur_name, age, nick_name, email, password, role } = req.body
        let hashedPass
        if (!id) {
            error('NORMAL', `/users update failed, missing user ID`)
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            const transaction = await sequelize.transaction()

            //find the user by id
            const user = await User_account.findByPk(id, { transaction })
            if (!user) {
                error('NORMAL', `/users update failed, user ID not found: ${id}`)
                return res.status(404).json({
                    message: resposeTranslation[language].USER_NOT_FOUND
                })
            }

            //prepare updates
            const updates: any = {}
            if (name !== undefined) updates.name = name
            if (sur_name !== undefined) updates.sur_name = sur_name
            if (age !== undefined) updates.age = age
            if (nick_name !== undefined) updates.nick_name = nick_name
            if (email !== undefined) updates.email = email
            if (password !== undefined) {

                try {
                    //zahashuhashjeme password (opSec + GDPR)
                    hashedPass = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10))

                } catch (e) {
                    error('NORMAL', `BCRYPT FAILED SERVER MIGHT BE OVERLOADED ! ( salt rounds: ${process.env.BCRYPT_SALT_ROUNDS}): ${e}`)
                    return res.status(503).json({
                        message: resposeTranslation[language].SERVICE_UNAVAILABLE
                    })
                } updates.password = hashedPass
            }
            if (role !== undefined) updates.role = role

            // Update the user
            await user.update(updates, { transaction })
            await transaction.commit();

            log('SUCCESS', `User updated successfully, ID: ${id}`);
            return res.status(200).json({
                message: resposeTranslation[language].USER_UPDATED
            });
        } catch (e) {
            error('NORMAL', `/users update failed for ID: ${id}, ${e}`);
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            });
        }
    })
    return router
}