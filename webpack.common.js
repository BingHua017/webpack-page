const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PAGE_MODULE_NAME = 'index';

const webpackConfig = {
  stats: 'errors-warnings',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 以 @ 表示 src 目录
      config: path.resolve(__dirname, 'config'),
    },
    extensions: ['.js', '.jsx', '.less'],
  },
  entry: {
    [PAGE_MODULE_NAME]: `./src/pages/${PAGE_MODULE_NAME}/index.js`,
  },
  output: {
    filename: 'bundle.[contenthash:8].js',
    assetModuleFilename: 'images/[hash][ext]',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
        generator: {
          filename: `js/[name][ext]`,
        },
      },
      {
        test: /\.(ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: `[name][ext]`,
        },
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|gif|webp)$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: 'images/',
              esModule: false, // 关闭ES模块语法，启用CommonJS模块语法
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false, // 可选：是否压缩 HTML 文件
              sources: {
                list: [
                  '...',
                  {
                    tag: 'van-image',
                    attribute: 'src',
                    type: 'src',
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `./src/pages/${PAGE_MODULE_NAME}/index.html`,
      hash: true, // 添加 hash 到文件名
      cache: false, // 禁用缓存
      minify: true, // 启用压缩
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: `bundle.[contenthash:8].css`,
    }),
  ],
  performance: {
    hints: false,
    maxAssetSize: 300000,
    maxEntrypointSize: 500000,
  },
};

module.exports = webpackConfig;
