import PluginConfigElement from './PluginModule/PluginConfigElement';

import PluginFinder from "./PluginScannerModule/PluginFinder";

export interface PluginManagerStorageInteractorAdapter {
  installPluginFromArchive: (archivePath: string, pluginPath: string) => Promise<void>;
  deleteInstalledPluginByPluginId: (pluginID: number, pluginPath: string) => Promise<void>;
  setPluginValidatorIdOfPluginId: (pluginValidatorId: string, pluginId: number, pluginPath: string) => Promise<void>;
  getPluginConfigBYPluginId: (pluginId: number, pluginPath: string) => Promise<PluginConfigElement[]>;
  setPluginConfigBYPluginId: (pluginConfig: PluginConfigElement[], pluginId: number, pluginPath: string) => Promise<void>;
}

export default class PluginManager {
  constructor(private pluginPath: string) { }

  private _pluginManagerStorageInteractorAdapter: PluginManagerStorageInteractorAdapter;

  public set pluginManagerStorageInteractorAdapter(interactor: PluginManagerStorageInteractorAdapter) {
    this._pluginManagerStorageInteractorAdapter = interactor;
  }

  public async getInstalledPlugins() {
    const pluginFinder = new PluginFinder(this.pluginPath);
    const allPlugins = await pluginFinder.getPrioritySortedPlugins();
    return allPlugins;
  }

  public async installPluginFromArchive(archivePath: string) {
    await this._pluginManagerStorageInteractorAdapter.installPluginFromArchive(archivePath, this.pluginPath);
  }

  public async deleteInstalledPluginByPluginId(pluginId: number) {
    await this._pluginManagerStorageInteractorAdapter.deleteInstalledPluginByPluginId(pluginId, this.pluginPath);
  }

  public async setPluginValidatorIdOfPluginId(pluginValidatorId: string, pluginId: number) {
    await this._pluginManagerStorageInteractorAdapter.setPluginValidatorIdOfPluginId(pluginValidatorId, pluginId, this.pluginPath);
  }

  public async setPluginConfigByPluginId(pluginConfigObject: PluginConfigElement[], pluginId: number) {
    await this._pluginManagerStorageInteractorAdapter.setPluginConfigBYPluginId(pluginConfigObject, pluginId, this.pluginPath);
  }

  public async getPluginConfigBYPluginId(pluginId: number) {
    const pluginConfiguration = await this._pluginManagerStorageInteractorAdapter.getPluginConfigBYPluginId(pluginId, this.pluginPath);
    return pluginConfiguration;
  }
}