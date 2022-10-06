// para testes funcionais, end to end

// import { fileURLToPath } from "url";
// import path, { resolve } from "path";
// // import { URL } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const root = resolve(__dirname, "..");

// // usado para importar dinamicamente
// const rootConfig = await import(`${root}/jest.config.js`);

// export default {
//   ...rootConfig,
//   ...{
//     rootDir: root,
//     displayName: "end2end-tests",
//     setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
//     testMatch: ["<rootDir>/test/**/*.test.ts"],
//   },
// };

const { resolve } = require("path");
const root = resolve(__dirname, "..");
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  ...{
    rootDir: root,
    displayName: "end2end-tests",
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
    testMatch: ["<rootDir>/test/**/*.test.ts"],
  },
};
