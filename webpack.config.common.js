var webpack = require('webpack');

module.exports = {
  entry: {
      'app': './assests/app/main.ts'
  },
    resolve:{
      extensions: ['.js', '.ts']
    },

    module:{
      loaders:[
          {
              test:/\.ts$/,
              loaders:['awesome-typescript-loader',
                  'angular-template-loader',
                  'angualr2-router-loader']
          },
          {
              test: /\.html$/,
              loaders:'html'
          },
          {
              test:/\.css/,
              loader: 'raw'
          }
      ]
    }
};