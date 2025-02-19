import {
    Sequelize,
    DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ExerciseModel } from './exercise'
import { User_accountModel } from './user_account'

export class Completed_ExerciseModel extends DatabaseModel {
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
    Completed_ExerciseModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        time_start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        time_end: {
            type: DataTypes.DATE,
            allowNull: false

        },
        duration: {
            type: DataTypes.INTEGER,
        },
        user_account_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'user_account', 
                key: 'id'
            }
        },
        exercise_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'exercise', 
                key: 'id'
            }
        },

    }, {

        sequelize,
        modelName: 'completed_exercise',
        freezeTableName: true,
        timestamps: false
    })

    Completed_ExerciseModel.associate = (models) => {
        (Completed_ExerciseModel as any).belongsTo(models.User_account, {
            foreignKey: 'user_account_id'
        });

        (Completed_ExerciseModel as any).belongsTo(models.Exercise, {
            foreignKey: 'exercise_id'
        })
    }




    return Completed_ExerciseModel
}