import jwt from 'jsonwebtoken'

//FN for JWT decode, looks redundant imo
export const jwtDecode = (payload: string) => {
    return jwt.decode(payload)
}