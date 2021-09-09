import express, { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import AppRouterSingleton from './Helpers/userRouteHelper/AppRouter';
import './RouteHandlers/UserRoutes';
import './RouteHandlers/TokenBaseRoutes';
import './RouteHandlers/CustomerRoutes';
import './RouteHandlers/TokenCountRoute';
import './RouteHandlers/TokenCallerRoute';
import './RouteHandlers/PluginRoute';
import TokenCallingStateManagerSingleton from '../../../UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton';

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  TokenCallingStateManagerSingleton.getInstance().removeAllStateUnlockedTokenCallingStateObjects();
  next();
});

app.use(AppRouterSingleton.getInstance());

export default app;