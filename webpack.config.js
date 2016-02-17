const path = require('path')

const PATHS = {
  build: path.join(__dirname, 'build'),
  client: path.join(__dirname, 'src', 'client'),
  server: path.join(__dirname, 'src', 'server'),
  test: path.join(__dirname, 'test')
}

module.exports = {
  devtool: 'eval',  // Helpful for debugging
  entry: path.join(PATHS.client, 'index.js'),
  output: {
    path: PATHS.build,
    filename: "bundle.js"
  },
  resolve: {
    // Automagically figure out the extension in import statements
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        // Lets me use ES6+ in my code!
        test: /\.jsx?$/,
        include: [PATHS.client, PATHS.server],
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-1']
        }
      }
    ]
  }
};
