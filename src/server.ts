import 'reflect-metadata';
import 'dotenv/config';
import express, { Application } from 'express';
import morgan from 'morgan';
import sequelize from './config/db/databaseConfig';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import userRoute from './controller/user/user.controller';
import notFound from './middleware/notFound/notFound';
import backendError from './middleware/serverError/backendError';
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const APP_NAME: string = process.env.APP_NAME || 'SupplyChainManagementSystem';
const APP_HOST: string = process.env.APP_HOST || 'http://localhost';
const APP_PORT: string | number = parseInt(process.env.APP_PORT || '8080', 10);
const API_VERSION: string | number = process.env.API_VERSION || 'v1';
const APP_OWNER: string = process.env.APP_OWNER || 'codingLamb';
if (process.env.NODE_ENV as string === 'development') {
    app.use(morgan('dev'));
}
app.use(cors({
    origin: process.env.FRONTEND_DOMAIN as string,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(helmet());
app.use(compression());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});
app.use(limiter);
app.use(`/api/${API_VERSION}/user`, userRoute);
app.use(notFound);
app.use(backendError);
async function serve() {
    try {
        await sequelize.authenticate();
        console.log('Postgres is connected to the backend successfully!');
        sequelize.sync();
        app.listen(APP_PORT, () => {
            console.log(`Server is called ${APP_NAME} running on ${APP_HOST} on port ${APP_PORT} on /api/${API_VERSION} owned by ${APP_OWNER}`);
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Database connection has failed!', error.message);
        }
    }
}
serve();