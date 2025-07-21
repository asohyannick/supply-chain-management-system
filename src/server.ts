import 'dotenv/config';
import express, { Application } from 'express';
import morgan from 'morgan';
import { initializeDatabase } from './config/db/databaseConfig';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import notFound from './middleware/notFound/notFound';
import backendError from './middleware/serverError/backendError';
const app:Application = express();
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
    origin:process.env.FRONTEND_DOMAIN as string,
    methods:['POST', 'GET', 'PUT', 'DELETE'],
    credentials:true,
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
app.get('/test', (_req, res) => {
    res.status(200).json({
        message: "Hello World!"
    });
});
app.use(notFound);
app.use(backendError);
async function serve() {
    try {
        await initializeDatabase(),
        app.listen(APP_PORT, () => {
            console.log(`Server is called ${APP_NAME} running on ${APP_HOST} on port ${APP_PORT} on /api/${API_VERSION} owned by ${APP_OWNER}`);
        });
    } catch (error) {
        console.error("Error occured!", error);
    }
}
serve();
