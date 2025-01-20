import { TMultiLangResponseObject } from '../../types/types'

//translator podla language code
export const resposeTranslation: TMultiLangResponseObject = {
    en: {
        MISSING_TOKEN: 'Authorization failed: Token is missing',
        INVALID_TOKEN: 'Authorization failed: Invalid Token',
        INVALID_EMAIL: 'Invalid Email',
        LIST_OF_USERS: 'List of users',
        LIST_OF_PROGRAMS: 'List of programs',
        LIST_OF_EXERCISES: 'List of exercises',
        SOMETHING_WENT_WRONG: 'Something went wrong, try again later',
        BAD_REQUEST: 'Request is missing attributes',
        BAD_QUERY: 'Query isn`t good',
        UNAUTHORIZED: 'Invalid email or password',
        AUTHORIZE: 'Please log in',
        SUCCESS: 'Success',
        SERVICE_UNAVAILABLE: 'Service is currently unavalible',
        FORBIDDEN: 'Forbidden: You do not have admin privileges.',
        EXERCISE_CREATED:'Exercise created successfully',
        
    },
    sk: {
        MISSING_TOKEN: 'Autorizácia zlyhala: Chýba Token',
        INVALID_TOKEN: 'Autorizácia zlyhala: Neplatný Token',
        INVALID_EMAIL: 'Neplatný email',
        LIST_OF_USERS: 'Zoznam používateľov',
        LIST_OF_PROGRAMS: 'Zoznam treningových programov',
        LIST_OF_EXERCISES: 'Zoznam cvičení',
        SOMETHING_WENT_WRONG: 'Niečo sa pokazilo, skúste to znova o chvíľu',
        BAD_REQUEST: 'Nekompletná požiadavka',
        BAD_QUERY: 'Query nie je dobrá',
        UNAUTHORIZED: 'Neplatný email alebo heslo',
        AUTHORIZE: 'Prihláste sa prosím',
        SUCCESS: 'Úspešné',
        SERVICE_UNAVAILABLE:'Služba je momentalne nedostupná',
        FORBIDDEN: 'Zakázané: Nie ste admin',
        EXERCISE_CREATED:'Cvik vytvorený',


    }

} as const