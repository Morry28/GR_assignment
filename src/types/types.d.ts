export type TMultiLangResponseObject = {
    [languageCode: string]: { [msg: string]: string }
}

export type TLogStatus = 'INITIALIZED' | 'ATTACK' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'LOG'
export type TErrorStatus = 'CRITICAL' | 'NORMAL'
export type TStatus = TLogStatus | TErrorStatus
export type TCustomLog = (status: TStatus, msg: string) => Promise<void>

export type TSupportedRoles = 'user' | 'admin'
export type TJwtObject = {

    role: TSupportedRoles,
    email: string,
    iat: number,
    exp: number

}