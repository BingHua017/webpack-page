const path = require('path');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  stats: 'errors-warnings',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 以 @ 表示 src 目录
      config: path.resolve(__dirname, 'config'),
    },
  },
  entry: getEntries(),
  output: {
    filename: '[name]/index.[contenthash:8].js',
    chunkFilename: '[name]/index.[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    asyncChunks: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: (pathData) => {
            const filePath = path.dirname(pathData.filename).split('/');
            return `${filePath[filePath.indexOf('pages') + 1]}/images/[name].[contenthash:8][ext][query]`;
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true, // 可选：是否压缩 HTML 文件
            },
          },
        ],
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [...getHtmlPlugins(), ...getCopyPlugins()],
  performance: {
    hints: false,
    maxAssetSize: 300000,
    maxEntrypointSize: 500000,
  },
};

module.exports = webpackConfig;

// 获取所有子文件夹的entry配置
function getEntries() {
  const entries = {};
  const pagesPath = path.resolve(__dirname, 'src/pages');
  const folders = glob.sync('*', { cwd: pagesPath, onlyDirectories: true });
  folders.forEach((folder) => {
    const folderName = path.basename(folder);
    entries[folderName] = `./src/pages/${folder}/index.js`;
  });
  return entries;
}

// 获取所有子文件夹的HtmlWebpackPlugin配置
function getHtmlPlugins() {
  const htmlPlugins = [];
  const pagesPath = path.resolve(__dirname, 'src/pages');
  const faviconPath = path.resolve(__dirname, 'src/assets/favicon.ico');
  const folders = glob.sync('*', { cwd: pagesPath, onlyDirectories: true });
  folders.forEach((folder) => {
    const folderName = path.basename(folder);
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        filename: `${folderName}/index.html`,
        chunkFilename: `${folderName}/index.js`,
        template: `./src/pages/${folder}/index.html`,
        chunks: [folderName],
        hash: true, // 添加 hash 到文件名
        cache: false, // 禁用缓存
        minify: false, // 启用压缩
        favicon: faviconPath,
      })
    );
  });
  return htmlPlugins;
}

// 获取所有子文件夹的CopyWebpackPlugin配置
function getCopyPlugins() {
  const copyPlugins = [];
  const pagesPath = path.resolve(__dirname, 'src/pages');
  const folders = glob.sync('*', { cwd: pagesPath, onlyDirectories: true });
  folders.forEach((folder) => {
    const folderName = path.basename(folder);
    copyPlugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './src/assets/favicon.ico', // 指定favicon图标文件的源路径
            to: `${folderName}/favicon.ico`, // 指定favicon图标文件的目标路径
          },
        ],
      })
    );
  });
  return copyPlugins;
}
