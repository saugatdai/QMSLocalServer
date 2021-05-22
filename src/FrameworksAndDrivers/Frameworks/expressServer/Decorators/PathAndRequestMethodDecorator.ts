import MetadataKeys from "../Constants/MetadataKeys";
import Methods from '../Constants/Methods';

const routeBinder = (method: string) => {
  return (path: string) => {
    return (target: any, key: string, desc: PropertyDescriptor) => {
      Reflect.defineMetadata(MetadataKeys.PATH, path, target, key);
      Reflect.defineMetadata(MetadataKeys.METHOD, method, target, key);
    }
  }
}

export const get = routeBinder(Methods.GET);
export const post = routeBinder(Methods.POST);
export const put = routeBinder(Methods.PUT);
export const patch = routeBinder(Methods.PATCH);
export const del = routeBinder(Methods.DELETE);