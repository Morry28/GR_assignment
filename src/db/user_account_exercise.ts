import {
    Sequelize,
    DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ExerciseModel } from './exercise'
import { User_accountModel } from './user_account'
import { sequelize } from '.'

export class User_account_ExerciseModel extends DatabaseModel {
    id: number
    user_account: User_accountModel
    createdAt: Date
    exercise: ExerciseModel
    users: User_accountModel

}

export default (sequelize: Sequelize) => {
    User_account_ExerciseModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE
        },
        user_account_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'user_account', // Názov tabuľky User_account
                key: 'id'
            }
        },
        exercise_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'exercise', // Názov tabuľky Exercise
                key: 'id'
            }
        },
    }, {
        timestamps: true,
        sequelize,
        modelName: 'user_account_exercise',
        freezeTableName: true,
    })

    User_account_ExerciseModel.associate = (models) => {
        (User_account_ExerciseModel as any).belongsTo(models.User_account, {
            foreignKey: 'user_account_id'
        });

        (User_account_ExerciseModel as any).belongsTo(models.Exercise, {
            foreignKey: 'exercise_id'
        })
    }




    return User_account_ExerciseModel
}