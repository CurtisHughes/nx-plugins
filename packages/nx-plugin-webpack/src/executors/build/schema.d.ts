export interface BuildExecutorSchema {
  entry: string;
  outputPath: string;
  tsConfig: string;
  webpackConfig: string;
  outputFilename?: string;
}
