export default interface PluginInfo {
  name: string;
  version?: string;
  minCoreVersion?: string;
  pluginId: number;
  pluginValidatorId: string;
  pluginDescription?: string;
}
