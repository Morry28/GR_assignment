import http from 'http'
import express from 'express'
import * as bodyParser from 'body-parser'

import { sequelize } from './db'
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'
import fs from 'fs'
import path from 'path'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())

app.use((req,res,next)=>{
    //const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
     req.headers['language'] || 'en'
    console.log(req.headers['language'] || 'en')

    
})

const httpServer = http.createServer(app)

sequelize.sync()

console.log('Sync database', 'postgresql://localhost:5432/fitness_app')

httpServer.listen(8000).on('listening', () => console.log(`Server started at port ${8000}`))

export default httpServer
