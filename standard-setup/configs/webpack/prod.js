// production config
const path = require("path");
const { merge } = require("webpack-merge");
const { resolve } = require("path");
const webpack = require("webpack");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const commonConfig = require("./common");

const projectDir = resolve(__dirname, "../..");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    filename: "js/[name].[contenthash:4].js",
    chunkFilename: "[name].[chunkhash:4].js",
    path: resolve(__dirname, "../../dist"),
    publicPath: "/standard",
    clean: true,
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: "manifest",
    },
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: "filename:[name]",
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.join(projectDir, "tsconfig.json"),
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: "write-references",
      },
      // watch: app.paths.src,
    }),
    new WebpackNotifierPlugin({
      excludeWarnings: true,
      title: "Anti-Hex-Bug-Division",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:4].css",
      chunkFilename: "[name].[chunkhash:4].css",
    }),
    new BundleAnalyzerPlugin({ analyzerMode: "static" }),
  ],
});
