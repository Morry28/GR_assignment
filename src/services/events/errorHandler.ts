import { TStatus } from '../../types/types'
import EventHandler from './eventHandler'

//Class responsible for handling errs
export default class ErrorHandler extends EventHandler {

    //only console err
    static async error(status:TStatus,msg: string): Promise<void> {
        await this.writeLog(status, msg)
        console.error(status,msg) 
    }
}

export const error = ErrorHandler.error.bind(ErrorHandler)
