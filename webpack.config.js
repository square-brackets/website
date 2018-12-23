const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
  },

  mode: process.env.NODE_ENV || 'development',

  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    }, {
      test: /\.hbs$/,
      loader: 'handlebars-loader',
      query: {
        extensions: ['.hbs'],
        rootRelative: path.join(__dirname, 'src', 'templates/')
      }
    }, {
      test: /\.(woff(2)?|ttf|eot|svg|otf)$/,
      loader: 'file-loader'
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.hbs'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets' }
    ])
  ]
};
