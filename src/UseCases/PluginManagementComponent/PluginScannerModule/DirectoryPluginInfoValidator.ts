import * as fs from "fs";
import * as path from "path";

import PluginInfo from '../PluginInfo'
import { PluginInfoValidatorInterface } from "./PluginFinder";
import PluginDirectoryScanner from "./PluginDirectoryScanner";

export default class PluginInfoValidator implements PluginInfoValidatorInterface {
  
  constructor(private pluginPath: string) {}
  
  public getValidPluginInfoForADirectory(directory: string): PluginInfo{
    const rawJson = fs.readFileSync(path.join(directory, '/pluginInfo.json'), 'utf-8');
    const pluginInfo: PluginInfo = JSON.parse(rawJson);
    return pluginInfo;
  }
  public getValidPluginInfoDirectories(): string[] {
    const pluginDirectoryScanner = new PluginDirectoryScanner(this.pluginPath);
    const pluginDirectories = pluginDirectoryScanner.getPluginDirectories();
    const validDirectories: string[] = pluginDirectories.map((directory) => {
      const rawJson = fs.readFileSync(
        path.join(directory, "/pluginInfo.json"),
        "utf-8"
      );
      const pluginInfoTemp: PluginInfo = JSON.parse(rawJson);
      if (pluginInfoTemp.name && pluginInfoTemp.pluginId) {
        return directory;
      }
    });
    return validDirectories;
  }
}
