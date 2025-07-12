module.exports = {
  // 选项...
  publicPath: 'static/',

  //是否开启eslint校验
  lintOnSave: true,

  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8081,
    proxy: { //配置代理，解决跨域请求后台数据的问题
      '/api/stock/editFavorite': {
        target: 'http://192.168.3.53:8080/api/stock/editFavorite', //后台接口
        // target: 'http://localhost:8080/api', //后台接口
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api/stock/editFavorite': '/'
        }
      },
      '/api/stock/testFund': {
        target: 'http://192.168.3.53:8080/api/stock/testFund', //后台接口
        // target: 'http://localhost:8080/api', //后台接口
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api/stock/testFund': '/'
        }
      },
      '/api/stock/crowTime': {
        target: 'http://192.168.3.53:8080/api/stock/crowTime', //后台接口
        // target: 'http://localhost:8080/api', //后台接口
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api/stock/crowTime': '/'
        }
      },
      'api/stock/note/add': {
        target: 'http://192.168.3.53:8080/api/stock/note/add', //后台接口
        // target: 'http://localhost:8080/api', //后台接口
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api/stock/note/add': '/'
        }
      },
      '/api': {
        // target: 'http://192.168.3.53:8080/api', //后台接口
        target: 'http://localhost:8080/api', //后台接口
        // target: 'http://mwy.nat300.top/api',
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }

    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: []
    }
  }
}
