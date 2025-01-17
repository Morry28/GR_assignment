/* eslint import/no-cycle: 0 */

import {
	Sequelize,
	DataTypes,
	Model
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ProgramModel } from './program'

import { EXERCISE_DIFFICULTY } from '../utils/enums'

export class ExerciseModel extends DatabaseModel {
	id: number
	difficulty: EXERCISE_DIFFICULTY
	name: String

	program: ProgramModel
}

export default (sequelize: Sequelize) => {
	ExerciseModel.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		difficulty: {
			type: DataTypes.ENUM(...Object.values(EXERCISE_DIFFICULTY))
		},
		name: {
			type: DataTypes.STRING(200),
		}
	}, {
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'exercise'
	})

	ExerciseModel.associate = (models) => {
		console.log('I AM HERE');

		(ExerciseModel as any).belongsTo(models.Program, {
			foreignKey: {
				name: 'programID', //zmenena z programID na program_id
				allowNull: false
			}
		});

		(ExerciseModel as any).belongsToMany(models.User_account, {
			through: models.User_account_Excercise,
			foreignKey: {
				name: 'excercise_id',
				allowNull: false
			},
			otherKey:'user_accounte_id'
		})
	}

	return ExerciseModel
}
