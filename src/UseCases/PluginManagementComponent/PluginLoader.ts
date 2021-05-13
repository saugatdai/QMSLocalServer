import Plugin from './PluginModule/Plugin';

export interface PluginFinderInterface {
    scanForPlugins: () => Promise<Plugin[]>;
}
