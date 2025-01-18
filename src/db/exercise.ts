/* eslint import/no-cycle: 0 */

import {
	Sequelize,
	DataTypes,
	Model
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ProgramModel } from './program'
import { Exercise_translationModel } from './excercise_translation'
import { EXERCISE_DIFFICULTY } from '../utils/enums'
import { FIELD_LENGTHS } from '../utils/consts'

export class ExerciseModel extends DatabaseModel {
	id: number
	difficulty: EXERCISE_DIFFICULTY
	name: String

	program: ProgramModel
	translations: Exercise_translationModel[]
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
			type: DataTypes.STRING(FIELD_LENGTHS.DEFAULT_NAME),
		}
	}, {
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'exercise',
        freezeTableName: true,
	})

	ExerciseModel.associate = (models) => {
		console.log('I AM HERE');

		(ExerciseModel as any).belongsTo(models.Program, {
			foreignKey: {
				name: 'programID', 
				allowNull: false
			}
		});

		(ExerciseModel as any).belongsToMany(models.User_account, {
			through: models.User_account_Excercise,
			foreignKey: {
				name: 'exerciseID',
				allowNull: false
			},
			otherKey:'user_accounteID'
		});

		(ExerciseModel as any).hasMany(models.Exercise_translation, {
			foreignKey: 'exerciseID',
			as: 'translations',
		})
	}

	return ExerciseModel
}
