const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  externals: {
      "styled-components": {
        commonjs: "styled-components",
        commonjs2: "styled-components",
        amd: "styled-components",
      },
    },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Wraptor',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65535,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
}
