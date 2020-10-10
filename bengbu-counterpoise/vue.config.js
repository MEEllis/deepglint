// 灵犀数据智能平台服务ip
const cloudAddr = `http://192.168.2.222:3154`;
// 武汉二次封装接口
const netposaAddr = `http://127.0.0.1:18083`;

const conf = {
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    proxy: {
      //灵犀数据智能平台
      "/proxy/cloud": {
        target: cloudAddr,
        pathRewrite: { "^/proxy/cloud": "" },
        changeOrigin: true,
      },
      //武汉二次封装接口
      "/proxy/netposa": {
        target: netposaAddr,
        pathRewrite: { "^/proxy/netposa": "" },
        changeOrigin: true,
      },
    },
  },
  //修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "蚌埠地网设备组织管理系统";
      return args;
    });
  },
};

module.exports = conf;
