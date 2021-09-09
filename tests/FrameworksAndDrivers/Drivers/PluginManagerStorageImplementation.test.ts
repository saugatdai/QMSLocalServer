import * as path from 'path';

import PluginManager from "../../../src/UseCases/PluginManagementComponent/PluginManager";
import PluginManagerStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/PluginManagerStorageImplementation';
import PluginConfigElement from '../../../src/UseCases/PluginManagementComponent/PluginModule/PluginConfigElement';
import PluginFinder from '../../../src/UseCases/PluginManagementComponent/PluginScannerModule/PluginFinder';


describe('Testing of PluginManagerStorageImplementation', () => {
  const pluginManager = new PluginManager(path.join(__dirname, 'pluginsManagerPlugin'));
  const tempPath = path.join(__dirname, 'temp');
  const pluginsPath = path.join(__dirname, 'pluginsManagerPlugin');

  it('Should install a plugin from archive', async () => {
    await PluginManagerStorageImplementation.installPluginFromArchiveFile(`${tempPath}/TestPlugin3.zip`, pluginsPath);
    const allPlugins = await pluginManager.getInstalledPlugins();
    expect(allPlugins.length).toBe(3);
  });

  it('Should write a pluginValidatorId of a plugin', async () => {
    await PluginManagerStorageImplementation.writePluginValidatorIdOfPluginId('holusmolus', 125, pluginsPath);
    const allPlugins = await pluginManager.getInstalledPlugins();
    const targetPlugin = allPlugins.find(plugin => plugin.pluginInfo.pluginId === 125);
    expect(targetPlugin.pluginInfo.pluginValidatorId).toBe('holusmolus');
  });

  it('Should remove an installed plugin', async () => {
    await PluginManagerStorageImplementation.removeInstalledPluginByPluginId(126, pluginsPath);
    const allPlugins = await pluginManager.getInstalledPlugins();
    expect(allPlugins.length).toBe(2);
  });

  it('Should get the plugin configuration of a plugin', async () => {
    const pluginConfiguration: PluginConfigElement[] = await PluginManagerStorageImplementation.getPluginConfigByPluginId(125, pluginsPath);
    expect(pluginConfiguration.length).toBe(2);
  });

  it('Should throw an exception for non existing configuration file', async () => {
    expect(async () => { await PluginManagerStorageImplementation.getPluginConfigByPluginId(124, pluginsPath) }).rejects.toThrow();
  });

  it('Should set the plugin configuration of a plugin', async () => {
    const targetPlugin = (await new PluginFinder(pluginsPath).getPrioritySortedPlugins()).find(plugin => plugin.pluginInfo.pluginId === 125);
    let pluginConfiguration: PluginConfigElement[] = await PluginManagerStorageImplementation.getPluginConfigByPluginId(targetPlugin.pluginInfo.pluginId, pluginsPath);
    let originalValue: string | string[];

    pluginConfiguration = pluginConfiguration.map(configElement => {
      if (configElement.name === "ConfigOptionsA") {
        originalValue = configElement.value;
        if (configElement.value === "ABC123") {
          configElement.value = "Holus";
        }
        else
          configElement.value = "ABC123";
      }
      return configElement;
    });

    await PluginManagerStorageImplementation.setPluginConfigByPluginId(pluginConfiguration, targetPlugin.pluginInfo.pluginId, pluginsPath);

    const updatedConfig = await PluginManagerStorageImplementation.getPluginConfigByPluginId(targetPlugin.pluginInfo.pluginId, pluginsPath);

    updatedConfig.forEach(config => {
      if (config.name === "ConfigOptionsA") {
        if (originalValue === "ABC123")
          expect(config.value).toBe("Holus");
        else
          expect(config.value).toBe("ABC123");
      }
    })
  });
});