const webpackMerge = require('webpack-merge');
const commonConfiguration = require('./common');

module.exports = webpackMerge(commonConfiguration, {
  mode: 'development',
  devServer: {
    open: true,
    overlay: true,
  },
});