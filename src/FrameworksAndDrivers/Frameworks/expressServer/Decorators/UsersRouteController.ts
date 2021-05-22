import { RequestHandler } from 'express';

import MetadataKeys from "../Constants/MetadataKeys";
import Methods from '../Constants/Methods';
import AppRouterSingleton from "../Helpers/AppRouter";

export default (pathPrefix: string) => {
  return (target: Function) => {
    Object.getOwnPropertyNames(target.prototype).forEach(propertyName => {
      const routeHandler = target.prototype[propertyName];
      const path = Reflect.getMetadata(MetadataKeys.PATH, target.prototype, propertyName);
      const method: Methods = Reflect.getMetadata(MetadataKeys.METHOD, target.prototype, propertyName);
      const middlewares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target.prototype, propertyName) || [];
      if (path && method) {
        AppRouterSingleton.getInstance()[method](`${pathPrefix}${path}`, [...middlewares], routeHandler);
      }
    });
  }
}