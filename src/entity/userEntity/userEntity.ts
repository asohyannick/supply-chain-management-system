import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from '../../config/db/databaseConfig';
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare isAdmin: boolean;
  declare refreshToken: CreationOptional<string>;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING(100), // Added length limit
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(100), // Added length limit
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255), // Explicit length
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(1024), // Increased for hashed passwords
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    refreshToken: {
        type: DataTypes.TEXT, // Changed to TEXT for long values
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: ['password', 'refreshToken']
        }
    },
    scopes: {
        withSensitive: {
            attributes: { include: ['password', 'refreshToken'] }
        }
    }
});

export default User;