import { Request, Response, NextFunction, Router } from "express"
import { resposeTranslation } from "../utils/api/multiLangResponse"
import { models } from "../db"
import bcrypt from 'bcrypt'
import { generateJwt } from "../services/auth"
import { error, log } from "../services/events"
import dotenv from 'dotenv'
import { basicReqInfo, generateGuestId } from '../helpers'
import { allowedRole } from "../helpers"
dotenv.config()

const router: Router = Router()

const {
    User_account

} = models

export default () => {
    
    //Register api for user
    router.post('/register', async (req: Request, res: Response, _next: NextFunction) => {

        const { language } = basicReqInfo(req)
        const { role, password, email } = req.body
        let hashedPass: string

        //ensure body is right
        if (!role || typeof role !== 'string' || !allowedRole(role) || typeof role !== 'string' || !password || typeof password !== 'string' || !email || typeof email !== 'string') {
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        try {
            //hash password (opSec + GDPR)
            hashedPass = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10))

        } catch (e) {
            error('NORMAL', `BCRYPT FAILED SERVER MIGHT BE OVERLOADED ! ( salt rounds: ${process.env.BCRYPT_SALT_ROUNDS}):  ${e}`)
            return res.status(503).json({
                message: resposeTranslation[language].SERVICE_UNAVAILABLE
            })
        }
        try {


            //insert user into db
            await User_account.create({
                email,
                password: hashedPass,
                role,
                nick_name: generateGuestId()
            })

            //in this case we seek id so user can be auto-logged
            const result = await User_account.findOne({
                where: {
                    email: email
                }
            })

            //create auth token
            const freshJwt = generateJwt({
                id: result.id,
                role,
                email
            })

            log('SUCCESS', 'A new user has been registered: ' + email + ' as ' + role)
            return res.status(200).json({
                data: freshJwt,
                message: resposeTranslation[language].SUCCESS
            })

        } catch (e) {
            error('NORMAL', `/register at user creation, ${e}`)

            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })
        }
    })

    //Login for an existing user
    router.post('/login', async (req: Request, res: Response, _next: NextFunction) => {

        const language = req.headers['language'] as string
        const { email, password } = req.body
        let userInfo
        if (!password || typeof password !== 'string' || !email || typeof email !== 'string') {
            return res.status(400).json({
                message: resposeTranslation[language].BAD_REQUEST
            })
        }

        //Attempt to fetch the user, and if an error occurs, the database is down
        try {

            const user = await User_account.findOne({
                where: {
                    email: email
                }
            })
            if (!user) return res.status(401).json({ message: resposeTranslation[language].UNAUTHORIZED })
            userInfo = user

        } catch (e) {

            error('NORMAL', `DATABASE could be OFFLINE, ${e}`)
            return res.status(500).json({
                message: resposeTranslation[language].SOMETHING_WENT_WRONG
            })

        }

        try {//Attempt hash pass, and if it fails, it's due to server overload
            const role = userInfo.role

            const isPassValid = await bcrypt.compare(password, userInfo.password)
            if (!isPassValid) return res.status(401).json({ message: resposeTranslation[language].UNAUTHORIZED })

            const freshJwt = generateJwt({
                id:userInfo.id,
                role,
                email: userInfo.email
            })

            return res.status(200).json({
                data: freshJwt,
                message: resposeTranslation[language].SUCCESS

            })
        } catch (e) {
            error('NORMAL', `/login at BCRYPT or JWT, ${e}`)
            return res.status(503).json({
                message: resposeTranslation[language].SERVICE_UNAVAILABLE
            })
        }


    })

    return router
}

