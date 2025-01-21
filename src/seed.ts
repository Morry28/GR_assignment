import { models, sequelize } from './db/index'
import user_account from './db/user_account'
import { EXERCISE_DIFFICULTY } from './utils/enums'

const {
	Exercise,
	Program,
	Exercise_translation,
	Program_translation,
	User_account
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
		{ program_id: programs[0].id, lang_code: 'sk', name: 'Tlaky' },
		{ program_id: programs[1].id, lang_code: 'sk', name: 'Príťahy' },
		{ program_id: programs[2].id, lang_code: 'sk', name: 'Nohy' },
	])

	const exercises = await Exercise.bulkCreate([{
		name: 'Bench press',
		difficulty: EXERCISE_DIFFICULTY.HARD,
		program_id: 1
	}, {
		name: 'Bench upper chest',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		program_id: 1
	}, {
		name: 'Military press',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		program_id: 1
	}, {
		name: 'Bar pulldown',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		program_id: 2
	}, {
		name: 'Rows',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		program_id: 2
	}, {
		name: 'Hyperextensions',
		difficulty: EXERCISE_DIFFICULTY.EASY,
		program_id: 2
	}, {
		name: 'Squads',
		difficulty: EXERCISE_DIFFICULTY.HARD,
		program_id: 3
	}, {
		name: 'Hamstring',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		program_id: 3
	}, {
		name: 'Bulgarian squads',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		program_id: 3
	}])

	await Exercise_translation.bulkCreate([
		{ exercise_id: exercises[0].id, lang_code: 'sk', name: 'Tlaky na rovnej lavičke s olympijskou tyčou' },
		{ exercise_id: exercises[1].id, lang_code: 'sk', name: 'Tlaky na sikmej lavičke s olympijskou tyčou' },
		{ exercise_id: exercises[2].id, lang_code: 'sk', name: 'Tlaky na ramená v stoji s olympijskou tyčou' },

		{ exercise_id: exercises[3].id, lang_code: 'sk', name: 'Zťahovanie hrazdy' },
		{ exercise_id: exercises[4].id, lang_code: 'sk', name: 'Veslovanie' },
		{ exercise_id: exercises[5].id, lang_code: 'sk', name: 'Hyperextenzie' },

		{ exercise_id: exercises[6].id, lang_code: 'sk', name: 'Drepy' },
		{ exercise_id: exercises[7].id, lang_code: 'sk', name: 'Ischiokrurály' },
		{ exercise_id: exercises[8].id, lang_code: 'sk', name: 'Bulharské drepy' },
	])


	await User_account.create({
		nick_name: 'guest_m65nc4rbkq89z5',
		email:'testX@gmail.com',
		password:'$2b$10$teK2pLTP9LVvpRUFjtJm8.CcC.6IsRPqLxyi9eD0ykNGzZqmNip52',
		role:'user'

	})
}



seedDB().then(() => {
	console.log('DB seed done, time to go to the (o_o) gym')
	process.exit(0)
}).catch((err) => {
	console.error('error in seed, check your data and model \n \n', err)
	process.exit(1)
})
