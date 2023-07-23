const path = require("path");

const config = {
	mode: "production",
	entry: {
		option: "./src/option.ts"
	},
	output: {
		path: path.resolve("./webextension/dist")
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
