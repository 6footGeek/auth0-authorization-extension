'use strict';

const webpack = require('webpack');
const winston = require('winston');
winston.info('Running development configuration...\r\n');

const WEBPACK_HOST = 'localhost';
const WEBPACK_PORT = 3001;

let config = require('./config.base.js');

// Override base configuration.
config.devtool = 'eval';
config.debug = true;
config.entry.app = [
  'webpack-dev-server/client?http://' + WEBPACK_HOST + ':' + WEBPACK_PORT,
  'webpack/hot/only-dev-server',
  config.entry.app
];
config.output.publicPath = 'http://localhost:3001' + config.output.publicPath;

// Stats configuration.
config.stats = {
  colors: true,
  reasons: true
};

// Development modules.
config.module.loaders.push({
  test: /\.css$/,
  loader: 'style-loader!css-loader!postcss-loader'
});

// Webpack plugins.
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),

  // Separate the vender in a different file.
  new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
]);

module.exports = config;
