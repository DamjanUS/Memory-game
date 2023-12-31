const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src/main.js'),
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                            importLoaders: 1
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.postcss$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                            importLoaders: 1
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            }, {
                test: /\.jpg/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        watchContentBase: true,
        open: true,
        writeToDisk: true,
    },
    optimization: {
        minimizer: [
          // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
          '...',
          new CssMinimizerPlugin(),
        ],
      },
      output: {
        assetModuleFilename: 'images/[hash][ext][query]'
      }

}