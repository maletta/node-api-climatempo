import './util/module-alias'; // precisa ser importaado antes de tudo, pode gerar error de cant find module
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import * as database from '@src/database';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import logger from './logger';
import apiSchema from './api.schema.json';
import { apiErrorValidator } from './middleware/api-error.validator';

export class SetupServer extends Server {
  constructor(public port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.docsSetup();
    this.setupControllers();
    await this.databaseSetup();
    this.setupErrorHandlers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino(logger)); // add logs de header e response para cada request no console
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  private async docsSetup(): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document, // documento json precisa ser tipado
        validateRequests: true,
        validateResponses: true,
      })
    );
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    return await database.connect();
  }

  public async close(): Promise<void> {
    return await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port:' + this.port);
    });
  }
}
