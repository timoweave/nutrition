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

module.exports = config;
