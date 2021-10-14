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
import AppKernelSingleton from '../../Drivers/AppKernelSingleton';
import * as path from 'path';
import EventManagerSingleton from '../../../UseCases/EventManagementComponent/EventManagerSingleton';
import EventTypes from '../../../UseCases/EventManagementComponent/EventTypes';

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  TokenCallingStateManagerSingleton.getInstance().removeAllStateUnlockedTokenCallingStateObjects();
  next();
});

app.use(AppRouterSingleton.getInstance());

app.listen(5000, async () => {
  const pluginsPath = path.join(__dirname, '../../../../plugins');
  EventManagerSingleton.getInstance().on(EventTypes.PLUGIN_ZIP_EXTRACTED, async (zipFile: string) => {
    await fs.promises.unlink(zipFile);
  });
  await AppKernelSingleton.getInstance().initializeCoreCallingActivities(pluginsPath);
  console.log('Server running at port 5000');
});

export default app;