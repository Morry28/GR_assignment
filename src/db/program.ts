/* eslint import/no-cycle: 0 */

import {
	Sequelize,
	DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { EXERCISE_DIFFICULTY } from '../utils/enums'
import { ExerciseModel } from './exercise'
import { FIELD_LENGTHS } from '../utils/consts'

export class ProgramModel extends DatabaseModel {
	id: number
	difficulty: EXERCISE_DIFFICULTY
	name: String

	exercises: ExerciseModel[]
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
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'program'
	})

	ProgramModel.associate = (models) => {
		(ProgramModel as any).hasMany(models.Exercise, {
			foreignKey: {
				name: 'programID',
				allowNull: false
			},
			as: 'translations'
		})
	}

	return ProgramModel
}
