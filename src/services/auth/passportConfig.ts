import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

passport.use(
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY
        }, (payload, result) => {
            if (payload) return result(null, payload)
            else return result(null, false)
        })
)

export default passport