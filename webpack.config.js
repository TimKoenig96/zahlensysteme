import CopyPlugin from "copy-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";

export default (_, { mode }) => {
	const isProd = (mode === "production");

	return {
		entry: "./src/scripts/main.js",

		output: {
			path: resolve("./dist/"),
			filename: "script.js",
			clean: true
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: "./src/index.html",
				inject: true,
				scriptLoading: "module",
				minify: {
					removeRedundantAttributes: false,
					collapseWhitespace: isProd,
					removeComments: isProd
				}
			}),

			new CopyPlugin({
				patterns: [{
					from: "./src",
					noErrorOnMissing: true,
					globOptions: {
						ignore: [ "**/*.html", "**/*.js" ]
					}
				}]
			}),

			isProd && new CssMinimizerPlugin()
		].filter(Boolean),

		devtool: !isProd && "eval-source-map",

		optimization: {
			minimize: isProd
		},

		devServer: {
			client: {
				logging: "warn",
				overlay: true,
				progress: true
			},
			compress: true,
			port: 8080,
			static: false,
			watchFiles: [ "./src/**/*" ]
		}
	};
}
