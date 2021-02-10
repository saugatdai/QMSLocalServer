import PluginFinder from '../../../src/UseCases/PluginManagementComponent/PluginFinder';
import * as path from 'path';

describe('Test of plugin finder class', () => {
    const pluginPath = path.join(__dirname, '/plugins');
    const pluginFinder = new PluginFinder(pluginPath);
    const directories = pluginFinder.scanForPlugins();
    it('should always be true', () => {
        expect(true).toBeTruthy();
    });
});