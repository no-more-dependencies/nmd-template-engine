module.exports = {
	mode: "development",
	entry: {
		"nmd-template-engine": __dirname + "/js/webpack-entry.js",
	},
	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	}
};