import express, { Request, Response } from 'express';
import 'reflect-metadata';
import AppRouterSingleton from './Helpers/userRouteHelper/AppRouter';
import './RouteHandlers/UserRoutes';
import './RouteHandlers/TokenBaseRoutes';
import './RouteHandlers/CustomerRoutes';
import './RouteHandlers/TokenCountRoute';
import './RouteHandlers/TokenCallerRoute';

const app = express();
app.use(express.json());

app.use(AppRouterSingleton.getInstance());


app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from queuemanagement server');
});

export default app;