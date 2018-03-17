// require the node module path to set the
// output directory below.
const path = require('path');

// export the configuration so webpack can
// read it
module.exports = {

  // file to start bundling
  entry: './src/main.ts',

  // output file and directory
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),

    // needed for the index.html to link the 
    // dev servers compiled bundle since it is
    // only compiled in memory while server is running 
    publicPath: '/dist/',
  },

  // dev server with base route and watch set to true
  devServer: {
    contentBase: './',
    watchContentBase: true,
    port: '8001'
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.js']
  },

  // Source maps support ('inline-source-map' also works)
  // this is good for tracing bugs in the JS back to the
  // acutal tyepscript file
  devtool: 'source-map',

  // Add the loader for .ts files.
  // this is what loads and compiles the
  // typescript
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  }
};