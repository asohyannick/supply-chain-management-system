import { Model, DataTypes } from "sequelize";
import { IUser as IUserInterfac } from '../../serviceImplementator/user/user.interfac';
import sequelize from '../../config/db/databaseConfig';
export class User extends Model implements IUserInterfac {
    public id!: string | number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public isAdmin!: boolean;
    public refreshToken!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    refreshToken: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});

export default User;