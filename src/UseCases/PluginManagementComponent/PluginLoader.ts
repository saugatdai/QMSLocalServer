import PluginFinder from './PluginScannerModule/PluginFinder';
import Plugin from './PluginModule/Plugin';

export interface PluginFinderInterface{
    scanForPlugins : () => Promise<Plugin[]>;
}

export default class PluginLoader{
    constructor(private pluginPath: string){}
    
    public initializePlugins(): void{
        const pluginFinder: PluginFinderInterface = new PluginFinder(this.pluginPath);
        pluginFinder.scanForPlugins().then(plugins => {
            plugins.forEach(plugin => {
                // TODO initialization part remaining...
            });
        });
    }    
}