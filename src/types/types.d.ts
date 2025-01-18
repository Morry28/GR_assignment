export type TMultiLangResponseObject = {
    [key: string]: { [msg: string]: string }
}

export type TLogStatus = 'INITIALIZED' | 'ATTACK' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'LOG'
export type TErrorStatus = 'CRITICAL' | 'NORMAL'
export type TStatus = TLogStatus | TErrorStatus

export type TCustomLog = (status: TStatus, msg: string) => Promise<void>