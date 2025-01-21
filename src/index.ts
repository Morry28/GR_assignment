import express from 'express'
import { sequelize } from './db'
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'
import UserRouter from './routes/users'
import AdminRouter from './routes/admin'
import { customReqValidation } from './middlewares/customReqValidation'
import os from 'os'
import { log } from './services/events'
import LogHandler from './services/events/logHandler'
import { languageLayer } from './middlewares/languageLayer'
import passport from 'passport'
import AuthRouter from './routes/auths'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.APP_PORT
const URL = process.env.APP_URL

//Initialize the log file (./logs/serverLogs.txt), which will store both logs and errors
//Errors are not handled globally but are tailored to specific error types for easier debugging
LogHandler.initialize()

//Auto-optimization for mathematical asynchronous tasks (bcrypt in this case), automatically expanding the thread pool to the maximum number of threads
//If the CPU supports hyperthreading, the thread count is effectively doubled
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString()
log('INFO', 'Prepinam z 4 threadov na ' + process.env.UV_THREADPOOL_SIZE)

//Middleware
const app = express()

//Initialize packages for standard communication and our customValidation() function to protect against potential email and query attacks
//Requests pass through a language layer that assigns a default 'language' header if it is missing (DRY)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(languageLayer()) 
app.use(passport.initialize()) 
//2. Custom protection layer for emails and queries, with queries dynamic scanning 
app.use(customReqValidation())

//Routing for the 4 main API interfaces
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())
app.use('/users', UserRouter())
app.use('/admin', AdminRouter())
app.use('/', AuthRouter())

sequelize.sync()

app.listen(PORT,()=>{ console.log(`Server is running on ${URL}:${PORT}`)})

export default app


