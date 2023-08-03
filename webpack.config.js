const path = require("path");

const config = {
	mode: "production",
	entry: {
		main: "./src/main.ts"
	},
	output: {
		path: path.resolve("./dist")
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
