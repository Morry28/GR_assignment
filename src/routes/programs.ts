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
	Program,
	Program_translation
} = models

export default () => {
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {

		const { language } = basicReqInfo(req)

		const programs = await Program.findAll({
			include: [{
				model: Program,
				as: 'program',
				include: [
					{
						model: Program_translation,
						as: 'translations',
						attributes: ['name'], 
						where: {
							lang_code: language
						},
						required: false
					}
				]
			}]
		})
		return res.json({
			data: programs,
			message: resposeTranslation[language].LIST_OF_PROGRAMS
		})
	})

	return router
}
