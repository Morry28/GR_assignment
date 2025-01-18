import { stat } from "fs"
import { TStatus, TCustomLog } from "../../types/types"
import EventHandler from "./eventHandler"

export default class LogHandler extends EventHandler{
    static async log(status: TStatus, msg: string): Promise<void> {
        this.writeLog(status,msg)
    }
}

export const log:TCustomLog = LogHandler.log.bind(LogHandler)
