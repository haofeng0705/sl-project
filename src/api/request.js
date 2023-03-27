import axios from "axios";
import store from "../store";
import { tansParams } from "@/selfTools/RequestTools.js";
// const ERR_OK = 0;  //有些时候 当返回的是数字0 或 1 代表成功或失败的时候 可以定义常量方便理解
axios.defaults.timeout = 20000; //设置默认的请求超时时间。例如超过了10s，就会告知用户当前请求超时，请刷新等

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
let exceptionAddrArr = ['/getToken', '/login', '/getWep'];
//请求头处理函数
function CreateHeader(url, type) {
  let header = {}
  if (type == 'POST') {
    header = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  } if (type == 'PUT') {
    header = {
      'Content-Type': 'application/json',
    }
  } else {
    header = {
      'Accept': 'application/json, text/plain, */*',
    }
  }
  if (url == undefined) return
  if (exceptionAddrArr.indexOf(url) == -1) {  //排除请求的地址不须要token的地址
    let token = store.getters.token;
    header['token'] = token;
    // header.Authorization = token;
  }
  return header;
}

let httpCode = {
  //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: "请求参数错误",
  401: "权限不足, 请重新登录",
  403: "服务器拒绝本次访问",
  404: "请求资源未找到",
  405: "请求方法错误",
  500: "内部服务器错误",
  501: "服务器不支持该请求中使用的方法",
  502: "网关错误",
  504: "网关超时",
};

//添加请求拦截器(在发送请求前做的处理)
axios.interceptors.request.use((config) => {
  if (!config.data) {

  }
  //每次发送请求之前都要携带token鉴定身份去访问后端数据库
  return config;
});
//添加响应拦截器(在响应数据后做的处理)
axios.interceptors.response.use(
  (config) => {

    return config;
  },
  (err) => {

    return Promise.reject(err);
  }
);
//get请求
export function get(url) {
  return function (params) {
    let headers = CreateHeader(url, 'GET')
    return axios
      .get(url, { params, headers },)
      .then((res) => {
        const { status, data } = res;
        if (status == "200") {
          return data;
        }
      })
      .catch((e) => {
        return false
      });
  };
}

export function postquery(url) {
  return function (params) {
    let headers = CreateHeader(url, 'POST')
    return axios
      .post(url, params, {
        transformRequest: [
          (params) => {
            return tansParams(params);
          },
        ], //transformRequest 允许在向服务器发送前，修改请求数据。
        headers: headers
      })
      .then((res) => {
        const { status, data } = res;
        if (status == "200") {
          return data;
        } else {
          return 0;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
}

export function post(url) {
  return function (params) {
    let headers = CreateHeader(url, 'POST')
    return axios
      .post(url, params, { headers })
      .then((res) => {
        const { status, data } = res;
        if (status == "200") {
          return data;
        } else {
          return 0;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
}

export function put(url) {
  return function (params) {
    let headers = CreateHeader(url, 'PUT')
    return axios
      .put(url, params, {
        // transformRequest: [
        //   (params) => {
        //     return tansParams(params);
        //   },
        // ], //transformRequest 允许在向服务器发送前，修改请求数据。
        headers: headers
      })
      .then((res) => {
        const { status, data } = res;
        if (status == "200") {
          return data;
        } else {
          return 0;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
}