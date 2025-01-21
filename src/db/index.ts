/* eslint import/no-cycle: 0 */

import path, { join } from 'path'
import fs from 'fs'
import { Sequelize } from 'sequelize'

import defineExercise from './exercise'
import defineProgram from './program'
import defineUser_account from './user_account'
import defineUser_account_Exercise from './user_account_exercise'
import defineProgram_translation from './program_translation'
import defineExercise_translation from './exercise_translation'
import defineCompleted_Exercise from './completed_exercises'

const sequelize: Sequelize = new Sequelize('postgres://postgres:123456@51.20.137.187:5432/fitness_app', {
	logging: false
})

sequelize.authenticate().catch((e: any) => console.error(`Unable to connect to the database${e}.`))

const modelsBuilder = (instance: Sequelize) => ({
	// Import models to sequelize
	Exercise: instance.import(path.join(__dirname, 'exercise'), defineExercise),
	Program: instance.import(path.join(__dirname, 'program'), defineProgram),
	User_account: instance.import(path.join(__dirname, 'user_account'), defineUser_account),
	User_account_Exercise: instance.import(path.join(__dirname, 'user_account_exercise'), defineUser_account_Exercise), // Many to Many
	Completed_Exercise: instance.import(path.join(__dirname, 'completed_exercise'), defineCompleted_Exercise), //Many to Many
	Program_translation: instance.import(path.join(__dirname, 'program_translation'), defineProgram_translation),
	Exercise_translation: instance.import(path.join(__dirname, 'exercise_tranlsation'), defineExercise_translation),

})

const models = modelsBuilder(sequelize)

// check if every model is imported
const modelsFiles = fs.readdirSync(__dirname)

// -1 because index.ts can not be counted
if (Object.keys(models).length !== (modelsFiles.length - 1)) {
	throw new Error('You probably forgot import database model!')
}

Object.values(models).forEach((value: any) => {
	
	if (value.associate) {
		value.associate(models)
	}
})

export { models, modelsBuilder, sequelize }
