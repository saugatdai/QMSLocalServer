import * as path from "path";

import PluginDirectoryScanner from "../../../src/UseCases/PluginManagementComponent/PluginScannerModule/PluginDirectoryScanner";
import PluginFinder from "../../../src/UseCases/PluginManagementComponent/PluginScannerModule/PluginFinder";
import DirectoryPluginInfoValidator from "../../../src/UseCases/PluginManagementComponent/PluginScannerModule/DirectoryPluginInfoValidator";
import PluginInfo from "../../../src/UseCases/PluginManagementComponent/PluginInfo";
import PluginLoader from "../../../src/UseCases/PluginManagementComponent/PluginLoader";

describe("Test for plugin management component", () => {
  const pluginPath = path.join(__dirname, "/plugins");

  const pluginDirectoryScanner = new PluginDirectoryScanner(pluginPath);
  const directoryPluginInfoValidator = new DirectoryPluginInfoValidator(
    pluginPath
  );
  const pluginFinder = new PluginFinder(pluginPath);

  describe("Testing of PluginDirectoryScanner", () => {
    it("Should list all the directories inside plugin folder", () => {
      const expectedDirectories = [
        `${pluginPath}/plugin1`,
        `${pluginPath}/plugin2`,
        `${pluginPath}/plugin3`,
      ];
      const directories = pluginDirectoryScanner.getPluginDirectories();
      expect(directories).toEqual(expectedDirectories);
    });
  });

  describe("Testing of DirectoryPluginInfoValidator", () => {
    it("Should list only valid directories", () => {
      const validDirectories = directoryPluginInfoValidator.getValidPluginInfoDirectories();

      const expectedValidDirectories = [
        `${pluginPath}/plugin1`,
        `${pluginPath}/plugin2`,
      ];

      expect(validDirectories).toEqual(expectedValidDirectories);
    });

    it("Should return pluginInfo of a given valid directory", () => {
      const expectedPluginInfo = {
        name: "Plugin 1",
        version: "1.0.0",
        minCoreVersion: "1.0.0",
        pluginId: 123,
        pluginValidatorID: "123abc",
      };

      const directory = path.join(__dirname, "/plugins/plugin1");
      const pluginInfo: PluginInfo = directoryPluginInfoValidator.getValidPluginInfoForADirectory(
        directory
      );

      expect(expectedPluginInfo).toEqual(pluginInfo);
    });

    it("Should throw an error for an invalid plugin directory", () => {
      const directory = path.join(__dirname, "/plugins/plugin3");
      expect(() => {
        directoryPluginInfoValidator.getValidPluginInfoForADirectory(directory);
      }).toThrow();
    });
  });

  describe("Testing of PluginFinder", () => {
    it("Should get the valid plugins", () => {
      const pluginInfo1 = {
        name: "Plugin 1",
        version: "1.0.0",
        minCoreVersion: "1.0.0",
        pluginId: 123,
        pluginValidatorID: "123abc",
      };

      const pluginInfo2 = {
        name: "Plugin 2",
        version: "1.0.0",
        minCoreVersion: "1.0.0",
        pluginId: 124,
        pluginValidatorID: "124abc",
      };
      pluginFinder.scanForPlugins().then((plugins) => {
        expect(plugins[0].pluginInfo).toEqual(pluginInfo1);
        expect(plugins[1].pluginInfo).toEqual(pluginInfo2);
      });
    });
  });

  describe('Testing of PluginLoader class', () => {
    const pluginLoader = new PluginLoader(pluginPath);
    pluginLoader.initializePlugins();
  });
});
