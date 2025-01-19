import {
    Sequelize,
    DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ExerciseModel } from './exercise'
import { User_accountModel } from './user_account'
import { sequelize } from '.'

export class User_account_ExcerciseModel extends DatabaseModel {
    id: number
    user_account: User_accountModel
    createdAt: Date
    exercise: ExerciseModel
    users: User_accountModel

}

export default (sequelize: Sequelize) => {
    User_account_ExcerciseModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: true,
        sequelize,
        modelName: 'user_account_excercise',
        freezeTableName: true,
    })

    User_account_ExcerciseModel.associate = (models) => {
        (User_account_ExcerciseModel as any).belongsTo(models.User_account, {
            foreignKey: 'user_account_id'
        });

        (User_account_ExcerciseModel as any).belongsTo(models.Exercise, {
            foreignKey: 'exercise_id'
        })
    }




    return User_account_ExcerciseModel
}