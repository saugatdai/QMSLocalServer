import * as path from 'path';


import {
  CallAgainDefault,
  CallNextTokenDefault,
  RandomTokenCallDefault,
  TokenBypassDefault
} from '../InterfaceAdapters/TokenCallingStrategiesImplementation';

import PluginFinder from '../UseCases/PluginManagementComponent/PluginScannerModule/PluginFinder';
import TokenCallingFacadeSingleton from '../UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';
import EventManagerSingleton from '../UseCases/EventManagementComponent/EventManagerSingleton';
import PipelineTypes from '../UseCases/PluginManagementComponent/PluginModule/PipelineTypes';
import Plugin from '../UseCases/PluginManagementComponent/PluginModule/Plugin';

export default class Main {
  public async loadPlugins() {
    const pluginFinder = new PluginFinder(path.join(__dirname, '../../plugins'));
    const sortedPlugins = await pluginFinder.getPrioritySortedPlugins();
    console.log(sortedPlugins);
    sortedPlugins.forEach(plugin => {
      // TODO Provision for registering plugin strategies
      this.registerEventHandlersFromPluginIfExists(plugin);
      this.registerPipelineExecutorsFromPluginIfExists(plugin);
    });
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

  public initializeTokenCallingFacade() {
    const callAgainDefault = new CallAgainDefault(async (tokenNumber: number) => { });
    const callNextTokenDefault = new CallNextTokenDefault(async (tokenNumber: number) => { });
    const randomTokenCallDefault = new RandomTokenCallDefault(async (tokenNumber: number) => { })
    const tokenBypassDefault = new TokenBypassDefault(async (tokenNumber: number) => { });
    const tokenCallingFacadeSingleton = TokenCallingFacadeSingleton.getInstance();
    tokenCallingFacadeSingleton.byPassStrategy = tokenBypassDefault;
    tokenCallingFacadeSingleton.callAgainStrategy = callAgainDefault;
    tokenCallingFacadeSingleton.nextTokenStrategy = callNextTokenDefault;
    tokenCallingFacadeSingleton.randomCallStrategy = randomTokenCallDefault;
  }
}