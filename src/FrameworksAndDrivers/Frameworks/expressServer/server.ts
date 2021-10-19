import * as fs from 'fs';

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
import * as path from 'path';
import AppKernelSingleton from '../../Drivers/AppKernelSingleton';

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  TokenCallingStateManagerSingleton.getInstance().removeAllStateUnlockedTokenCallingStateObjects();
  next();
});

app.use(AppRouterSingleton.getInstance());

app.listen(5000, async () => {
  const pluginsPath = path.join(__dirname, '../../../../plugins');
  await AppKernelSingleton.getInstance().initializeCoreCallingActivities(pluginsPath);
  console.log('Server running at port 5000');
});

export default app;