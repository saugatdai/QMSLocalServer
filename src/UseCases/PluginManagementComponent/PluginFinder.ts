import * as fs from 'fs';
import * as path from 'path';

import Plugin from './Plugin';
import PluginInfoValidator from './PluginInfoValidator';

export interface PluginInfo {
  name: string;
  version?: string;
  minCoreVersion?: string;
  pluginId: number;
  pluginValidatorId: string;
}

export default class PluginFinder {
  private _plugins: Plugin[] = [];
  public findingProcessCompleted = false;

  constructor(private pluginPath: string) {}

  public async scanForPlugins(): Promise<Plugin[]> {
    const pluginInfoValidator = new PluginInfoValidator(this.pluginPath);
    const validPluginDirectories = pluginInfoValidator.getValidPluginInfoDirectories();

    const scannedPluginsPromises = validPluginDirectories.map(
      async (directory) => {
        try {
          if (fs.existsSync(path.join(directory, '/index.ts'))) {
            const plugin: { default: Plugin } = await import(
              path.join(directory, '/index.ts')
            );
            if (plugin.default) {
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
