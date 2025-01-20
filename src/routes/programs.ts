import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express'
import { resposeTranslation } from '../utils/api/multiLangResponse'

import { models } from '../db'
import { basicReqInfo } from '../helpers'

const router: Router = Router()

const {
	Program
} = models

export default () => {
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {

		const { language } = basicReqInfo(req)
		
		const programs = await Program.findAll()
		return res.json({
			data: programs,
			message: resposeTranslation[language].LIST_OF_PROGRAMS
		})
	})

	return router
}
