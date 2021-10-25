import { PluginManagerStorageInteractorAdapter } from "../UseCases/PluginManagementComponent/PluginManager";
import PluginConfigElement from "../UseCases/PluginManagementComponent/PluginModule/PluginConfigElement";

export interface PluginManagerStorageAdapter {
  installPluginFromArchiveFile: (archivePath: string, pluginPath: string) => Promise<void>;
  removeInstalledPluginByPluginId: (pluginID: number, pluginPath: string) => Promise<void>;
  writePluginValidatorIdOfPluginId: (pluginValidatorId: string, pluginId: number, pluginPath: string) => Promise<void>;
  setPluginConfigByPluginId: (pluginConfigElements: PluginConfigElement[], pluginId: number, pluginPath: string) => Promise<void>;
  getPluginConfigByPluginId: (pluignId: number, pluginPath: string) => Promise<PluginConfigElement[]>;
}

export default class PluginManagerStorageInteractorImplementation implements PluginManagerStorageInteractorAdapter {
  constructor(private pluginManagerStorageAdapter: PluginManagerStorageAdapter) { }

  public async installPluginFromArchive(archivePath: string, pluginPath: string) {
    await this.pluginManagerStorageAdapter.installPluginFromArchiveFile(archivePath, pluginPath);
  }

  public async deleteInstalledPluginByPluginId(pluginId: number, pluginPath: string) {
    await this.pluginManagerStorageAdapter.removeInstalledPluginByPluginId(pluginId, pluginPath);
  }

  public async setPluginValidatorIdOfPluginId(pluginValidatorId: string, pluginId: number, pluginPath: string) {
    await this.pluginManagerStorageAdapter.writePluginValidatorIdOfPluginId(pluginValidatorId, pluginId, pluginPath);
  }

  public async setPluginConfigBYPluginId(pluginConfigElement: PluginConfigElement[], pluginId: number, pluginPath: string) {
    await this.pluginManagerStorageAdapter.setPluginConfigByPluginId(pluginConfigElement, pluginId, pluginPath);
  }

  public async getPluginConfigBYPluginId(pluginId: number, pluginPath: string) {
    const pluginConfig = await this.pluginManagerStorageAdapter.getPluginConfigByPluginId(pluginId, pluginPath);
    return pluginConfig;
  }
}