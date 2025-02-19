/* eslint import/no-cycle: 0 */

import {
	Sequelize,
	DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { EXERCISE_DIFFICULTY } from '../utils/enums'
import { ExerciseModel } from './exercise'
import { FIELD_LENGTHS } from '../utils/consts'
import { Program_translationModel } from './program_translation'

export class ProgramModel extends DatabaseModel {
	id: number
	difficulty: EXERCISE_DIFFICULTY
	name: String

	exercises: ExerciseModel[]
	translations: Program_translationModel[]
}

export default (sequelize: Sequelize) => {
	ProgramModel.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(FIELD_LENGTHS.DEFAULT_NAME),
		}
	}, {
		timestamps: true,
		sequelize,
		modelName: 'program',
        freezeTableName: true,
	})

	ProgramModel.associate = (models) => {

		(ProgramModel as any).hasMany(models.Exercise, {
			foreignKey: {
				name: 'program_id',
			}
		});

		ProgramModel.hasMany(models.Program_translation, {
			foreignKey: 'program_id',
			as: 'translations',
		})
	}

	return ProgramModel
}
