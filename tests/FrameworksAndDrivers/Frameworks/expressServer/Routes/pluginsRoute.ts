import * as path from 'path';

import request from 'supertest';
import PluginManagerStorageImplementation from '../../../../../src/FrameworksAndDrivers/Drivers/PluginManagerStorageImplementation';
import { pluginsPath } from '../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/Constants/OtherConstants';
import server from '../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';
import PluginConfigElement from '../../../../../src/UseCases/PluginManagementComponent/PluginModule/PluginConfigElement';
import PluginFinder from '../../../../../src/UseCases/PluginManagementComponent/PluginScannerModule/PluginFinder';


let adminToken: string;

const setTokens = async () => {
  const adminResponse = await request(server).post('/users/login').send({
    'username': 'shaggy',
    'password': 'mypassword'
  });
  adminToken = adminResponse.body.token;
}


export default () => {
  describe('Testing of plugin routes', () => {
    beforeAll(async () => {
      await setTokens();
      await request(server).delete('/plugins/143').set('Authorization', `Bearer ${adminToken}`).send();
    });

    describe('Testing of plugin read', () => {
      it('Should return all the installed plugin infos', async () => {
        const response = await request(server).get('/plugins').set('Authorization', `Bearer ${adminToken}`).send();
        expect(response.body.length).toBe(2);
      });
    });

    describe('Testing of plugin upload', () => {
      it('should uplaod a zip file plugin', async () => {
        const response1 = await request(server).post('/plugins/installFromArchive')
          .set('Authorization', `Bearer ${adminToken}`).attach('pluginZip', path.join(__dirname, 'pluginsZipped/TestPlugin4.zip'));
        expect(response1.statusCode).toBe(200);
      });
    });

    describe('Getting the plugin by plugin id', () => {
      it('Should get the plugin by plugin id', async () => {
        const response = await request(server).get('/plugins/124').set('Authorization', `Bearer ${adminToken}`).send();
        expect(response.body.pluginInfo.name).toBe('TestPlugin2');
      });
    });

    describe('Plugin Configuration test', () => {
      it('Should get the plugin configuration of a plugin by plugin id', async () => {
        const response = await request(server).get('/plugins/config/125').set('Authorization', `Bearer ${adminToken}`).send();
        expect(response.body.length).toBe(4);
      });

      it('Should set the plugin configuration for a plugin by pluginId', async () => {
        const targetPlugin = (await new PluginFinder(pluginsPath).getPrioritySortedPlugins()).find(plugin => plugin.pluginInfo.pluginId === 125);
        let pluginConfiguration: PluginConfigElement[] = await PluginManagerStorageImplementation.getPluginConfigByPluginId(targetPlugin.pluginInfo.pluginId, pluginsPath);
        let originalValue: string | string[];

        pluginConfiguration = pluginConfiguration.map(configElement => {
          if (configElement.name === "ConfigOptionsA") {
            originalValue = configElement.value;
            if (configElement.value === "ABC123") {
              configElement.value = "Holus";
            }
            else
              configElement.value = "ABC123";
          }
          return configElement;
        });

        await request(server).patch('/plugins/config/125').set('Authorization', `Bearer ${adminToken}`).send({
          pluginsConfig: pluginConfiguration
        })

        const updatedConfig = await PluginManagerStorageImplementation.getPluginConfigByPluginId(targetPlugin.pluginInfo.pluginId, pluginsPath);

        updatedConfig.forEach(config => {
          if (config.name === "ConfigOptionsA") {
            if (originalValue === "ABC123")
              expect(config.value).toBe("Holus");
            else
              expect(config.value).toBe("ABC123");
          }
        })
      });
    });
  });
}