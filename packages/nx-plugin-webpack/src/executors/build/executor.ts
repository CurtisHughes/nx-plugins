/* https://github.com/nrwl/nx/blob/041340b06a4cedf72ca2c317a781447a8d6df6e7/packages/web/src/utils/config.ts */
/* eslint-disable @typescript-eslint/no-var-requires */
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack = require('webpack');
import { resolve } from 'path';
import { BuildExecutorSchema } from './schema';

export default async function (
  options: BuildExecutorSchema
): Promise<{ success: boolean }> {
  const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];
  const mainFields = ['module', 'main', 'es2015'];
  const config = require(resolve(process.cwd(), options.webpackConfig))(
    {
      mode: options.mode,
      entry: resolve(process.cwd(), options.entry),
      output: {
        filename: options.outputFilename,
        path: resolve(process.cwd(), options.outputPath),
      },
      resolve: {
        modules: [
          resolve(__dirname, '..', '..', 'node_modules'),
          'node_modules',
        ],
        extensions,
        plugins: [
          new TsconfigPathsPlugin({
            configFile: resolve(process.cwd(), options.tsConfig),
            extensions,
            mainFields,
          }),
        ],
      },
    },
    options
  );

  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        reject(err);
      }

      console.log(
        stats.toString({
          colors: true,
        })
      );

      resolve({ success: true });
    });
  });
}
