import * as fs from 'fs';
import * as path from 'path';

import PluginInfo from '../PluginInfo';
import { DirectoryPluginInfoValidatorInterface } from './PluginFinder';
import PluginDirectoryScanner from './PluginDirectoryScanner';

export default class PluginInfoValidator
  implements DirectoryPluginInfoValidatorInterface {
  constructor(private pluginPath: string) {}

  public getValidPluginInfoForADirectory(directory: string): PluginInfo {
    const rawJson = fs.readFileSync(
      path.join(directory, '/pluginInfo.json'),
      'utf-8'
    );
    const pluginInfo: PluginInfo = JSON.parse(rawJson);
    if (!(pluginInfo.name && pluginInfo.pluginId)) {
      throw new Error(
        `The directory\n${this.pluginPath}\ndoesn't has a valid pluginInfo.json`
      );
    }
    return pluginInfo;
  }
  public getValidPluginInfoDirectories(): string[] {
    const pluginDirectoryScanner = new PluginDirectoryScanner(this.pluginPath);
    const pluginDirectories = pluginDirectoryScanner.getPluginDirectories();
    const validDirectories: string[] = pluginDirectories.filter((directory) => {
      const rawJson = fs.readFileSync(
        path.join(directory, '/pluginInfo.json'),
        'utf-8'
      );
      const pluginInfoTemp: PluginInfo = JSON.parse(rawJson);
      return pluginInfoTemp.name && pluginInfoTemp.pluginId;
    });
    return validDirectories;
  }
}
