import * as fs from 'fs';
import * as path from 'path';

import Plugin from '../PluginModule/Plugin';
import DirectoryPluginInfoValidator from './DirectoryPluginInfoValidator';
import {PluginFinderInterface} from '../PluginLoader';

export interface PluginInfoValidatorInterface {
  getValidPluginInfoDirectories : () => string[];
}

export default class PluginFinder implements PluginFinderInterface {
  private _plugins: Plugin[] = [];
  public findingProcessCompleted = false;

  constructor(private pluginPath: string) {}

  public async scanForPlugins(): Promise<Plugin[]> {
    const pluginInfoValidator: PluginInfoValidatorInterface = new DirectoryPluginInfoValidator(this.pluginPath);
    const validPluginDirectories = pluginInfoValidator.getValidPluginInfoDirectories();
 
    const scannedPluginsPromises = validPluginDirectories.map(
      async directory => {
        try {
          if (fs.existsSync(path.join(directory, '/index.ts'))) {
            const plugin: { default: Plugin } = await import(
              path.join(directory, '/index.ts')
            );
            if (plugin.default) {
              // TODO PluginInfo Property adding remaining..
              const validPlugin = plugin.default;
              return plugin.default;
            }
          }
        } catch (error) {
          console.log(error.toString());
        }
      }
    );
    const scannedPlugins = await Promise.all(scannedPluginsPromises);
    return scannedPlugins.filter((plugin) => plugin !== undefined);
  }

  public get plugins(): Plugin[] {
    return this._plugins;
  }
}
