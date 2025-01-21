/* eslint import/no-cycle: 0 */

import {
	Sequelize,
	DataTypes,
	Model
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ProgramModel } from './program'
import { Exercise_translationModel } from './exercise_translation'
import { EXERCISE_DIFFICULTY } from '../utils/enums'
import { FIELD_LENGTHS } from '../utils/consts'

export class ExerciseModel extends DatabaseModel {
	static id: number
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

		(ExerciseModel as any).belongsTo(models.Program, {
			foreignKey: {
				name: 'program_id', 
			}
		});

		(ExerciseModel as any).belongsToMany(models.User_account, {
			through: models.User_account_Exercise,
			foreignKey: {
				name: 'exercise_id',
				allowNull: false
			},
			otherKey:'user_account_id'
		});

		(ExerciseModel as any).hasMany(models.Exercise_translation, {
			foreignKey: 'exercise_id',
			as: 'translations',
		})
	}

	return ExerciseModel
}
