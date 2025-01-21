import { stat } from "fs"
import { TStatus, TCustomLog } from "../../types/types"
import EventHandler from "./eventHandler"

//Class responsible for logs
export default class LogHandler extends EventHandler{
    static async log(status: TStatus, msg: string): Promise<void> {
        await this.writeLog(status,msg)
    }
}

export const log:TCustomLog = LogHandler.log.bind(LogHandler)
