import http from 'http'
import express from 'express'
import { sequelize } from './db'
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'
import UserRouter from './routes/users'
import AdminRouter from './routes/admin'
import {customReqValidation} from './utils/api/customReqValidation'
import os from 'os'
import { EventHandler, log } from './services/events'

(async () => EventHandler.initialize())()

//Auto-optimalizacia pre matematicke asynchronne ulohy ( napr bcrypt )
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString()
log('INFO','Prepinam z 4 jadier na ' + process.env.UV_THREADPOOL_SIZE)

//Middleware
const app = express()

//Inicializujeme baliky pre standardnu komunikaciu a nasu customValidation() fn na ochranu pred moznymi utokmi cez email 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(customReqValidation())

//routing na 4 hlavne API rozhrania
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())
app.use('/users', UserRouter())
app.use('/admin', AdminRouter())


//Pouzivame express middleware + prometheus na lahke statistiky
app.use((req, res, next) => {
    //const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    req.headers['language'] || 'en'
    console.log(req.headers['language'] || 'en')


})

const httpServer = http.createServer(app)

sequelize.sync()

console.log('Sync database', 'postgresql://localhost:5432/fitness_app')

httpServer.listen(8000).on('listening', () => console.log(`Server started at port ${8000}`))

export default httpServer


