import {ROLES} from '../utils/enums'
export const allowedRole = (role:string):boolean =>{
    return Object.values(ROLES).includes(role as ROLES)
    
}