import { Request, Response, NextFunction, Router } from "express"
import { resposeTranslation } from "../utils/api/multiLangResponse"
import { models } from "../db"
import bcrypt from 'bcrypt'
import { generateJwt } from "../services/auth"
import { error, log } from "../services/events"
import dotenv from 'dotenv'
import { jwtVerification } from "../services/auth/jwtVerification"
import { where } from "sequelize"
import { generateGuestId } from '../helpers'
dotenv.config()

const router: Router = Router()

const {
    User_account

} = models

export default () => {

    router.post('/register', async (req: Request, res: Response, _next: NextFunction) => {

        const language = req.headers['language'] as string
        const { role, password, email } = req.body
        let hashedPass: string

        //uistime sa ze telo je ok
        if (!role || typeof role !== 'string' || !password || typeof password !== 'string' || !email || typeof email !== 'string') {
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            //zahashujeme password (opSec + GDPR)
            hashedPass = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10))

        } catch (e) {
            error('CRITICAL', `BCRYPT FAILED SERVER IS OVERLOADED, SCALE IMMEDIATELY ! ( salt rounds: ${process.env.BCRYPT_SALT_ROUNDS}): ` + e)
            return res.status(503).json({
                message: resposeTranslation[language].SERVICE_UNAVAILABLE
            })
        }
        try {
            //vytvorime autorizacny token
            const freshJwt = generateJwt({
                role,
                email
            })
            //insertneme usera do db
            await User_account.create({
                email,
                password: hashedPass,
                role,
                nick_name: generateGuestId()
            })

            log('SUCCESS', 'A new user has been registered: ' + email + ' as ' + role)
            return res.status(200).json({
                data: freshJwt,
                message: resposeTranslation[language].SUCCESS
            })

        } catch (e) {
            error('CRITICAL', '/register at user creation, ' + e)

            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //login existujuceho usera
    router.post('/login', async (req: Request, res: Response, _next: NextFunction) => {

        const language = req.headers['language'] as string
        const { email, password } = req.body
        let userInfo
        if (!password || typeof password !== 'string' || !email || typeof email !== 'string') {
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        //skusime ziskat usera a ak nastane chyba db je down
        try {

            const user = await User_account.findOne({
                where: {
                    email: email
                }
            })
            if (!user) return res.status(401).json({ message: resposeTranslation[language].UNAUTHORIZED })
            userInfo = user

        } catch (e) {

            error('CRITICAL', 'DATABASE could be OFFLINE, ' + e)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })

        }

        try {// skusime finalizovat poziadavku a ak zlyha je to kvoli plnemu zatazeniu servera
            const role = userInfo.role

            const isPassValid = await bcrypt.compare(password, userInfo.password)
            if (!isPassValid) return res.status(401).json({ message: resposeTranslation[language].UNAUTHORIZED })

            const freshJwt = generateJwt({
                role,
                email: userInfo.email
            })

            return res.status(200).json({
                data: freshJwt,
                message: resposeTranslation[language].SUCCESS

            })
        } catch (e) {
            error('CRITICAL', '/login at BCRYPT or JWT, ' + e)
            return res.status(503).json({
                message: resposeTranslation[language].SERVICE_UNAVAILABLE
            })
        }


    })

    return router
}

