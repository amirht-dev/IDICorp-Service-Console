import module from 'react-use-websocket';

if (!('default' in module))
  throw new Error('failed to resolve useWebSocket from module');

export const useWebSocket = module.default as typeof module;
