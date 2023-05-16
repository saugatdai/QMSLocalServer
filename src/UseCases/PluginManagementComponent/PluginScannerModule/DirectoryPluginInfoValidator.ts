import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

import PluginInfo from '../PluginInfo';
import { DirectoryPluginInfoValidatorInterface } from './PluginFinder';
import PluginDirectoryScanner from './PluginDirectoryScanner';

export default class PluginInfoValidator
  implements DirectoryPluginInfoValidatorInterface {
  constructor(private pluginPath: string) { }

  public getValidPluginInfoForADirectory(directory: string): PluginInfo {
    const rawJson = fs.readFileSync(
      path.join(directory, '/pluginInfo.json'),
      'utf-8'
    );
    const pluginInfo: PluginInfo = JSON.parse(rawJson);
    if (!(pluginInfo.name && pluginInfo.pluginId)) {
      throw new Error(
        `The directory\n${this.pluginPath}\ndoesn't has a valid pluginInfo.json`
      );
    }
    return pluginInfo;
  }
  public getValidPluginInfoDirectories(): string[] {
    const pluginDirectoryScanner = new PluginDirectoryScanner(this.pluginPath);
    const pluginDirectories = pluginDirectoryScanner.getPluginDirectories();
    const validDirectories: string[] = pluginDirectories.filter((directory) => {
      const rawJson = fs.readFileSync(
        path.join(directory, '/pluginInfo.json'),
        'utf-8'
      );
      const pluginInfoTemp: PluginInfo = JSON.parse(rawJson);
      return pluginInfoTemp.name && pluginInfoTemp.pluginId;
    });
    return validDirectories;
  }

  public hasPluginInfoValidPluginValidatorId(pluginInfo: PluginInfo): boolean {
    let macAddresses = this.getAllMacAddresses();
    const macAddressToBeHashed = macAddresses.map(macAddress => {
      const pluginId = pluginInfo.pluginId;
      const modifiedMac = macAddress.split(':').join('~');
      const toBeHashed = `${pluginId}~${modifiedMac}`;
      const hash = crypto.createHash('md5').update(toBeHashed).digest('hex');
      return hash;
    })

    return macAddressToBeHashed.some(mac => mac === pluginInfo.pluginValidatorId);
  }

  private getAllMacAddresses(): string[] {
    const allMacs: string[] = [];
    const interfaces = os.networkInterfaces();

    for (const devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (allMacs.some(mac => mac === alias.mac)) {
          continue;
        } else {
          allMacs.push(alias.mac);
        }
      }
    }
    return allMacs;
  }

  private getMacAddressOfNonLoopBackNetworkInterface(): string {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];

      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
          return alias.address;
      }
    }
    return '0.0.0.0';
  }
}
