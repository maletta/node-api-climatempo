import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';

const dbConfig: IConfig = config.get('App.database');

export const connect = async (): Promise<void> => {
  console.log('------------------ database log -------------------------');
  console.log('mongo url', dbConfig.get('mongoUrl'));
  await mongooseConnect(dbConfig.get('mongoUrl'), {
    // auth: { authSource: 'admin' },
    user: process.env.MONGOUSER,
    pass: process.env.MONGOPASSWORD,
    dbName: 'surf-forecast',
  }).then((error) => {
    if (error) {
      console.log(error);
      return console.log('Unable to connect to the db.');
    }
  });
};

export const close = (): Promise<void> => connection.close();
