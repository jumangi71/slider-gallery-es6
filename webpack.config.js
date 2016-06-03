var path        = require('path');
var webpack     = require('webpack');
var Manifest    = require('manifest-revision-webpack-plugin');
var TextPlugin  = require('extract-text-webpack-plugin');
var HtmlPlugin    = require('html-webpack-plugin');

var autoprefixer = require('autoprefixer-core');
var _path = __dirname;
var dependencies  = Object.keys(require(_path + '/package').dependencies);
var rootAssetPath = './app/assets';

module.exports = {

  entry: {
    app: _path + '/app/assets/js/app.js',
    //vendors: dependencies
  },

  output: {
    path: _path,
    filename: '[chunkhash].[name].js',
    chunkFilename: '[chunkhash].[id].js',
    publicPath: './'
  },

  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules'],
    alias: {
      _app: path.join(_path, 'app', 'assets', 'javascripts'),
      _stylesheets: path.join(_path, 'app', 'assets', 'stylesheets'),
      _templates: path.join(_path, 'app', 'assets', 'templates'),
      _images: path.join(_path, 'app', 'assets', 'images')
      // _icons: path.join(_path, 'app', 'assets', 'icons', 'fontcustom')
    }
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /(node_modules|autoprefixer)/, loader: 'babel'},
      { test: /\.jade$/, loader: 'jade-loader' },
      { test: /\.(ttf|eot|otf|woff|woff2)$/i, loaders: ['file-loader'] },
      { test: /\.styl$/i, loader: TextPlugin.extract('style-loader', 'css-loader?minimize!postcss-loader!stylus-loader') },
      { test: /\.css$/, loader: TextPlugin.extract('style-loader', 'css-loader') },
      //{ test: /\.(png|ico|jpg|jpeg|gif|svg)$/i, loaders: ['file?context=' + rootAssetPath + '&name=[path][hash].[name].[ext]'] }
    ]
  },

  postcss: [autoprefixer({ browsers: ['last 5 versions'] })],

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', '[chunkhash].vendors.js'),
    new TextPlugin('[chunkhash].[name].css'),
    new Manifest(path.join(_path, 'manifest.json'), {
      rootAssetPath: rootAssetPath
    }),
    new HtmlPlugin({
      title: 'Test APP',
      chunks: ['app', 'vendors'],
      filename: 'index.html',
      template: path.join(_path, 'app', 'index.html')
    })
  ]
};

