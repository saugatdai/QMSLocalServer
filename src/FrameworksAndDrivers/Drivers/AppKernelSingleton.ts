import * as fs from 'fs';

import {
  CallAgainDefault,
  CallNextTokenDefault,
  RandomTokenCallDefault,
  TokenBypassDefault,
  TokenForwardDafault
} from '../../InterfaceAdapters/TokenCallingStrategiesImplementation';

import PluginFinder from '../../UseCases/PluginManagementComponent/PluginScannerModule/PluginFinder';
import TokenCallingFacadeSingleton from '../../UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';
import EventManagerSingleton from '../../UseCases/EventManagementComponent/EventManagerSingleton';
import PipelineTypes from '../../UseCases/PluginManagementComponent/PluginModule/PipelineTypes';
import Plugin from '../../UseCases/PluginManagementComponent/PluginModule/Plugin';
import { defaultPostCaller, postCallRunnerForCallAgain, postCallRunnerForRandomCall, preCallRunnerForByPass, preCallRunnerForCallAgain, preCallRunnerForCallNext, preCallRunnerForRandomCall, preCallRunnerForTokenForward } from './DefaultStrategies/preAndPostCallRunners';
import EventTypes from '../../UseCases/EventManagementComponent/EventTypes';

export default class AppKernelSingleton {

  private static instance = new AppKernelSingleton();

  public static getInstance() {
    return this.instance;
  }

  public async initializeCoreCallingActivities(pluginPath: string) {
    this.initializeTokenCallingFacadeWithDefaultStrategies();
    const pluginFinder = new PluginFinder(pluginPath);
    const sortedPlugins = await pluginFinder.getPrioritySortedPlugins();
    sortedPlugins.forEach(plugin => {
      this.registerStrategiesFromPluginIfExists(plugin);
    });
    sortedPlugins.forEach(plugin => {
      this.registerEventHandlersFromPluginIfExists(plugin);
      this.registerPipelineExecutorsFromPluginIfExists(plugin);
    });
    EventManagerSingleton.getInstance().on(EventTypes.PLUGIN_ZIP_EXTRACTED, async (zipFile: string) => {
      await fs.promises.unlink(zipFile);
    });
    console.log("Kernel initialized...");
  }

  private registerStrategiesFromPluginIfExists(plugin: Plugin) {
    const tokenCallingFacadeSingleton = TokenCallingFacadeSingleton.getInstance();
    if (plugin.bypassStrategy) {
      tokenCallingFacadeSingleton.byPassStrategy = plugin.bypassStrategy;
    }
    if (plugin.callAgainStrategy) {
      tokenCallingFacadeSingleton.callAgainStrategy = plugin.callAgainStrategy;
    }
    if (plugin.nextTokenStrategy) {
      tokenCallingFacadeSingleton.nextTokenStrategy = plugin.nextTokenStrategy;
    }
    if (plugin.randomCallStrategy) {
      tokenCallingFacadeSingleton.randomCallStrategy = plugin.randomCallStrategy;
    }
    if (plugin.tokenForwardStrategy) {
      tokenCallingFacadeSingleton.tokenForwardStrategy = plugin.tokenForwardStrategy;
    }
  }

  private registerEventHandlersFromPluginIfExists(plugin: Plugin) {
    const eventManagerSingleton = EventManagerSingleton.getInstance();
    if (plugin.eventHandlers && plugin.eventHandlers.length) {
      plugin.eventHandlers.forEach(eventHandler => {
        eventManagerSingleton.on(eventHandler.eventType, eventHandler.handleEvent);
      });
    }
  }

  private registerPipelineExecutorsFromPluginIfExists(plugin: Plugin) {
    const tokenCallingFacadeSingleton = TokenCallingFacadeSingleton.getInstance();
    if (plugin.pipelineExecutors && plugin.pipelineExecutors.length) {
      plugin.pipelineExecutors.forEach(pipelineExecutor => {
        if (pipelineExecutor.pipelineType === PipelineTypes.BYPASS_TOKEN) {
          pipelineExecutor.features.forEach(feature => {
            tokenCallingFacadeSingleton.pipeByPassTokenFeature(feature);
          });
        } else if (pipelineExecutor.pipelineType === PipelineTypes.CALL_AGAIN_TOKEN) {
          pipelineExecutor.features.forEach(feature => {
            tokenCallingFacadeSingleton.pipeCallTokenAgainFeature(feature);
          });
        } else if (pipelineExecutor.pipelineType === PipelineTypes.CALL_NEXT_TOKEN) {
          pipelineExecutor.features.forEach(feature => {
            tokenCallingFacadeSingleton.pipeNextTokenFeature(feature);
          });
        } else if (pipelineExecutor.pipelineType === PipelineTypes.RANDOM_CALL) {
          pipelineExecutor.features.forEach(feature => {
            tokenCallingFacadeSingleton.pipeRandomTokenFeature(feature);
          });
        } else if (pipelineExecutor.pipelineType === PipelineTypes.FORWARD_TOKEN) {
          pipelineExecutor.features.forEach(feature => {
            tokenCallingFacadeSingleton.pipeTokenForwardFeature(feature);
          });
        }
      });
    }
  }

  private initializeTokenCallingFacadeWithDefaultStrategies() {
    const callAgainDefault = new CallAgainDefault(preCallRunnerForCallAgain, postCallRunnerForCallAgain);
    const callNextTokenDefault = new CallNextTokenDefault(preCallRunnerForCallNext, defaultPostCaller);
    const randomTokenCallDefault = new RandomTokenCallDefault(preCallRunnerForRandomCall, postCallRunnerForRandomCall)
    const tokenBypassDefault = new TokenBypassDefault(preCallRunnerForByPass, defaultPostCaller);
    const tokenForwardDefault = new TokenForwardDafault(preCallRunnerForTokenForward, defaultPostCaller);

    const tokenCallingFacadeSingleton = TokenCallingFacadeSingleton.getInstance();
    tokenCallingFacadeSingleton.byPassStrategy = tokenBypassDefault;
    tokenCallingFacadeSingleton.callAgainStrategy = callAgainDefault;
    tokenCallingFacadeSingleton.nextTokenStrategy = callNextTokenDefault;
    tokenCallingFacadeSingleton.randomCallStrategy = randomTokenCallDefault;
    tokenCallingFacadeSingleton.tokenForwardStrategy = tokenForwardDefault
  }
}
