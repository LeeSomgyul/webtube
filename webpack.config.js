const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry: {//신규코드 > 고전코드로 변경하고자 하는 파일
        main: "./src/frontend/js/main.js",
        videoPlayer: "./src/frontend/js/videoPlayer.js",
    },
    mode: "development",
    watch: true,
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
            }),
        ],
    output: {//[변경 후 저장]
        filename: "js/[name].js",//저장할 파일(name = entry파일들)
        path: path.resolve(__dirname, "assets"),//저장할 위치
        clean: true,
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', { targets: "defaults" }]],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ],
    },
}