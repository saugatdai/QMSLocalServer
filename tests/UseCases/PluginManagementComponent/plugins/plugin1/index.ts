import { plugin1EventHandler1 } from './EventHandlers';
import { plugin1EventHandler2 } from './EventHandlers';
import { Plugin } from './Interfaces';

const plugin1: Plugin = {
  eventHandlers: [plugin1EventHandler1, plugin1EventHandler2],
  priority: 2,
};

export default plugin1;
