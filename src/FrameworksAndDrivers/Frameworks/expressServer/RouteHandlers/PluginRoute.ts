import Controller from "../Decorators/Controller";
import { del, get, patch, post } from "../Decorators/PathAndRequestMethodDecorator";
import use from "../Decorators/MiddlewareDecorator";
import { auth, checkAdminAuthority } from "../Middlewares/UserMiddlewares";
import PluginManagerStorageInteractorImplementation from "../../../../InterfaceAdapters/PluginManagerStorageInteractorImplementation";
import PluginManagerStorageImplementation from "../../../Drivers/PluginManagerStorageImplementation";
import PluginManager from "../../../../UseCases/PluginManagementComponent/PluginManager";
import { pluginsPath } from "../Constants/OtherConstants";
import { Request, Response } from "express";
import FileUploadMiddleware from "../Middlewares/fileUpload/FileUploadMiddleware"; import PluginConfigElement from "../../../../UseCases/PluginManagementComponent/PluginModule/PluginConfigElement";
import AppKernelSingleton from "../../../Drivers/AppKernelSingleton";
import Plugin from "../../../../UseCases/PluginManagementComponent/PluginModule/Plugin";
import PluginInfoValidator from "../../../../UseCases/PluginManagementComponent/PluginScannerModule/DirectoryPluginInfoValidator";

interface AllPluginsInterface {
  plugin: Plugin,
  valid: boolean;
}

@Controller('/plugins')
class pluginRoute {
  @get('/')
  @use(auth)
  @use(checkAdminAuthority)
  public async getAllPlugins(req: Request, res: Response) {
    try {
      const pluginManagerStorageInteractorImplementation = new PluginManagerStorageInteractorImplementation(PluginManagerStorageImplementation);
      const pluginManager = new PluginManager(pluginsPath);
      pluginManager.pluginManagerStorageInteractorAdapter = pluginManagerStorageInteractorImplementation;
      const allPlugins = await pluginManager.getInstalledPlugins();
      const pluginInfoValidator: PluginInfoValidator = new PluginInfoValidator(pluginsPath);
      const allPluginsWithValidity = allPlugins.map(plugin => {
        const pluginWithValidity: AllPluginsInterface = {
          plugin,
          valid: pluginInfoValidator.hasPluginInfoValidPluginValidatorId(plugin.pluginInfo)
        }

        return pluginWithValidity;
      });
      res.status(200).send(allPlugins);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/:id')
  @use(auth)
  @use(checkAdminAuthority)
  public async getPluginByPluginId(req: Request, res: Response) {
    try {
      const pluginManagerStorageInteractorImplementation = new PluginManagerStorageInteractorImplementation(PluginManagerStorageImplementation);
      const pluginManager = new PluginManager(pluginsPath);
      pluginManager.pluginManagerStorageInteractorAdapter = pluginManagerStorageInteractorImplementation;
      const allPlugins = await pluginManager.getInstalledPlugins();
      const targetPlugin = allPlugins.find(plugin => plugin.pluginInfo.pluginId === parseInt(req.params.id));
      if (targetPlugin) {
        res.status(200).send(targetPlugin);
      } else {
        res.status(500).send({ error: `Plugin with plugin id ${req.params.id} not found` });
      }
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @post('/installFromArchive')
  @use(auth)
  @use(checkAdminAuthority)
  @use(FileUploadMiddleware.single('pluginZip'))
  public async installPluginFromZipArchive(req: Request, res: Response) {
    try {
      const pluginManagerStorageInteractorImplementation = new PluginManagerStorageInteractorImplementation(PluginManagerStorageImplementation);
      const pluginManager = new PluginManager(pluginsPath);
      pluginManager.pluginManagerStorageInteractorAdapter = pluginManagerStorageInteractorImplementation;
      await pluginManager.installPluginFromArchive(req.file.path);
      res.status(200).send({ success: "Plugin Installed" });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @del('/:pluginId')
  @use(auth)
  @use(checkAdminAuthority)
  public async deletePluginByPluginId(req: Request, res: Response) {
    const pluginManagerStorageInteractorImplementation = new PluginManagerStorageInteractorImplementation(PluginManagerStorageImplementation);
    const pluginManager = new PluginManager(pluginsPath);
    pluginManager.pluginManagerStorageInteractorAdapter = pluginManagerStorageInteractorImplementation;
    try {
      await pluginManager.deleteInstalledPluginByPluginId(parseInt(req.params.pluginId));
      AppKernelSingleton.getInstance().unloadAllEventsAndPipelines();
      await AppKernelSingleton.getInstance().initializeCoreCallingActivities(pluginsPath);
      res.status(200).send({ success: "Plugin Deleted" });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/config/:pluginId')
  @use(auth)
  @use(checkAdminAuthority)
  public async getPluginConfigById(req: Request, res: Response) {
    const pluginManagerStorageInteractorImplementation = new PluginManagerStorageInteractorImplementation(PluginManagerStorageImplementation);
    const pluginManager = new PluginManager(pluginsPath);
    pluginManager.pluginManagerStorageInteractorAdapter = pluginManagerStorageInteractorImplementation;

    try {
      const pluginConfiguration = await pluginManager.getPluginConfigBYPluginId(parseInt(req.params.pluginId));
      res.status(200).send(pluginConfiguration);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @patch('/config/:pluginId')
  @use(auth)
  @use(checkAdminAuthority)
  public async setPluginConfigById(req: Request, res: Response) {
    const pluginManagerStorageInteractorImplementation = new PluginManagerStorageInteractorImplementation(PluginManagerStorageImplementation);
    const pluginManager = new PluginManager(pluginsPath);
    pluginManager.pluginManagerStorageInteractorAdapter = pluginManagerStorageInteractorImplementation;

    try {
      const pluginsConfig: PluginConfigElement[] = req.body.pluginsConfig;
      if (!pluginsConfig) {
        throw new Error('Plugin Config Data Error');
      }
      await pluginManager.setPluginConfigByPluginId(pluginsConfig, parseInt(req.params.pluginId));
      res.status(200).send({ success: "Plugin Configuration updated" });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }
}