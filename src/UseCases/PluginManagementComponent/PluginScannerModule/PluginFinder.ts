import * as fs from 'fs';
import * as path from 'path';

import Plugin from '../PluginModule/Plugin';
import DirectoryPluginInfoValidator from './DirectoryPluginInfoValidator';
import { PluginFinderInterface } from '../PluginLoader';
import PluginInfo from '../PluginInfo';

export interface DirectoryPluginInfoValidatorInterface {
  getValidPluginInfoDirectories: () => string[];
  getValidPluginInfoForADirectory: (directory: string) => PluginInfo;
}

export default class PluginFinder implements PluginFinderInterface {
  private _plugins: Plugin[] = [];

  constructor(private pluginPath: string) { }

  public async scanForPlugins(): Promise<Plugin[]> {
    const directoryPluginInfoValidator: DirectoryPluginInfoValidatorInterface = new DirectoryPluginInfoValidator(
      this.pluginPath
    );
    const validPluginDirectories = directoryPluginInfoValidator.getValidPluginInfoDirectories();

    const scannedPluginsPromises = validPluginDirectories.map(
      async (directory) => {
        try {
          if (fs.existsSync(path.join(directory, '/index.ts'))) {
            const plugin: { default: Plugin } = await import(
              path.join(directory, '/index.ts')
            );
            if (plugin.default) {
              try {
                const pluginInfo: PluginInfo = directoryPluginInfoValidator.getValidPluginInfoForADirectory(
                  directory
                );
                plugin.default.pluginInfo = pluginInfo;
              } catch (error) {
                console.log(error.toString());
              }
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

  public async getPrioritySortedPlugins() {
    const plugins = await this.scanForPlugins();
    return plugins.sort((a, b) => a.priority > b.priority ? 1 : -1);
  }


}
