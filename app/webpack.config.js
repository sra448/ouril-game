module.exports = [{
  entry: {
    "index": "./index.js"
  },
  output: {
    path: __dirname,
    filename: "./bin/[name].js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader" },
      { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] }
    ]
  },
  node: {
    fs: 'empty'
  }
}, {
  entry: {
    "sparring": "./sparring.js"
  },
  target: "node",
  output: {
    path: __dirname,
    filename: "./bin/[name].js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader" }
    ]
  }
}]
