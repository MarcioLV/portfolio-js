//Trae path (que ya esta disponible en node)
const path = require('path')
//htmlwebpackplugin es un plugin para injectar js,css,favicon
//y nos facilita la tarea de enlazar los bundles a nuestro template HTML
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  //Marca el punto de entrada de la aplicacion
  entry: "./src/index.js",
  //Output nos permite decir hacia donde va a enviar lo
  //que va a preparar webpack
  output: {
    //Path es donde estara la carpeta donde se guardara
    //los archivos
    path: path.resolve(__dirname, "dist"),
    //filename le pone el nombre del archivo final
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  resolve: {
    //Aqui ponemos las extensiones que tendremos en nuestro
    //proyecto para webpack los lea
    extensions: [".js"],
    alias: {
      '@utils': path.resolve(__dirname,'src/utils/'),
      '@templates': path.resolve(__dirname,'src/templates/'),
      '@styles': path.resolve(__dirname,'src/styles/'),
      '@images': path.resolve(__dirname,'src/assets/images/'),
    }
  },
  module: {
    //Reglas para trabajar con webpack
    rules: [
      {
        test: /\.m?js$/, //lee los archivos con extension .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css|.styl$/i,
        use:[MiniCssExtractPlugin.loader, 'css-loader','stylus-loader']
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: "aplication/font-woff",
            name: "[name].[contenthash].[ext]",
            outputPath: "./assets/fonts/",
            publicPath: "../assets/fonts/",
            esModule: false,
          },
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, //Inyecta el bundle al template html
      template: './public/index.html',//La ruta al template html
      filename: './index.html'//Nombre final del archivo
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
      }
    ),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets/images'),
          to: "assets/images"
        }
      ]
    }),
    new Dotenv(),
    new CleanWebpackPlugin(),

  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
  }
  
}