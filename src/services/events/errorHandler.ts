import { TStatus } from '../../types/types'
import EventHandler from './eventHandler'

export default class ErrorHandler extends EventHandler {

    static async error(status:TStatus,msg: string): Promise<void> {
        await this.writeLog(status, msg)
        console.error(status,msg) 
    }
}

export const error = ErrorHandler.error.bind(ErrorHandler)
