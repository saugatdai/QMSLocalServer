import express, { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import AppRouterSingleton from './Helpers/userRouteHelper/AppRouter';
import './RouteHandlers/UserRoutes';
import './RouteHandlers/TokenBaseRoutes';
import './RouteHandlers/CustomerRoutes';
import './RouteHandlers/TokenCountRoute';
import './RouteHandlers/TokenCallerRoute';

const errorHandler = (error: Error, res: Response) => {
  res.status(500).send({ error: error.toString() });
}

const app = express();
app.use(express.json());

app.use(AppRouterSingleton.getInstance());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, res);
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from queuemanagement server');
});


export default app;