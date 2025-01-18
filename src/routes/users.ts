import { Router, Request, Response, NextFunction } from 'express'

import { models } from '../db'


const router:Router = Router()

export default ()=>{
        //Necitlive data iba pre reg users
        router.get('/', async (req: Request, res: Response, _next: NextFunction) => {})
        
        //registracia noveho usera
        router.get('/register', async (req: Request, res: Response, _next: NextFunction) => {})

        //login existujuceho usera
        router.get('/login', async (req: Request, res: Response, _next: NextFunction) => {})

    


    return router
}