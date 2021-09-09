export default interface PluginConfigElement {
  name: string
  configType: string,
  value: string | string[];
  choiceOptions?: string[];
}