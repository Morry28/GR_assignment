import { Router, Request, Response, NextFunction } from 'express'

import { models } from '../db'
import { resposeTranslation } from '../utils/api/multiLangResponse'
import { basicReqInfo } from '../helpers'
import { Op, Sequelize } from 'sequelize'
import { error } from '../services/events'

const router: Router = Router()

const {
	Exercise,
	Program,
	Exercise_translation,
	Program_translation
} = models

export default () => {
	router.get('/?', async (req: Request, res: Response, _next: NextFunction) => {

		const { language } = basicReqInfo(req)
		const { page = 1, limit = 100, programID, search } = req.query
		const querySearch = search ? search.toString().toLowerCase().trim() : null
		const pagination = (Number(page) - 1) * Number(limit)

		const include: any[] = []

		if (programID) {
			include.push({
				model: Program,
				as: 'program',
				where: {
					id: programID
				},
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
			})
		} else {
			include.push({
				model: Program,
				as: 'program',
				include: [
					{
						model: Program_translation,
						as: 'translations',
						attributes: ['name'], //na FE sa da k tomu dostat data.rows[x].program.translations[0]?.name ?? data.rows[x].program.name
						where: {
							lang_code: language
						},
						required: false
					}
				]
			})
		}

		if (language != 'en') {
			include.push({
				model: Exercise_translation,
				as: 'translations',
				attributes: ['name'], //na FE sa da k tomu dostat data.rows[x].translations[0]?.name ?? data.rows[x].name
				where: {
					lang_code: language,
					...(querySearch && {
						name: {
							[Op.iLike]: `%${querySearch}%`
						}
					})
				},
				required: true
			})
		}

		try {
			const results = await Exercise.findAndCountAll({
				where: programID ? { programID: programID } : {},
				include,
				limit: Number(limit),
				offset: pagination,

			})

			return res.status(200).json({
				data: results,
				total: results.count,
				currentPage: Number(page),
				limitUsed: limit,
				totalPages: Math.ceil(results.count / Number(limit)),
				message: resposeTranslation[language].SUCCESS
			})


		} catch (e) {
			error('CRITICAL', '/exercise, ' + e)

			return res.status(500).json({
				message: resposeTranslation[language].SOMETHING_WENT_WRONG
			})
		}


	})
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {

		const { language } = basicReqInfo(req)

		const include: any[] = []

		if (language !== 'en') {
			include.push({
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
			})
		} else {
			include.push([{
				model: Program,
				as: 'program'
			}])
		}
		try {
			const exercises = await Exercise.findAll({
				include
			})
			console.log(exercises)
			return res.status(200).send({
				data: exercises,
				message: resposeTranslation[language].LIST_OF_EXERCISES
			})
		} catch (e) {
			error('CRITICAL', '/exercise , ' + e)

			return res.status(500).json({
				message: resposeTranslation[language].SOMETHING_WENT_WRONG
			})
		}
	})

	return router
}
