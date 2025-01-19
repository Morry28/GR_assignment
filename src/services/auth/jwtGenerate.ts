import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateJwt = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TIME_RESTRICTION,
  })
}
