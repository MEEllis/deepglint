//灵犀数据智能平台 封装
import Service from "../axiosInterceptors";
import { AxiosRequestConfig } from "axios";

export default class CloundClient {
  //基础路径
  private readonly baseURL = "/proxy/cloud/";

  private _fetch(url: string, config: AxiosRequestConfig) {
    //默认是get请求
    return Service(url, {
      ...config,
      baseURL: this.baseURL,
      headers: {
        authkey: "dp-auth-v0",
        access_key: "7966023d-0eee-4104-9c2f-8efa4279442a",
        secret_key: "9e7b1900-302b-4059-bcaa-047262f3ca3b",
      },
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

  //查看设备组列表
  public getDevicegroupList(data: any) {
    return this._post("api/devicegroup/list", { data });
  }
  //解散设备组
  public delDevicegroup(data: any) {
    return this._post("api/devicegroup/delete", { data });
  }
  //新建设备组
  public addDevicegroup(data: any) {
    return this._post("api/devicegroup/add", { data });
  }
  //修改设备组基础信息
  public updateDevicegroup(data: any) {
    return this._post("api/devicegroup/update", { data });
  }
  //查看设备信息
  public getDeviceList(data: any) {
    return this._post("api/device/list", { data });
  }
  //.比对库列表查询
  public getRepoList(data: any) {
    return this._post("api/repo/list", { data });
  }
    //.比对库列表查询
    public getDeviceTaskList(data: any) {
      return this._post("api/device/task/list", { data });
    }
}
