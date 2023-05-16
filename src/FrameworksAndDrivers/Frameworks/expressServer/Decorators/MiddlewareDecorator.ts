import { RequestHandler } from 'express';
import MetadataKeys from '../Constants/MetadataKeys';

export default (middleware: RequestHandler) => {
  return (target: any, key: string, desc: PropertyDescriptor) => {
    const middlewares = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, key) || [];
    Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, [middleware, ...middlewares], target, key);
  }
}