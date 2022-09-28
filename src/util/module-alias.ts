import * as path from "path";
import moduleAlias from "module-alias";

const files = path.resolve(__dirname, "../..");

moduleAlias.addAliases({
  "@src": path.join(files, "src"),
  "@test": path.join(files, "test"),
});

/**
 * O compilador vai buildar esse arquivo em uma pasta separa chamada ./dist/util
 * Acho que este e todos os arquivos gerados dentro de ./dist são importados assim que a aplicação inicia com yarn start
 * então o moduleAlias já está rodando mapeando os arquivos com aliases declardos na função.
 *
 * A importação na ide e no typescript é feita com o mapeamento em tsconfig.
 *
 * Neste arquivo é feito o mapeamento para depois que o projeto é buildado, para que o mapeamento depois de compilado
 * funcione assim como está descrito no tsconfig.
 */

/**
 * Aliases são úteis, mas confuso porque precisei configurar ele:
 *
 * - no typescript, no arquivo tsconfig.json
 * - no código final, no arquivo module-alias, para os arquivos finais conseguirem mapear as importações
 * - no jest.config.js, usando a propriedade moduleNameMapper
 *
 */
