module.exports = {
  publicPath: "",
  devServer: {
    port: 8080,
    open: true,
    // proxy: "http://localhost:3000",
    proxy: {
      "/api": {
        target: "http://192.168.198.1:8060", // 要访问的接口域名
        //http://10.194.130.125 双流气象局域名
        //"http://192.168.198.1:8060"  //马世岩
        //http://10.23.192.57:8060 赵珉锐
        //ws: true, // 是否启用websockets
        changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          "^/api": "", //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
        },
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(gltf|glb)$/,
          loader: "url-loader",
        },
      ],
    },
  },
};
