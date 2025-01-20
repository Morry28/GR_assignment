import { Router, Request, Response, NextFunction } from 'express'

import { models } from '../db'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { basicReqInfo } from '../helpers'

const router: Router = Router()

const {
	Exercise,
	Program
} = models

export default () => {
	router.get('/?', async (req: Request, res: Response, _next: NextFunction) => {
		
		const { language } = basicReqInfo(req)
		const { page, limit, programID, search } = req.query
		
		const exercises = await Exercise.findAll({
			include: [{
				model: Program,
				as: 'program'
			}]
		})
		console.log(exercises)
		return res.status(200).send({
			data: exercises,
			message: resposeTranslation[language].LIST_OF_EXERCISES
		})
	})
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {})

	return router
}
