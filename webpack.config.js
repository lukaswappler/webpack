const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {  
  mode: 'development',
  entry: {    
    vuebomber: {
      import: './src/app.js',
      dependOn: "shared"
    },    
    shared: 'lodash'    
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: 'My Webpack project',
      template: 'src/vue.html'
    }),
    new FaviconsWebpackPlugin('src/assets/favicon.png'),
    new VueLoaderPlugin()
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(wav)$/i,        
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.vue$/i,
        use: 'vue-loader'
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  }
};