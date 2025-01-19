import {
    Sequelize,
    DataTypes,
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ExerciseModel } from './exercise'
import { User_accountModel } from './user_account'

export class Completed_ExcerciseModel extends DatabaseModel {
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
    Completed_ExcerciseModel.init({
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
        ended_at: {
            type: DataTypes.DATE,
            allowNull: false

        },
        duration: {
            type: DataTypes.INTEGER,
            get() {
                const timeOfStart = new Date(this.getDataValue('time_start')).getTime()
                const timeOfCompletion = new Date(this.getDataValue('ended_at')).getTime()
                return Math.floor((timeOfCompletion - timeOfStart) / 1000)
            }
        }

    }, {

        sequelize,
        modelName: 'completed_excercise',
        freezeTableName: true,
    })

    Completed_ExcerciseModel.associate = (models) => {
        (Completed_ExcerciseModel as any).belongsTo(models.User_account, {
            foreignKey: 'user_account_id'
        });

        (Completed_ExcerciseModel as any).belongsTo(models.Exercise, {
            foreignKey: 'exercise_id'
        })
    }




    return Completed_ExcerciseModel
}