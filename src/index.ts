// para testes funcionais, end to end
// import { fileURLToPath } from "node:url";
// import path, { resolve } from "path";
// import { URL } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const root = resolve(__dirname, "..");

// console.log("fileURLToPath(import.meta.url) ", fileURLToPath(import.meta.url));
// console.log("__dirname ", __dirname);
// console.log("root ", root);

import { SetupServer } from './server';
import config from 'config';

(async (): Promise<void> => {
  const server = new SetupServer(config.get('App.port'));
  await server.init();
  server.start();
})();
