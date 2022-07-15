// production config
const { merge } = require("webpack-merge");
const { resolve } = require("path");
const webpack = require("webpack");

const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    filename: "js/[name].[contenthash:4].js",
    chunkFilename: "[name].[chunkhash:4].js",
    path: resolve(__dirname, "../../dist"),
    publicPath: "/standard",
    clean: true,
  },
  devtool: "source-map",
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
  ],
});
