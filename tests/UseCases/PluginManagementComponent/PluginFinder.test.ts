import PluginFinder from "../../../src/UseCases/PluginManagementComponent/PluginFinder";
import PluginInfoValidator from "../../../src/UseCases/PluginManagementComponent/PluginInfoValidator";

import * as path from "path";

describe("Test of plugin finder class", () => {
  const expectedPluginInfos = [
    {
      name: "Plugin 1",
      version: "1.0.0",
      minCoreVersion: "1.0.0",
      pluginId: 123,
      pluginValidatorID: "123abc",
    },
    {
      name: "Plugin 2",
      version: "1.0.0",
      minCoreVersion: "1.0.0",
      pluginId: 124,
      pluginValidatorID: "124abc",
    },
    { name: "Plugin 3", pluginId: 35, minCoreVersion: "1.2.0" },
  ];

  const pluginPath = path.join(__dirname, "/plugins");

  const expectedDirectoriesWithValidPluginInfo = [
    `${pluginPath}/plugin1`,
    `${pluginPath}/plugin2`,
    `${pluginPath}/plugin3`,
  ];

  const pluginInfoValidator = new PluginInfoValidator(pluginPath);
  const pluginFinder = new PluginFinder(pluginPath);
  const validDirectories = pluginInfoValidator.getValidPluginInfoDirectories();
  const validPluginInfos = pluginInfoValidator.getValidPluginInfos();

  describe("Testing for scanForPlugins method of pluginFinder", () => {
    it('Should make all expectations for scanForPlugins true', () => {
      pluginFinder.scanForPlugins().then((plugins) => {
        plugins.forEach((plugin) => {
          expect(plugin.eventHandlers).toBeTruthy();
        });
      });
    })
  });

  describe("Testing of PluginINfoValidator class", () => {
    it("Should get the expected plugin directories", () => {
      expect(validDirectories).toEqual(expectedDirectoriesWithValidPluginInfo);
    });
    it("Should get the expected plugin infos", () => {
      expect(validPluginInfos).toEqual(expectedPluginInfos);
    });
  });
});
