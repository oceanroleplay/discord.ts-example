const path = require("path");
const nodeExternals = require("webpack-node-externals");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const ROOT = path.resolve(__dirname, "./src");
const DESTINATION = path.resolve(__dirname, "./dist");

module.exports = (env) => {
  return {
    mode: "production",
    entry: "./src/index.ts",
    plugins: [
      new Dotenv({
        path: "./.env.production",
        safe: true,
      }),
    ],
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      extensions: [".ts"],
      modules: [ROOT, "node_modules"],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "./dist"),
    },
  };
};
