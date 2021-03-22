/* eslint-disable @typescript-eslint/no-var-requires */
import rollup = require('rollup');
import typescript = require('@rollup/plugin-typescript');
import { resolve } from 'path';
import { BuildExecutorSchema } from './schema';

export default async function (options: BuildExecutorSchema) {
  const defaultConfig: rollup.RollupOptions = {
    input: resolve(process.cwd(), options.input),
    plugins: [
      (typescript as any)({
        tsconfig: resolve(process.cwd(), options.tsConfig),
      }),
    ],
  };

  const config: rollup.RollupOptions = require(resolve(
    process.cwd(),
    options.rollupConfig
  ))(defaultConfig);

  const bundle = await rollup.rollup(config);

  const outputOptions = Array.isArray(config.output)
    ? config.output
    : [config.output];

  await Promise.all(
    (<Array<rollup.OutputOptions>>outputOptions).map((o) => bundle.write(o))
  );

  return { success: true };
}
