const webpack = require('webpack');
const AwsSamPlugin = require('aws-sam-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const awsSamPlugin = new AwsSamPlugin({ vscodeDebug: false });

function getTypeormBrowserDummy(...names) {
  return names.map(name => new webpack.NormalModuleReplacementPlugin(
    new RegExp(`typeorm.+${name}\\.js`),
    path.resolve(__dirname, 'node_modules', 'typeorm', 'browser', 'platform', 'BrowserDisabledDriversDummy.js')
  ));
}

function getTypeormLocalDummy(...names) {
  return names.map(name => new webpack.NormalModuleReplacementPlugin(
    new RegExp(`typeorm.+${name}\\.js`),
    path.resolve(__dirname, 'src', 'typeorm-dummy.js')
  ));
}

const config = {
  // Loads the entry object from nodejs AWS::Serverless::Function resources in the SAM template
  entry: () => {
    return Object.entries(awsSamPlugin.entry())
      .reduce((o, [k, v]) => ({ ...o, [k]: ['source-map-support/register', 'reflect-metadata', v] }), {});
  },

  output: {
    filename: '[name]/app.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.aws-sam', 'build')
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },

  target: 'node',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },

  plugins: [
    awsSamPlugin,
    new webpack.NormalModuleReplacementPlugin(
      /typeorm.+PlatformTools\.js/,
      path.resolve(__dirname, 'src', 'typeorm-lambda-platform-tools.js')
    ),
    ...getTypeormBrowserDummy(
      'MongoDriver',
      'MongoQueryRunner',
      'MongoEntityManager',
      'MongoRepository',
      'OracleDriver',
      'PostgresDriver',
      'SapDriver',
      'SqlServerDriver'),
    ...getTypeormLocalDummy(
      'AuroraDataApiDriver',
      'CockroachDriver',
      'CordovaDriver',
      'ExpoDriver',
      'NativescriptDriver',
      'ReactNativeDriver',
      'AbstractSqliteDriver',
      'SqliteDriver',
      'SqljsDriver',
      'SqljsEntityManager',
      'TreeRepository',
      'MigrationExecutor',
      'MongoSchemaBuilder')
  ],

  optimization: {
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // Includes the aws-sdk only for development. The node12.x docker image
    // used by SAM CLI Local doesn't include it but it's included in the actual
    // Lambda runtime.
    config.externals = ['aws-sdk'];
  }

  if (env && env.analyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
}
;
