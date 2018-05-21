const webpackMerge = require('webpack-merge');
const commonConfiguration = require('./common');

module.exports = webpackMerge(commonConfiguration, {
  mode: 'production',
});