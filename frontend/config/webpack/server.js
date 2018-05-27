const webpackMerge = require('webpack-merge');
const commonConfiguration = require('./common');

module.exports = webpackMerge(commonConfiguration, {
  mode: 'development',
  devServer: {
    open: true,
    overlay: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
});