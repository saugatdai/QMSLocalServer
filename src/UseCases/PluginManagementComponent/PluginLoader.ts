import PluginFinder from './PluginFinder';
import Plugin from './Plugin';

export default class PluginLoader{
    constructor(private pluginPath: string){}
    
    public initializePlugins(): void{
        const pluginFinder = new PluginFinder(this.pluginPath);
        pluginFinder.scanForPlugins().then(plugins => {
            plugins.forEach(plugin => {
                console.log(plugin);
            });
        });
    }
    
}