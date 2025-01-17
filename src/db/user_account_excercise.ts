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
    excersice: ExerciseModel
    time_start: Date
    time_end: Date
    duration: number
    user_notes: string
    exercises: ExerciseModel[]
    users: User_accountModel[]

}

export default (sequelize: Sequelize) => {
    User_account_ExcerciseModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        time_start: {
            type: DataTypes.DATE
        },
        time_end: {
            type: DataTypes.DATE
        },
        duration: {
            type: DataTypes.INTEGER
        }

    }, {
        paranoid: true,
        timestamps: true,
        sequelize,
        modelName: 'user_accounts_excercise'
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