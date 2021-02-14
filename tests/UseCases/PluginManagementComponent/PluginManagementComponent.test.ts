import * as path from 'path';

import PluginDirectoryScanner from '../../../src/UseCases/PluginManagementComponent/PluginScannerModule/PluginDirectoryScanner';
import PluginFinder from '../../../src/UseCases/PluginManagementComponent/PluginScannerModule/PluginFinder';
import DirectoryPluginInfoValidator from '../../../src/UseCases/PluginManagementComponent/PluginScannerModule/DirectoryPluginInfoValidator';
import PluginInfo from '../../../src/UseCases/PluginManagementComponent/PluginInfo';

describe('Test for plugin management component', () => {
  const pluginPath = path.join(__dirname, '/plugins');

  const pluginDirectoryScanner = new PluginDirectoryScanner(pluginPath);
  const directoryPluginInfoValidator = new DirectoryPluginInfoValidator(
    pluginPath
  );
  const pluginFinder = new PluginFinder(pluginPath);

  describe('Testing of PluginDirectoryScanner', () => {
    it('Should list all the directories inside plugin folder', () => {
      const expectedDirectories = [
        '/home/embeddedsaugat/Documents/Projects/QMS/SourceCode/LocalServer/tests/UseCases/PluginManagementComponent/plugins/plugin1',
        '/home/embeddedsaugat/Documents/Projects/QMS/SourceCode/LocalServer/tests/UseCases/PluginManagementComponent/plugins/plugin2',
        '/home/embeddedsaugat/Documents/Projects/QMS/SourceCode/LocalServer/tests/UseCases/PluginManagementComponent/plugins/plugin3',
      ];
      const directories = pluginDirectoryScanner.getPluginDirectories();
      expect(directories).toEqual(expectedDirectories);
    });
  });

  describe('Testing of DirectoryPluginInfoValidator', () => {
    it('Should list only valid directories', () => {
      const validDirectories = directoryPluginInfoValidator.getValidPluginInfoDirectories();

      const expectedValidDirectories = [
        '/home/embeddedsaugat/Documents/Projects/QMS/SourceCode/LocalServer/tests/UseCases/PluginManagementComponent/plugins/plugin1',
        '/home/embeddedsaugat/Documents/Projects/QMS/SourceCode/LocalServer/tests/UseCases/PluginManagementComponent/plugins/plugin2',
      ];

      expect(validDirectories).toEqual(expectedValidDirectories);
    });

    it('Should return pluginInfo of a given valid directory', () => {
      const expectedPluginInfo = {
        name: 'Plugin 1',
        version: '1.0.0',
        minCoreVersion: '1.0.0',
        pluginId: 123,
        pluginValidatorID: '123abc',
      };

      const directory = path.join(__dirname, '/plugins/plugin1');
      const pluginInfo: PluginInfo = directoryPluginInfoValidator.getValidPluginInfoForADirectory(
        directory
      );

      expect(expectedPluginInfo).toEqual(pluginInfo);
    });

    it('Should throw an error for an invalid plugin directory', () => {
      const directory = path.join(__dirname, '/plugins/plugin3');
      expect(() => {
        directoryPluginInfoValidator.getValidPluginInfoForADirectory(directory);
      }).toThrow();
    });
  });

  describe('Testing of PluginFinder', () => {
    pluginFinder.scanForPlugins().then((plugin) => {
      console.log(plugin);
    });
  });
});
