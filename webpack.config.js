const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.join(__dirname, 'index.web.js'),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      clean: true,
      publicPath: '/',
    },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules[/\\](?!react-native-)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-class-properties', { loose: true }],
              [
                'module-resolver',
                {
                  alias: {
                    '^react-native$': 'react-native-web',
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ['file-loader'],
      },
    ],
  },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        } : false,
      }),
    ],
    resolve: {
      extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
      alias: {
        'react-native$': 'react-native-web',
        // Add common native module aliases
        'react-native-linear-gradient': 'react-native-web-linear-gradient',
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      historyApiFallback: true,
      hot: true,
      port: 3001,
      open: true,
    },
    optimization: isProduction ? {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    } : {},
  };
};
