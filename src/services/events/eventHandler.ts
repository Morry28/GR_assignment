import * as fs from 'fs/promises'
import * as path from 'path'
import { LOG_STATUS } from '../../utils/enums'
import { TStatus } from '../../types/types'

//SuperClass responsible for writing into file or creating it
export default abstract class EventHandler {
    private static filePath: string = path.resolve('./logs')
    private static fileName: string = 'serverLogs.txt'

    static async initialize(): Promise<void> {
        try {
            const fullPath = path.join(this.filePath, this.fileName)
            await fs.mkdir(this.filePath, { recursive: true })
            try {
                await fs.access(fullPath)
            } catch {
                await fs.writeFile(fullPath, '') 
            }
            await this.writeLog(LOG_STATUS.INITIALIZED, ' -------------------------------------------- \n')
        } catch (error) {
            console.error('Initialization failed:', error)
        }
    }

    static async writeLog(status: TStatus, msg: string): Promise<void> {
        try {
            const logMessage = `[${this.createTimestamp()}][${status}] ${msg}\n`
            const fullPath = path.join(this.filePath, this.fileName)

            await fs.appendFile(fullPath, logMessage)
        } catch (error) {
            console.error(`Error writing to log file: ${this.fileName},`, error)
        }
    }

    private static createTimestamp(): string {
        return new Date().toISOString()
    }
}
