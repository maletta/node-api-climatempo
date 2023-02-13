import config, { IConfig } from 'config';
import {
  connect as mongooseConnect,
  connection,
  ConnectOptions,
} from 'mongoose';

const dbConfig: IConfig = config.get('App.database');

function validateOptions(options: ConnectOptions): ConnectOptions {
  return options.user && options.pass && options.dbName ? options : {};
}

export const connect = async (): Promise<void> => {
  console.log('------------------ database log ------------------------');
  console.log('mongo url', dbConfig.get('mongoUrl'));

  const options: ConnectOptions = {
    dbName: dbConfig.get('mongoDatabase'),
    pass: dbConfig.get('mongoPassword'),
    user: dbConfig.get('mongoUser'),
  };

  console.log('------------------ database options -------------------------');
  console.log(options);

  await mongooseConnect(dbConfig.get('mongoUrl'), validateOptions(options));
};

export const close = (): Promise<void> => connection.close();
