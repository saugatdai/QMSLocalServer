import Plugin from "./Plugin";
import { readdirSync } from "fs";
import * as path from "path";

export default class PluginFinder {
  private plugins: Plugin[];

  constructor(private pluginPath: string) {}

  public scanForPlugins(): Plugin[] {
    const pluginDirectories = this.getPluginDirectories();
    
    pluginDirectories.forEach(directory => {
      
    });
    
    return this.plugins;
  }
  private getPluginDirectories(): string[] {
    const pluginDirectories = readdirSync(this.pluginPath, {
      withFileTypes: true,
    })
      .filter((gotFile) => gotFile.isDirectory())
      .map((directoryObject) => directoryObject.name);

    const absolutePluginDirectories = pluginDirectories.map((pluginDirectory) => {
      return path.join(this.pluginPath, `/${pluginDirectory}`);
    });
    return absolutePluginDirectories;
  }
}
