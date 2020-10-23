import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import config from './config/config';
import { Route } from './entities/routes';
import genericErrorHandler from './middlewares/genericErrorHandler';
import notFoundHandler from './middlewares/notFoundHandler';
import generateDinamicRoutes from './routes/dinamic';
import router from './routes/routes';
import generateStaticRoutes from './routes/static';

const { name, version } = config;
const app: express.Application = express();

app.locals.name = name;
app.locals.version = version;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

createConnection({
    type: "sqlite",
    database: "src/database/sqlite.db",
    entities: [
        Route
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    subscribers: [
        "src/subscriber/**/*.ts"
    ],
    cli: {
        "entitiesDir": "src/entities",
        "migrationsDir": "src/"
    },
    synchronize: true
}).then(connection => {

    console.log('Successfully connected to Database -> ' + connection.name.toUpperCase())

    generateStaticRoutes(router)
    generateDinamicRoutes(router)
    app.use(genericErrorHandler);
    app.use(notFoundHandler);

}).catch(error => {
    console.log('Error on database connection', error)
}
);

export default app;
