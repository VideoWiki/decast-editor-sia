/* =========================================================================================
  File Name: vue.config.js
  Description: configuration file of vue
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//  .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      'https://api.fairos.io/api': {
        target: 'https://dev.cast.video.wiki/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      '/api': {
        target: 'https://dev.cast.video.wiki/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /web3\.storage/,
          use: 'raw-loader',
        },
      ],
    },
    plugins: [new CompressionPlugin()],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
};
