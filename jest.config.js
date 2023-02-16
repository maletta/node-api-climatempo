// import { fileURLToPath } from "node:url";
// import path, { resolve } from "path";
// import { URL } from "url";

// const __dirname = path.dirname(new URL(import.meta.url));
// const root = resolve(__dirname);

// export default {
//   rootDir: root,
//   displayName: "root-tests",
//   testMatch: ["<rootDir>/src/**/*.test.ts"], // só vai dar match dentro da pasta /src
//   testEnvironment: "node",
//   clearMocks: true, // vai limpar os mocks por padrão
//   preset: "ts-jest",
//   moduleNameMapper: {
//     "@src/(.*)": "<rootDir>/src/$1", // para poder usar os alias criados no typescript
//     "@test/(.*)": "<rootDir>/test/$1", // para poder usar os alias criados no typescript
//   },
// };

const { resolve } = require('path');
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
};
