import { models, sequelize } from './db/index'
import { EXERCISE_DIFFICULTY } from './utils/enums'

const {
	Exercise,
	Program,
	Exercise_translation,
	Program_translation
} = models

const seedDB = async () => {
	await sequelize.sync({ force: true })

	const programs = await Program.bulkCreate([{
		name: 'Push'
	}, {
		name: 'Pull'
	}, {
		name: 'Legs'
	}] as any[], { returning: true })

	await Program_translation.bulkCreate([
		{ programID: programs[0].id, lang_code: 'sk', name: 'Tlaky' },
		{ programID: programs[1].id, lang_code: 'sk', name: 'Príťahy' },
		{ programID: programs[2].id, lang_code: 'sk', name: 'Nohy' },
	])

	const exercises = await Exercise.bulkCreate([{
		name: 'Bench press',
		difficulty: EXERCISE_DIFFICULTY.HARD,
		programID: 1
	}, {
		name: 'Bench upper chest',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 1
	}, {
		name: 'Military press',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 1
	}, {
		name: 'Bar pulldown',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 2
	}, {
		name: 'Rows',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 2
	}, {
		name: 'Hyperextensions',
		difficulty: EXERCISE_DIFFICULTY.EASY,
		programID: 2
	}, {
		name: 'Squads',
		difficulty: EXERCISE_DIFFICULTY.HARD,
		programID: 3
	}, {
		name: 'Hamstring',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 3
	}, {
		name: 'Bulgarian squads',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 3
	}])

	await Exercise_translation.bulkCreate([
		{ exerciseID: exercises[0].id, lang_code: 'sk', name: 'Tlaky na rovnej lavičke s olympijskou tyčou' },
		{ exerciseID: exercises[1].id, lang_code: 'sk', name: 'Tlaky na sikmej lavičke s olympijskou tyčou' },
		{ exerciseID: exercises[2].id, lang_code: 'sk', name: 'Tlaky na ramená v stoji s olympijskou tyčou' },

		{ exerciseID: exercises[3].id, lang_code: 'sk', name: 'Zťahovanie hrazdy' },
		{ exerciseID: exercises[4].id, lang_code: 'sk', name: 'Veslovanie' },
		{ exerciseID: exercises[5].id, lang_code: 'sk', name: 'Hyperextenzie' },

		{ exerciseID: exercises[6].id, lang_code: 'sk', name: 'Drepy' },
		{ exerciseID: exercises[7].id, lang_code: 'sk', name: 'Bulharské drepy' },
		{ exerciseID: exercises[8].id, lang_code: 'sk', name: 'Ischiokrurály' },
	])
}


seedDB().then(() => {
	console.log('DB seed done, time to go to the (o_o) gym')
	process.exit(0)
}).catch((err) => {
	console.error('error in seed, check your data and model \n \n', err)
	process.exit(1)
})
