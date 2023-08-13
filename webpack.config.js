const path = require("path");

const config = {
	mode: "development",
	entry: {
		main: "./src/main.ts"
	},
	output: {
		path: path.resolve("./static/dist")
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	}
};

module.exports = config;
