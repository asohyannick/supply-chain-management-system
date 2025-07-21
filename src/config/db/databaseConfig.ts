import 'dotenv/config';
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(
    process.env.DATABASE_NAME as string, 
    process.env.DATABASE_USER as string, 
    process.env.DATABASE_PASSWORD as string, {
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
});

export default sequelize;