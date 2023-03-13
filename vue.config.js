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
      '/api': {
        target: 'http://localhost:8080/api', //后台接口
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
