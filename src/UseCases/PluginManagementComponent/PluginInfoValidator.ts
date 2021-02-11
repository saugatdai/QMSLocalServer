import * as fs from 'fs';
import * as path from 'path';

import {PluginInfo} from './PluginFinder';
import PluginDirectoryScanner from './PluginDirectoryScanner';

export default class PluginInfoValidator{

    private validPluginInfos: PluginInfo[];
    private validDirectoryInfos: string[];
    
    constructor(private pluginPath: string){}
    public getValidPluginInfos(): PluginInfo[]{
        const allPlugins = this.getPluginInfos();
        this.validPluginInfos = allPlugins.filter(plugin => {
          return plugin.name && plugin.pluginId;
        });
        return this.validPluginInfos;
      }

      private getPluginInfos(): PluginInfo[] {
        const pluginDirectoryScanner = new PluginDirectoryScanner(this.pluginPath);
        const pluginDirectories = pluginDirectoryScanner.getPluginDirectories();
        const pluginInfo: PluginInfo[] = pluginDirectories.map(directories => {
          const rawJson = fs.readFileSync(path.join(directories,'/pluginInfo.json'),'utf-8');
          const pluginInfoTemp: PluginInfo = JSON.parse(rawJson);
          return pluginInfoTemp;
        });
        return pluginInfo;
      }

      public getValidPluginInfoDirectories(): string[] {
        const pluginDirectoryScanner = new PluginDirectoryScanner(this.pluginPath);
        const pluginDirectories = pluginDirectoryScanner.getPluginDirectories();
        const validDirectories: string[] = pluginDirectories.map(directory => {
          const rawJson = fs.readFileSync(path.join(directory,'/pluginInfo.json'),'utf-8');
          const pluginInfoTemp: PluginInfo = JSON.parse(rawJson);
          if(pluginInfoTemp.name && pluginInfoTemp.pluginId){
            return directory;
          }
        });
        return validDirectories;
      }
}