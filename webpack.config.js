"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const devServer = { // webpack dev server
    inline : true,
    contentBase : "/",
    compress: true,
    open : true,
    stats : "errors-only",
    port : 3030
};

const js = { // rule
    test : /\.js$/,
    exclude : /node_modules/,
    use : "babel-loader"
};

const jsx = { // rule
    test : /\.js[x6]$/,
    exclude : /node_modules/,
    use : "babel-loader"
};

const css = { // rule
    test : /\.css$/,
    use : ExtractTextPlugin.extract({
        publicPath: "/",
        fallback: "style-loader",
        use : ["css-loader"]
    })
};

const image = { // rule
    test : /\.(jpe?g|png|gif|svg)$/i,
    use : "url"
};

const scss = { // rule
    test : /\.scss$/,
    use : ExtractTextPlugin.extract({
        publicPath: "/",
        fallback: "style-loader",
        use : ["css-loader", "sass-loader"]
    })
};

const url = { // rule
    test : /\.(woff2?|svg)$/,
    use : "url-loader"
};

const file = { // rule
    test : /\.(ttf|eot)$/,
    use : "file-loader"
};

const make_index = ({filename, title}) => { // plugin
        return new HtmlWebpackPlugin({
            filename,
            hash : true,
            title
        });
};

const extract_style = (css_file) => { // plugin
    return (new ExtractTextPlugin(css_file));
};

const insert_favicon = (png_file) => { // plugin
    return new FaviconsWebpackPlugin({
        logo : png_file,
        persistentCache: true,
        inject: true
    });
};

const config = {
    // devServer : devServer,
    devtool : "source-map",
    bail: false,
    profile: false,
    context: path.resolve(__dirname),
    watch: true,

    entry : "./client.jsx",

    output : {
        path : path.resolve(__dirname),
        filename : "index.js",
        publicPath : "/"
    },
    module: {
        rules: [js, jsx, css, scss, url, image, file]
    },
    plugins: [
        extract_style("index.css"),
        insert_favicon("./favicon.png"),
        make_index({title: "strips", filename: "index.html"})
    ]
};

function watch_it_happen(config) {

    let stats_hash = null;
    const output_options = {
        context: path.resolve(__dirname),
        colors: { level: 2, hasBasic: true, has256: true, has16m: false },
        cached: false,
        cachedAssets: false,
        exclude: [ 'node_modules', 'bower_components', 'components' ]
    };
    const watch_log = ((id=0) => () => {
        console.log({ id: id++, date: Date()});
    })(0);

    console.log({config});
    watch_log();
    const compiler = webpack(config);
    compiler.watch(true, watch_details);

    return;

    function watch_details(err, stats) {
		if (!config.watch || err) {
			compiler.purgeInputFileSystem();
		}

		if (err) {
			stats_hash = null;
			console.error(err.stack || err);
			if (err.details) {
                console.error(err.details);
            }
            watch_log();
			process.exit(1);
		}

		if (output_options.json) {
			process.stdout.write(JSON.stringify(stats.toJson(output_options), null, 2) + "\n");
		} else if (stats.hash !== stats_hash) {
			stats_hash = stats.hash;
			var statsString = stats.toString(output_options);
			if (statsString) {
				process.stdout.write(statsString + "\n");
            }
		}

		if (!config.watch && stats.hasErrors()) {
			process.on("exit", function() {
                watch_log();
				process.exit(2);
			});
		}
        watch_log();
    }
}

config.watch.__proto__.watch_it_happen = watch_it_happen;

module.exports = config;
