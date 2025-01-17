/* eslint import/no-cycle: 0 */

import path, { join } from 'path'
import fs from 'fs'
import { Sequelize } from 'sequelize'

import defineExercise from './exercise'
import defineProgram from './program'
import defineUser_account from './user_account'
import defineUser_account_Excercise from './user_account_excercise'

const sequelize: Sequelize = new Sequelize('postgres://postgres:123456@51.20.137.187:5432/fitness_app', {
	logging: false
})

sequelize.authenticate().catch((e: any) => console.error(`Unable to connect to the database${e}.`))

const modelsBuilder = (instance: Sequelize) => ({
	// Import models to sequelize
	Exercise: instance.import(path.join(__dirname, 'exercise'), defineExercise),
	Program: instance.import(path.join(__dirname, 'program'), defineProgram),
	User_account: instance.import(path.join(__dirname, 'user_account'), defineUser_account),
	User_account_Excercise: instance.import(path.join(__dirname, 'user_account_excercise'), defineUser_account_Excercise) // Many to Many
}) 

const models = modelsBuilder(sequelize)

// check if every model is imported
const modelsFiles = fs.readdirSync(__dirname)

// -1 because index.ts can not be counted
if (Object.keys(models).length !== (modelsFiles.length - 1)) {
	throw new Error('You probably forgot import database model!')
}

Object.values(models).forEach((value: any) => {
	console.log(value)

	if (value.associate) {
		value.associate(models)
	}
})

export { models, modelsBuilder, sequelize }
