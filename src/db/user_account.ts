import {
    Sequelize,
    DataTypes,
    Model
} from 'sequelize'
import { DatabaseModel } from '../types/db'
import { ROLES } from '../utils/enums'
import { FIELD_LENGTHS } from '../utils/consts'
import { User_account_ExerciseModel } from './user_account_exercise'

//? only for info
export class User_accountModel extends DatabaseModel {
    id: number
    name?: string
    sur_name?: string
    age?: number
    nick_name?: string
    email: string
    password: string
    role: ROLES
    exercises:User_account_ExerciseModel[]
}

export default (sequelize: Sequelize) => {
    User_accountModel.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(FIELD_LENGTHS.USER_NAME),
        },
        sur_name: {
            type: DataTypes.STRING(FIELD_LENGTHS.SUR_NAME)
        },
        age: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 120
            }
        },
        nick_name: {
            type: DataTypes.STRING(FIELD_LENGTHS.NICK_NAME),
            unique:true

        },
        email: {
            type: DataTypes.STRING(FIELD_LENGTHS.EMAIL),
            allowNull: false,
            unique:true
        },
        password:{
            type: DataTypes.TEXT
        },
        role: {
            type: DataTypes.STRING(FIELD_LENGTHS.ROLE),
            allowNull: false
        }
    }, {
        paranoid: true,
        timestamps: true,
        sequelize,
        modelName: 'user_account',
        freezeTableName: true,
    })

    User_accountModel.associate = (models) => {
        (User_accountModel as any).belongsToMany(models.Exercise,{
            through: models.User_account_Exercise,
            foreignKey:{
                name:'user_account_id',
                allowNull:false
            },
            otherKey: 'exercise_id'
        })
        

    }

    return User_accountModel
}