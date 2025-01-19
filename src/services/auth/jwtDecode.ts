import jwt from 'jsonwebtoken'

export const jwtDecode = (payload: string) => {
    return jwt.decode(payload)
}