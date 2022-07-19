// shared config (dev and prod)
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.tsx",
  resolve: {
    extensions: [
      ".web.js",
      ".mjs",
      ".js",
      ".json",
      ".web.jsx",
      ".jsx",
      ".ts",
      ".tsx",
      ".html",
      ".htm",
    ],
  },
  context: resolve(__dirname, "../../src"),
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        exclude: [
          /\.(js|jsx|ts|tsx|mjs|ejs|scss|css)$/,
          /\.html?$/,
          /\.json$/,
          /\.css$/,
        ],
        parser: {
          dataUrlCondition: {
            maxSize: 15000,
          },
        },
        generator: {
          filename: "static/media/[name].[contenthash:8].[ext]",
        },
        type: "asset",
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "index.html.ejs" })],
};
