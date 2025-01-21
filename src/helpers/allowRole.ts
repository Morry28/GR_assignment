import {ROLES} from '../utils/enums'

//Is role valid?
export const allowedRole = (role:string):boolean =>{
    return Object.values(ROLES).includes(role as ROLES)
    
}