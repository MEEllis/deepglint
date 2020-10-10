import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";
import { Loading, Message } from "element-ui";
import { ElLoadingComponent } from "element-ui/types/loading";

const config: AxiosRequestConfig = {
  timeout: 90000, // 请求超时时间
  headers: { "Content-Type": "application/json" },
};

const Service: AxiosInstance = axios.create(config);
let loadingInstance: ElLoadingComponent;

// 添加请求拦截器
Service.interceptors.request.use(
  function(config: AxiosRequestConfig) {
    // 在发送请求之前做些什么
    loadingInstance = Loading.service({
      fullscreen: true,
    });
    return config;
  },
  function(error) {
    loadingInstance.close();
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
Service.interceptors.response.use(
  function(response: AxiosResponse) {
    loadingInstance.close();
    const { status } = response;
    if (status === 200) {
      const { data } = response;
      const { code, msg } = data;
      if (code === 0) {
        return data;
      } else {
        Message({
          message: msg || "服务器繁忙",
          type: "warning",
        });
        return Promise.reject(data);
      }
    } else {
      Message({
        message: "服务器繁忙",
        type: "error",
      });
      return Promise.reject(response);
    }
  },
  function(error) {
    loadingInstance.close();
    // 对响应错误做点什么
    Message({
      message: "服务器繁忙",
      type: "error",
    });
    return Promise.reject(error);
  }
);

export default Service;
