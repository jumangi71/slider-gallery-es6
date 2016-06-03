var path        = require('path');
var webpack     = require('webpack');
var Manifest    = require('manifest-revision-webpack-plugin');
var TextPlugin  = require('extract-text-webpack-plugin');
var HtmlPlugin    = require('html-webpack-plugin');

//var jsonPresent = require('./helpers/json-presenter');

var autoprefixer = require('autoprefixer-core');
var _path = __dirname;
var dependencies  = Object.keys(require(_path + '/package').dependencies);
var rootAssetPath = './app/assets';

module.exports = {

  entry: {
    application: _path + '/app/assets/js/app.js',
    vendors: dependencies
  },

  output: {
    path: path.join(_path, 'public', 'assets'),
    filename: '[chunkhash].[name].js',
    chunkFilename: '[chunkhash].[id].js',
    publicPath: '/assets/'
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
      //{ test: /\.jade$/, loader: 'jade-loader' },
      { test: /\.(ttf|eot|otf|woff|woff2)$/i, loaders: ['file-loader'] },
      //{ test: /\.styl$/, loader: 'stylint'},
      { test: /\.styl$/i, loader: TextPlugin.extract('style-loader', 'css-loader?minimize!postcss-loader!stylus-loader') },
      { test: /\.css$/, loader: TextPlugin.extract('style-loader', 'css-loader') },
      //{ test: /\.(png|ico|jpg|jpeg|gif|svg)$/i, loaders: ['file?context=' + rootAssetPath + '&name=[path][hash].[name].[ext]'] }
    ]
  },

  postcss: [autoprefixer({ browsers: ['last 5 versions'] })],

  plugins: [
    //new webpack.DefinePlugin({
    //  'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    //}),
    new webpack.optimize.CommonsChunkPlugin('vendors', '[chunkhash].vendors.js'),
    new TextPlugin('[chunkhash].[name].css'),
    new Manifest(path.join(_path + '/config', 'manifest.json'), {
      rootAssetPath: rootAssetPath
    }),
    new HtmlPlugin({
      title: 'Test APP',
      chunks: ['application', 'vendors'],
      filename: 'index.html',
      template: path.join(_path, 'app', 'index.html')
    })
    //new SvgStore(path.join(_path + '/app/assets/images/icons', '**/*.svg'), path.join('/images'), {
    //  name: '[hash].sprite.svg',
    //  chunk: 'app',
    //  baseUrl: '',
    //  prefix: 'icon_'
    //}),
    //new Manifest(path.join(_path + '/config', 'manifest.json'), {
    //  rootAssetPath: rootAssetPath,
    //  ignorePaths: ['/stylesheets', '/javascript', '/logos', '/svg', '/svgs'],
    //  format: jsonPresent
    //})
  ]
};

