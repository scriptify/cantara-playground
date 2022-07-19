// production config
const { merge } = require("webpack-merge");
const { resolve } = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    filename: "js/[name].[contenthash:4].js",
    chunkFilename: "[name].[chunkhash:4].js",
    path: resolve(__dirname, "../../dist"),
    // publicPath: "/standard",
    clean: true,
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: "[name].[contenthash:4].css",
    //   chunkFilename: "[name].[chunkhash:4].css",
    // }),
  ],
});
