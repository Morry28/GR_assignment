import http from 'http'
import express from 'express'
import { sequelize } from './db'
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'
import UserRouter from './routes/users'
import AdminRouter from './routes/admin'
import {customReqValidation} from './utils/api/customReqValidation'
import os from 'os'
import { log } from './services/events'
import LogHandler from './services/events/logHandler'
import { languageLayer } from './utils/api/languageLayer'
import passport from 'passport'
import AuthRouter from './routes/auths'

//inicializujeme log file
LogHandler.initialize()

//Auto-optimalizacia pre matematicke asynchronne ulohy ( napr bcrypt ), automaticky rozsirime threadpool na max jadier
//v pripade ze cpu podporuje hyperthreading mame az dvojnasobok threadov
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString()
log('INFO','Prepinam z 4 threadov na ' + process.env.UV_THREADPOOL_SIZE)

//Middleware
const app = express()

//Inicializujeme baliky pre standardnu komunikaciu a nasu customValidation() fn na ochranu pred moznymi utokmi cez email a query
//requesty prechadzaju cez language layer ktori requestom priradi default 'language' header pokial ho nemaju ( v ramci DRY ) 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(languageLayer())
app.use(passport.initialize())
app.use(customReqValidation())

//routing na 4 hlavne API rozhrania
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())
app.use('/users', UserRouter())
app.use('/admin', AdminRouter())
app.use('/',AuthRouter())

const httpServer = http.createServer(app)

sequelize.sync()

console.log('Sync database', 'postgresql://localhost:5432/fitness_app')

httpServer.listen(8000).on('listening', () => console.log(`Server started at port ${8000}`))

export default httpServer


