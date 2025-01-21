import { TMultiLangResponseObject } from '../../types/types'

//translator
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
        EXERCISE_CREATED: 'Exercise created successfully',
        EXERCISE_UPDATED: 'Exercise updated sucessfully,',
        EXERCISE_NOT_FOUND: 'Exercise not found',
        EXERCISE_DELETED: 'Exercise deleted sucessfully',
        EXERCISE_PROGRAM_UPDATED: 'Program of exercise updated successfully',
        EXERCISE_PROGRAM_REMOVED: 'Program was removed from exercise successfully',
        USER_NOT_FOUND:'User not found',
        USER_UPDATED: 'User updated sucessfully',
        COMPLETED_EXERCISE_DELETED: 'Completed exercise removed'

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
        SERVICE_UNAVAILABLE: 'Služba je momentalne nedostupná',
        FORBIDDEN: 'Zakázané: Nie ste admin',
        EXERCISE_CREATED: 'Cvik vytvorený',
        EXERCISE_UPDATED: 'Cvik bol úspešne zmenený',
        EXERCISE_NOT_FOUND: 'Cvik sa nenašiel',
        EXERCISE_DELETED: 'Cvik bol úspešne vymazaný',
        EXERCISE_PROGRAM_UPDATED: 'Úspešne ste zmenili program cviku',
        EXERCISE_PROGRAM_REMOVED: 'Program bol uspešne odstranený z cviku',
        USER_NOT_FOUND: 'Používateľ sa nenašiel',
        USER_UPDATED: 'Používateľ bol pozmenený',
        COMPLETED_EXERCISE_DELETED: 'Hotové cvičenie vymazané'



    }

} as const