import extract from 'extract-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { PluginManagerStorageAdapter } from "../../InterfaceAdapters/PluginManagerStorageInteractorImplementation";
import EventManagerSingleton from '../../UseCases/EventManagementComponent/EventManagerSingleton';
import EventTypes from '../../UseCases/EventManagementComponent/EventTypes';
import PluginConfigElement from '../../UseCases/PluginManagementComponent/PluginModule/PluginConfigElement';
import PluginFinder from '../../UseCases/PluginManagementComponent/PluginScannerModule/PluginFinder';
import { readFile } from './TokenCategoryCountStorageImplementation';

const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const deleteFolderRecursive = (directoryPath: string) => {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

const installPluginFromArchiveFile = async (archivePath: string, pluginPath: string) => {
  await extract(archivePath, { dir: pluginPath });
  EventManagerSingleton.getInstance().emit(EventTypes.PLUGIN_ZIP_EXTRACTED, archivePath);
}

const removeInstalledPluginByPluginId = async (pluginID: number, pluginPath: string) => {
  const pluginFinder = new PluginFinder(pluginPath);
  const allPlugins = await pluginFinder.getPrioritySortedPlugins();
  const targetPlugin = allPlugins.find(plugin => plugin.pluginInfo.pluginId === pluginID);
  if (targetPlugin) {
    const targetDirectory = targetPlugin.pluginDirectory;
    deleteFolderRecursive(targetDirectory);
  } else {
    throw new Error(`Plugin with pluginId ${pluginID} not found`);
  }
}

const writePluginValidatorIdOfPluginId = async (pluginValidatorId: string, pluginId: number, pluginPath: string) => {
  const pluginFinder = new PluginFinder(pluginPath);
  const allPlugins = await pluginFinder.getPrioritySortedPlugins();

  const targetPlugin = allPlugins.find(plugin => plugin.pluginInfo.pluginId === pluginId);
  const pluginInfo = targetPlugin.pluginInfo;
  pluginInfo.pluginValidatorId = pluginValidatorId;
  const pluginInfoFilePath = path.join(targetPlugin.pluginDirectory, 'pluginInfo.json');

  await writeFile(pluginInfoFilePath, JSON.stringify(pluginInfo));
}

const getPluginConfigByPluginId = async (pluginId: number, pluginPath: string) => {
  const pluginFinder = new PluginFinder(pluginPath);
  const allPlugins = await pluginFinder.getPrioritySortedPlugins();
  const targetPlugin = allPlugins.find(plugin => plugin.pluginInfo.pluginId === pluginId);
  const targetDirectory = targetPlugin.pluginDirectory;
  const file = path.join(targetDirectory, 'pluginConfig.json');
  if (fs.existsSync(file)) {
    const pluginConfigJSON = await readFile(file);
    const pluginConfig: PluginConfigElement[] = JSON.parse(pluginConfigJSON) as PluginConfigElement[];
    return pluginConfig;
  } else {
    throw new Error("Configuration file for the plugin doesn't exists");
  }
};

const setPluginConfigByPluginId = async (pluginConfig: PluginConfigElement[], pluginId: number, pluginPath: string) => {
  const pluginConfigJSON = JSON.stringify(pluginConfig);

  const pluginFinder = new PluginFinder(pluginPath);
  const allPlugins = await pluginFinder.getPrioritySortedPlugins();
  const targetPlugin = allPlugins.find(plugin => plugin.pluginInfo.pluginId === pluginId);
  const targetDirectory = targetPlugin.pluginDirectory;
  const file = path.join(targetDirectory, 'pluginConfig.json');
  if (fs.existsSync(file)) {
    await writeFile(file, pluginConfigJSON);
  } else {
    throw new Error("Configuration file for the plugin doesn't exists")
  }
}

const PluginManagerStorageImplementation: PluginManagerStorageAdapter = {
  installPluginFromArchiveFile,
  removeInstalledPluginByPluginId,
  writePluginValidatorIdOfPluginId,
  getPluginConfigByPluginId,
  setPluginConfigByPluginId
}

export default PluginManagerStorageImplementation;