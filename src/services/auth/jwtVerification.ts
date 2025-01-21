import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
dotenv.config()

//Fn for validation
export const jwtVerification = (userToken: string): JwtPayload | null => {
    try {
        const result = jwt.verify(userToken, process.env.JWT_SECRET_KEY, {
            maxAge: process.env.JTW_TIME_RESTRICTION,
        }) as JwtPayload
        return result
    } catch (e) {
        return null
    }
}