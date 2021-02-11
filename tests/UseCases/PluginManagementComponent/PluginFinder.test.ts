import PluginFinder from "../../../src/UseCases/PluginManagementComponent/PluginFinder";
import * as path from "path";

describe("Test of plugin finder class", () => {
  const expectedPlugins = [
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
  const pluginFinder = new PluginFinder(pluginPath);
  const directories = pluginFinder.scanForValidDirectories();
  const infos = pluginFinder.scanForPlugins();
  it("should always be true", () => {
    expect(true).toBeTruthy();
  });
});
