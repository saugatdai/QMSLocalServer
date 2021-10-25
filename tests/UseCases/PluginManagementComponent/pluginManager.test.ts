import * as path from 'path';
import PluginManager, { PluginManagerStorageInteractorAdapter } from '../../../src/UseCases/PluginManagementComponent/PluginManager';
import PluginConfigElement from '../../../src/UseCases/PluginManagementComponent/PluginModule/PluginConfigElement';

describe('Testing of the PluginManager class', () => {
  const pluginPath = path.join(__dirname, 'plugins');

  const installPluginFromArchiveMock = jest.fn();
  const installPluginFromArchive = async (pluginPath: string) => {
    installPluginFromArchiveMock();
  }

  const deleteInstalledPluginByPluginIdMock = jest.fn();
  const deleteInstalledPluginByPluginId = async (pluginId: number) => {
    deleteInstalledPluginByPluginIdMock();
  }

  const setPluginValidatorIdOfPluginIdMock = jest.fn();
  const setPluginValidatorIdOfPluginId = async (pluginValidatorId: string, pluginId: number) => {
    setPluginValidatorIdOfPluginIdMock();
  }

  const setPluginConfigBYPluginIdMock = jest.fn();
  const setPluginConfigBYPluginId = async (pluginConfig: PluginConfigElement[], pluginId: number, pluginPath: string) => {
    setPluginConfigBYPluginIdMock();
  }

  const getPluginConfigBYPluginIdMock = jest.fn();
  const getPluginConfigBYPluginId = async (pluginId: number, pluginPath: string) => {
    getPluginConfigBYPluginIdMock();
    return null;
  }

  const pluginManagerStorageInteractorAdapter: PluginManagerStorageInteractorAdapter = {
    installPluginFromArchive,
    deleteInstalledPluginByPluginId,
    setPluginValidatorIdOfPluginId,
    getPluginConfigBYPluginId,
    setPluginConfigBYPluginId
  }

  const pluginManager = new PluginManager(pluginPath);
  pluginManager.pluginManagerStorageInteractorAdapter = pluginManagerStorageInteractorAdapter;
  it('Should get all installed plugins', async () => {
    const allPlugins = await pluginManager.getInstalledPlugins();
    expect(allPlugins.length).toBe(2);
  });
  it('Should extract a plugin archive to a plugins directory', async () => {
    await pluginManager.installPluginFromArchive('dummyPath');
    expect(installPluginFromArchiveMock.mock.calls.length).toBe(1);
  });
  it('Should delete an installed plugin', async () => {
    await pluginManager.deleteInstalledPluginByPluginId(123);
    expect(deleteInstalledPluginByPluginIdMock.mock.calls.length).toBe(1);
  });
  it('Should set a pluginValidatorId of a pluign id', async () => {
    await pluginManager.setPluginValidatorIdOfPluginId('dummyId', 123);
    expect(setPluginValidatorIdOfPluginIdMock.mock.calls.length).toBe(1);
  });
  it('Should get plguin config', async () => {
    await pluginManager.getPluginConfigBYPluginId(123);
    expect(getPluginConfigBYPluginIdMock.mock.calls.length).toBe(1);
  });
  it('Should set plugin config', async () => {
    await pluginManager.setPluginConfigByPluginId([], 22)
    expect(setPluginConfigBYPluginIdMock.mock.calls.length).toBe(1);
  })
});
