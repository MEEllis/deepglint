import CloundClient from "./clound/cloudClient";
import NetposaClient from "./clound/netposaClient";

//导出灵犀数据智能平台
export const clound = new CloundClient();
export const netposa = new NetposaClient();
