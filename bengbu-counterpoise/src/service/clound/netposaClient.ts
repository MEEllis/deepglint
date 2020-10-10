//灵犀数据智能平台 封装
import Service from "../netposaInterceptors";
import { AxiosRequestConfig } from "axios";

export default class NetposaClient {
  //基础路径
  private readonly baseURL = "/proxy/netposa/";

  private _fetch(url: string, config: AxiosRequestConfig) {
    //默认是get请求
    return Service(url, {
      ...config,
      baseURL: this.baseURL,
    });
  }

  //get 请求
  private _get(url: string, config?: AxiosRequestConfig) {
    return this._fetch(url, { ...config });
  }

  //post 请求
  private _post(url: string, config?: AxiosRequestConfig) {
    return this._fetch(url, { ...config, method: "POST" });
  }

  //同步设备
  public setRefreshDevice(data: any) {
    return this._post("netposa/refreshDevice", { data });
  }
  //同步比对库
  public setrefreshRepo(data: any) {
    return this._post("netposa/refreshRepo", { data });
  }
}
