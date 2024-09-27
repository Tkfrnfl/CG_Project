
const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv=require('dotenv')

module.exports = {



  entry: "./src/index.tsx", // 번들링 시작 위치
  output: {
    path: path.join(__dirname, "/dist"), // 번들 결과물 위치
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /[\.js]$/, // .js 에 한하여 babel-loader를 이용하여 transpiling
        exclude: /node_module/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ts|tsx$/, // .ts 에 한하여 ts-loader를 이용하여 transpiling
        exclude: /node_module/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.(glb)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // JS에서 CSS를 삽입
          'css-loader', // CSS를 JS로 변환
          'postcss-loader', // PostCSS를 사용하여 CSS 처리
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|json)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]', // 원래 파일 이름과 경로 유지
              outputPath: 'images/', // 출력할 경로
              publicPath: 'images/', // 웹에서 접근할 경로
            },
          },
        ],
      }
    ],
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"], // 모듈 위치
    extensions: [".ts", ".js",".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // 템플릿 위치
      filename: './index.html',
      favicon: './public/favicon.ico',
      manifest: "./public/manifest.json",
    }),
    new CopyPlugin({
        patterns: [
          { from: 'src/assets', to: 'assets/' },
        ],
      }),

  ],
  devServer: {
    host: "localhost", // live-server host 및 port
    port: 5500,
  },
  mode: "development", // 번들링 모드 development / production
};