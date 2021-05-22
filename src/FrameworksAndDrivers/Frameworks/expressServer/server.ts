import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import AppRouterSingleton from './Helpers/AppRouter';
import './RouteHandlers/UserRoutes';

const app = express();
app.use(express.json());

app.use(AppRouterSingleton.getInstance());


app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from queuemanagement server');
});

app.listen(3000, () => {
  console.log('server started...');
});

export default app;