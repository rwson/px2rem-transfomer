import webpack from "webpack"
import cssnano from "cssnano"
import HTMLWebpackPlugin from "html-webpack-plugin"
import ExtractTextPlugin from "extract-text-webpack-plugin"

const config = {
    entry: [`${__dirname}/src/index.js`],
    output: {
        path: `${__dirname}/src/dist`,
        filename: "bundle.js"
    },
    resolve: {
        root: `${__dirname}/src`
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel",
            exclude: /node_modules/,
            query: {
                presets: ["es2015", "stage-0", "react"],
                plugins: ["transform-decorators-legacy", "transform-runtime"]
            }
        }, {
            test: /\.styl$/,
            loader: ExtractTextPlugin.extract(["css", "postcss", "stylus"]),
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("css")
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }]
    },
    postcss: [cssnano({
        autoprefixer: {
            add: true,
            remove: true
        },
        discardComments: {
            removeAll: true
        },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true
    })],
    plugins: [
        new HTMLWebpackPlugin({
            template: `${__dirname}/src/index.tmpl`,
            inject: "body",
            filename: "index.html"
        }),
        new ExtractTextPlugin("style.css"),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
        new webpack.optimize.DedupePlugin()
    ],
    target: "atom",
    node: {
        __filename: "empty",
        __dirname: "empty",
    }
}

if (process.env.NODE_ENV === "production") {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false
        })
    )
}
export default config
