/**
 * @description : This file is not mine and come from a Typescript & ExpressJS article on medium
 * @author : Pierre Anthill 
 * @source : https://medium.com/@Pierre_anthill/typescript-expressjs-api-with-webpack-4655126d884b
 */
let fs = require('fs');
let nodeModules = {};


fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './server.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'server.js',
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
        ]
    },
    target: 'node',
    externals: nodeModules,
};