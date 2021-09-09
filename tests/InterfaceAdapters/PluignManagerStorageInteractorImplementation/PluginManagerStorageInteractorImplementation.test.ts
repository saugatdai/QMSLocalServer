import PluginManagerStorageInteractorImplementation, { PluginManagerStorageAdapter } from "../../../src/InterfaceAdapters/PluginManagerStorageInteractorImplementation";
import PluginConfigElement from "../../../src/UseCases/PluginManagementComponent/PluginModule/PluginConfigElement";

describe('Testing of PluginManagerStorageInteractorImplementation', () => {
  const installPluginFromArchiveFileMock = jest.fn();
  const removeInstalledPluginByPluginIdMock = jest.fn();
  const writePluginValidatorIdOfPluginIdMock = jest.fn();
  const getPluginConfigBYPluginIdMock = jest.fn();
  const setPluginConfigBYPluginIdMock = jest.fn();

  const installPluginFromArchiveFile = async (archivePath: string) => {
    installPluginFromArchiveFileMock();
  }
  const removeInstalledPluginByPluginId = async (pluginId: number) => {
    removeInstalledPluginByPluginIdMock();
  }
  const writePluginValidatorIdOfPluginId = async (pluginValidatorId: string, pluginId: number) => {
    writePluginValidatorIdOfPluginIdMock();
  }

  const getPluginConfigByPluginId = async (pluignId: number, pluginPath: string) => {
    getPluginConfigBYPluginIdMock();
    return null;
  }

  const setPluginConfigByPluginId = async (pluginConfigElement: PluginConfigElement, pluignId: number, pluginPath: string) => {
    setPluginConfigBYPluginIdMock();
  }

  const pluginManagerStorageAdapter: PluginManagerStorageAdapter = {
    installPluginFromArchiveFile,
    removeInstalledPluginByPluginId,
    writePluginValidatorIdOfPluginId,
    getPluginConfigByPluginId,
    setPluginConfigByPluginId
  }

  const pulginManagerStorageInteractorImplementation = new PluginManagerStorageInteractorImplementation(pluginManagerStorageAdapter);

  it('Should install a plugin from an archive file', async () => {
    await pluginManagerStorageAdapter.installPluginFromArchiveFile('sfsda', 'dfsdf');
    expect(installPluginFromArchiveFileMock.mock.calls.length).toBe(1);
  });

  it('Should remove an installed plugin', async () => {
    await pluginManagerStorageAdapter.removeInstalledPluginByPluginId(123, 'dsfsdfsdf');
    expect(removeInstalledPluginByPluginIdMock.mock.calls.length).toBe(1);
  });

  it('Should write plugin validator id of a plugin', async () => {
    await pluginManagerStorageAdapter.writePluginValidatorIdOfPluginId('adf', 123, 'sdfdsfds');
    expect(writePluginValidatorIdOfPluginIdMock.mock.calls.length).toBe(1);
  });

  it('Should get plugin config of a plugin', async () => {
    await pluginManagerStorageAdapter.getPluginConfigByPluginId(123, 'abc');
    expect(getPluginConfigBYPluginIdMock.mock.calls.length).toBe(1);
  });

  it('Should set the plugin config of a plugin', async () => {
    await pluginManagerStorageAdapter.setPluginConfigByPluginId(null, 123, 'adsf');
  });

});