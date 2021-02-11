import Plugin from "./Plugin";
import PluginInfoValidator from './PluginInfoValidator';

export interface PluginInfo {
  name: string;
  version?: string;
  minCoreVersion?: string;
  pluginId: number;
  pluginValidatorId: string;
}

export default class PluginFinder {
  private plugins: Plugin[];

  constructor(private pluginPath: string) {}

  public scanForPlugins(): Plugin[] {
    const pluginInfoValidator = new PluginInfoValidator(this.pluginPath);
    const pluginInfo: PluginInfo[] = pluginInfoValidator.getValidPluginInfos();
    console.log(pluginInfo);
    return this.plugins;
  }

  public scanForValidDirectories(): string[] {
    const pluginInfoValidator = new PluginInfoValidator(this.pluginPath);
    const validDirectories = pluginInfoValidator.getValidPluginInfoDirectories();
    console.log(validDirectories);
    return validDirectories;
  }
}