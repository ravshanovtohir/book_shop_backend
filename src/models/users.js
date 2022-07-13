import { Model, DataTypes } from 'sequelize';

export default async function({ sequelize }) {
    class User extends Model {}

    User.init({
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [4, 30],
                    msg: "Username must be between 4 and 30 characters"
                }
            }
        },

        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        user_is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'users',
        modelName: 'User',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        underscored: true,
        sequelize,
        logging: false
    })
}