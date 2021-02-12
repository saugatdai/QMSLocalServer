import Plugin from "./Plugin";
import PluginInfoValidator from "./PluginInfoValidator";

export interface PluginInfo {
  name: string;
  version?: string;
  minCoreVersion?: string;
  pluginId: number;
  pluginValidatorId: string;
}

export default class PluginFinder {
  private plugins: Plugin[];
  private pluginInfos : PluginInfo[]
  
  constructor(private pluginPath: string) {}

  public scanForPlugins(): Plugin[] {
    const pluginInfoValidator = new PluginInfoValidator(this.pluginPath);
    const validPluginDirectories = pluginInfoValidator.getValidPluginInfoDirectories();
    
    validPluginDirectories.forEach(async directory => {
      // TODO import plugins
    });
    return this.plugins;
  }
}
