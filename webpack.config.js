module.exports = {
	mode: "production",
	entry: {
		"nmd-template-engine": __dirname + "/js/webpack-entry.js",
	},
	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	}
};