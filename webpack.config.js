const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const path = require('path')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: __dirname,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
      modules: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, './'),
      ]
  }
};
