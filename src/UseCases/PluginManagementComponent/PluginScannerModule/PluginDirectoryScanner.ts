import * as fs from 'fs';
import * as path from 'path';
export default class PluginDirectoryScanner{
    constructor(private pluginPath: string){}

    public getPluginDirectories(): string[] {
        const pluginDirectoriesAbsolutePath = this.getAbsolutePathOfAllPluginSubDirectories();
        const pluginDirectories = pluginDirectoriesAbsolutePath.filter(directory => {
          if(fs.existsSync(path.join(directory,'/pluginInfo.json'))){
            return directory;
          }
        });
        return pluginDirectories;
      }
      private getAbsolutePathOfAllPluginSubDirectories(): string[]{
        const directoriesInsidePluginDirectory = this.getAllDirectoriesInsidePluginDirectory();
        const absolutePluginDirectories = directoriesInsidePluginDirectory.map(
          (pluginDirectory) => {
            return path.join(this.pluginPath, `/${pluginDirectory}`);
          }
        );
        return absolutePluginDirectories;
      }
      private getAllDirectoriesInsidePluginDirectory(): string[] {
        const allDirectories = fs.readdirSync(this.pluginPath, {
          withFileTypes: true,
        })
          .filter((gotFile) => gotFile.isDirectory())
          .map((directoryObject) => directoryObject.name);
    
          return allDirectories;
      }
}