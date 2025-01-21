/* eslint import/no-cycle: 0 */

import {
    Sequelize,
    DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { FIELD_LENGTHS } from '../utils/consts'

export class Exercise_translationModel extends DatabaseModel {
    id: number
    lang_code: string
    name: string
    
}

export default (sequelize: Sequelize) => {
    Exercise_translationModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        lang_code: {
            type: DataTypes.STRING(FIELD_LENGTHS.DEFAULT_NAME),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(FIELD_LENGTHS.DEFAULT_NAME),
            allowNull: false
        }
    }, {

        sequelize,
        modelName: 'exercise_translation',
        freezeTableName: true,
    })

    Exercise_translationModel.associate = (models) => {

        (Exercise_translationModel as any).belongsTo(models.Exercise, {
            foreignKey: {
                name: 'exercise_id',
                allowNull: false
            },
            as: 'translations'
        })
    }

    return Exercise_translationModel
}
