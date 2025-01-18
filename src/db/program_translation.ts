/* eslint import/no-cycle: 0 */

import {
    Sequelize,
    DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { FIELD_LENGTHS } from '../utils/consts'

export class Program_translationModel extends DatabaseModel {
    id: number
    lang_code: string
    name: string

}

export default (sequelize: Sequelize) => {
    Program_translationModel.init({
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
            allowNull:false
        }
    }, {
        sequelize,
        modelName: 'program_translation',
        freezeTableName: true,
    })

    Program_translationModel.associate = (models) => {

        (Program_translationModel as any).belongsTo(models.Program, {
            foreignKey: {
                name: 'programID',
                allowNull: false
            },
            as: 'translations'
        })
    }

    return Program_translationModel
}
