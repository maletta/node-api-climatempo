import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';

const dbConfig: IConfig = config.get('App.database');

export const connect = async (): Promise<void> => {
  console.log('------------------ database log -------------------------');
  console.log('mongo url', dbConfig.get('mongoUrl'));
  await mongooseConnect(dbConfig.get('mongoUrl'));
};

export const close = (): Promise<void> => connection.close();
