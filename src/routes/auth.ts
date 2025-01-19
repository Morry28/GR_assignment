import {Request,Response, NextFunction, Router } from "express"
import { resposeTranslation } from "../utils/api/multiLangResponse"
import { models } from "../db"
import bcrypt from 'bcrypt'
import { generateJwt } from "../services/auth"
import { error, log } from "../services/events"
import dotenv from 'dotenv'

dotenv.config()

const router: Router = Router()

const {
    User_account

} = models

export default () =>{
router.post('/register', async (req: Request, res: Response, _next: NextFunction) => {

    const language = req.headers['language'] as string
    const { role, password, email } = req.body
    let hashedPass: string

    if (!role || typeof role !== 'string' || !password || typeof password !== 'string' || !email || typeof email !== 'string') {
        return res.status(400).json({
            message: resposeTranslation[language].BAD_REQUEST
        })
    }

    try {
        hashedPass = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10))

    } catch (e) {
        error('CRITICAL', `BCRYPT FAILED at registration API, server might be overloaded ( salt rounds: ${process.env.BCRYPT_SALT_ROUNDS}): ` + e)
        return res.status(503).json({
            message: resposeTranslation[language].SOMETHING_WENT_WRONG
        })
    }
    try {
        const newUser = await User_account.create({
            email,
            password: hashedPass,
            role
        })

        const freshJwt = generateJwt({
            role,
            email
        })
        log('SUCCESS', 'A new user has been registered: ' + email + ' as ' + role)
        return res.status(200).json({
            data: freshJwt,
            message: resposeTranslation[language].SUCCESS
        })

    } catch (e) {
        error('WARNING', 'Registration failed at user creation, server might be overloaded: ' + e)
        return res.status(503).json({
            message: resposeTranslation[language].SOMETHING_WENT_WRONG
        })
    }
})

//login existujuceho usera
router.get('/login', async (req: Request, res: Response, _next: NextFunction) => { })

return router
}

