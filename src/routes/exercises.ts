import { Router, Request, Response, NextFunction } from 'express'

import { models } from '../db'

const router: Router = Router()

const {
	Exercise,
	Program
} = models

export default () => {
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {
		const langCode = req.headers['language'] || 'en'

		const exercises = await Exercise.findAll({
			include: [{
				model: Program,
				as: 'program'
			}]
		})
		console.log(exercises)
		return res.status(200).send({
			data: exercises,
			message: 'List of exercises'
		})
	})
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {})

	return router
}
