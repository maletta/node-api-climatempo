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
import logger from './logger';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

// node não crash mais com unhandledRejection, então para não deixá-las solta, observamos quando ocorrem
// promises tem catch e lançamos uma exceção no final que finaliza a app.
// melhor finalizar a app e reiniciá-la no cloud porque tem pouco custo.
process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting deu to an unhandled promise: ${promise} and reason: ${reason}`
  );

  // lets throw the error and let the uncaughtException handle below handle it
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`App exiting deu to an uncaught exception: ${error}`);
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();

    // recupero alguns sinais e crio evento listener para cada um
    // tratamento de desligamento de app por serviço externo: graceful shutdown
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.map((sig) =>
      process.on(sig, async () => {
        try {
          await server.close();
          logger.info('App exited with success');
          process.exit(ExitStatus.Success);
        } catch (error) {
          logger.error(`App exited with error ${error}`);
          process.exit(ExitStatus.Failure);
        }
      })
    );
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
