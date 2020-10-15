const request = require("request");

var WebSocketClient = require("websocket").client;
var xlsx = require("node-xlsx");
var fs = require("fs");
const { errorcode, playConfig } = require("./src/playInfo");
const { xlsxData } = require("./src/xlsxInfo");
require("events").EventEmitter.defaultMaxListeners = 50000;

console.log("获取设备树列表中....");
console.time("获取设备树");
//get请求
request(
  {
    url: "http://10.232.75.227:8071/proxy/gmt//camera/getOrgCameraTree",
    method: "get", //如果是post就涉及到跨域的问题了
    json: true,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDMwNzM3MDksImlkIjoiYWRtaW4iLCJvcmlnX2lhdCI6MTYwMjQ2ODkwOX0.zRTaZ323JkjnHqqyu3ABZ-PQ2Lk0KeZeaJ96mki8Gl4",
    },
  },
  function (error, response, body) {
    console.log("获取设备树列表完成....");

    if (!error && response.statusCode == 200) {
      const { code, data } = body;
      if (code === 0) {
        console.log("获取设备树列表成功....");
        console.timeEnd("获取设备树");
        const deviceList = rewriteData(data);
        const websoketTaskContainer = [];
        let deviceLen = 10 || deviceList.length;
        for (let i = 0; i < deviceLen; i++) {}
        let taskIndex = 0;
        let readed = false;//是否websoket定时任务完成
        //websoket定时任务
        const websoketTaskInterval = setInterval(() => {
          //在取值范围内
          if (taskIndex <= deviceLen - 1) {
            if (websoketTaskContainer.length < 20) {
              //
              if (taskIndex <= deviceLen - 1) {
              } else {
              }
              const h5vpDetail = deviceList[taskIndex];
              const { pvgType, pvgUuid } = h5vpDetail.attachProp;
              let g_loginfo = null;
              if (pvgType == 1) {
                g_loginfo = playConfig.g_loginfo_type1;
              } else if (pvgType == 2) {
                g_loginfo = playConfig.g_loginfo_type2;
              }
              if (g_loginfo) {
                var stream = {
                  devicetype: g_loginfo.devicetype,
                  user: g_loginfo.user,
                  password: g_loginfo.password,
                  ip: g_loginfo.ip,
                  port: g_loginfo.port,
                  channel: pvgUuid,
                  title: h5vpDetail.name,
                  pvgType: pvgType,
                  streamtype: "live",
                  isptz: true, // true 窗口显示云台操作箭头
                  keeplastpicture: false,
                  extdecoder: 7,
                  fixiframe: false,
                  _enableAudio: 1,
                };
                var restream = JSON.stringify({
                  name: "StartStream",
                  param: stream,
                  type: "command",
                });
                ((restream, h5vpDetail) => {
                  var t1 = new Date().getTime();
                  //创建websocket示例
                  var clientStream = new WebSocketClient();
                  clientStream.connect(
                    "ws://127.0.0.1:9122",
                    null,
                    null,
                    null,
                    {}
                  );
                  clientStream.on("connect", function (connection) {
                    console.log("WebSocket Client Connected");
                    console.log(`send ${restream}`);
                    connection.send(restream);
                    connection.on("error", function (error) {
                      console.log("Connection Error: " + error.toString());
                      xlsxData[0].data.push([
                        xlsxData[0].data.length,
                        h5vpDetail.org,
                        h5vpDetail.name,
                        "否",
                        t2 - t1,
                        "error",
                        error.toString(),
                      ]);
                      connection.close();
                    });
                    connection.on("close", function () {
                      console.log("echo-protocol Connection Closed");
                      const index = websoketTaskContainer.lastIndexOf(
                        clientStream
                      );
                      websoketTaskContainer.splice(index, 1);
                      clientStream = null;
                    });
                    connection.on("message", function (message) {
                      var t2 = new Date().getTime();
                      if (message.type === "binary") {
                        //console.log("Received: '" + message.type + "'");
                        //console.log("设备'" + streamDetail.param.title + "'播放成功...............................");
                        xlsxData[1].data.push([
                          xlsxData[1].data.length,
                          h5vpDetail.org,
                          h5vpDetail.name,
                          "是",
                          t2 - t1,
                        ]);
                        connection.close();
                      } else if (message.type === "utf8") {
                        let utf8Data = JSON.parse(message.utf8Data);
                        const { error } = utf8Data.param;
                        if (error !== 0) {
                          //console.log("设备: '" + streamDetail.param.title + "' 播放失败...............................");
                          xlsxData[0].data.push([
                            xlsxData[0].data.length,
                            h5vpDetail.org,
                            h5vpDetail.name,
                            "否",
                            t2 - t1,
                            error,
                            errorcode[error],
                          ]);
                          connection.close();
                        } else {
                          //console.log("Received: '" + message.utf8Data + "'");
                        }
                      } else {
                        console.log("Received: 其他");
                      }
                    });
                  });
                  websoketTaskContainer.push(clientStream);
                  taskIndex++;
                })(restream, h5vpDetail, taskIndex);
              } else {
                console.log(`${h5vpDetail.title}设备没有pvgType！`);
              }
            } else {
              console.log(
                `websoket定时任务排队中...................................`
              );
            }
          } else {
            console.log(
              `数据读完，等待websoket执行完成...................................`
            );
            if (websoketTaskContainer.length === 0) {
              readed = true;
              clearInterval(websoketTaskInterval);
            }
          }
        }, 0.2 * 1000);

        writeXlsxInterval(deviceLen,readed);
      }
    }
  }
);

function rewriteData(data) {
  let deviceList = [];
  //修改原始数据
  function updateResouceDeep(resouceData, org) {
    if (resouceData.type === 1) {
      if (resouceData.org === undefined) {
        resouceData.org = resouceData.name;
      }
      if (org === "" || org === undefined) {
        resouceData.org = resouceData.org;
      } else {
        resouceData.org = org + "-" + resouceData.org;
      }

      //组织
      if (Array.isArray(resouceData.subList)) {
        for (let i = 0; i < resouceData.subList.length; i++) {
          let itemData = resouceData.subList[i];
          updateResouceDeep(itemData, resouceData.org);
        }
      }
    } else if (resouceData.type === 2) {
      //设备
      resouceData.org = org;
    }
  }
  //树结构转化为列表结构
  function resolveDeep(resouceData) {
    if (resouceData.type === 1) {
      //组织
      if (Array.isArray(resouceData.subList)) {
        for (let i = 0; i < resouceData.subList.length; i++) {
          let itemData = resouceData.subList[i];
          resolveDeep(itemData);
        }
      }
    } else if (resouceData.type === 2) {
      //设备
      deviceList.push(resouceData);
    }
  }
  updateResouceDeep(data);
  resolveDeep(data);
  return deviceList;
}
//定时任务：把数据写入到xlsx；
function writeXlsxInterval(deviceLen,readed) {
  let xlsxDataInterval = setInterval(() => {
    let len = xlsxData[0].data.length - 1 + xlsxData[1].data.length - 1;
    if (len >= deviceLen && readed) {
      clearInterval(xlsxDataInterval);
      const uptimeTemp = process.uptime();
      const uptime =
        Math.floor(uptimeTemp / 60) + "分" + Math.round(uptimeTemp % 60) + "秒";

      xlsxData[2].data.push([uptime]);
      console.log(`---------------读取设备所花时间：${uptime}`);
      console.log(`开始把数据写入xls文件`);
      // 写xlsx
      const deviceInfo = `deviceInfo-${new Date().getTime()}.xlsx`;
      // !cols 指定列的宽度(厘米)
      const options1 = {
        "!cols": [
          { wch: 8 },
          { wch: 22 },
          { wch: 42 },
          { wch: 13 },
          { wch: 12 },
          { wch: 8 },
          { wch: 60 },
        ],
      };
      const options2 = {
        "!cols": [
          { wch: 8 },
          { wch: 22 },
          { wch: 42 },
          { wch: 13 },
          { wch: 12 },
          { wch: 8 },
          { wch: 60 },
        ],
      };
      const options3 = { "!cols": [{ wch: 24 }] };
      xlsxData[0].options = options1;
      xlsxData[1].options = options2;
      xlsxData[2].options = options3;
      var buffer = xlsx.build(xlsxData);
      fs.writeFile(`./build/${deviceInfo}`, buffer, function (err) {
        if (err) throw err;
        console.log("Write to xls has finished");

        // 读xlsx
        //var obj = xlsx.parse(`./${deviceInfo}`);
      });
    }
  }, 8 * 1000);
}
