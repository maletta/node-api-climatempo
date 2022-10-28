import { SetupServer } from '@src/server';
import supertest from 'supertest';

// beforeAll executa antes de todos os testes, esse arquivo aqui é defidnido pra ser chamado
// nos arquivos de configuração do jest: jest.config.js

let server: SetupServer;
beforeAll(async () => {
  // inicia o servidor e passa ele para uma variável global
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
});
