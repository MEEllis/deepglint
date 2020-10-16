//  奉贤项目：修改的设备

const xlsx = require("node-xlsx");
const fs = require("fs");
const pinyin = require("node-pinyin");
var sheets = xlsx.parse("./src/全量一机一档.xlsm");
var updateSheets = xlsx.parse("./src/修改的设备.xlsx");


//sheets是一个数组，数组中的每一项对应test.xlsx这个文件里的多个表格，如sheets[0]对应test.xlsx里的“测试参数”这个表格，sheets[1]对应Sheet2这个表格

//修改的设备
const updateSheetsArr = [];
const updatesheet = updateSheets[3];
if (updatesheet.name === "点位服务清单") {
  //sheet是一个json对象，格式为{name:"测试参数",data:[]},我们想要的数据就存储在data里
  for (let i = 1; i < updatesheet["data"].length; i++) {
    //excel文件里的表格一般有标题所以不一定从0开始
    let row = updatesheet["data"][i];
    if (row && row.length > 0) {
      let orgParentName = row[2] && row[2].replace(/\s/g, "");
      if (orgParentName === "城管") {
        updateSheetsArr.push({
          deviceAliasName: row[4] && row[4].replace(/\s/g, ""),
          orgName: row[3] && row[3].replace(/\s/g, ""),
        });
      }
    }
  }
}

//一机一档表
var allSheetsObj = {};
const sheet = sheets[0];
if (sheet.name === "一机一档表") {
  //sheet是一个json对象，格式为{name:"测试参数",data:[]},我们想要的数据就存储在data里
  for (var i = 3; i < sheet["data"].length; i++) {
    //excel文件里的表格一般有标题所以不一定从0开始
    var row = sheet["data"][i];
    if (row && row.length > 0) {
      const serialNumber = row[1] && row[1].replace(/\s/g, ""); //部分文本尾部可能会有空格，要去除
      const deviceAliasName = row[7] && row[7].replace(/\s/g, ""); //部分文本尾部可能会有空格，要去除
      allSheetsObj[deviceAliasName] = {
        serialNumber: serialNumber,
        deviceName: row[2] && row[2].replace(/\s/g, ""),
        deviceAliasName: deviceAliasName,
      };
    }
  }
}
const addSheetsList = [
  ["serialNumber", "name", "cameraBrand", "cameraBrandName", "点位俗称"],
];
console.log(`预估一共需要修改的设备数量为${updateSheetsArr.length}`);
for (let i = 0; i < updateSheetsArr.length; i++) {
  const updateSheetItem = updateSheetsArr[i];
  const { deviceAliasName, orgName } = updateSheetItem;
  if (allSheetsObj[deviceAliasName]) {
    const { serialNumber, deviceName } = allSheetsObj[deviceAliasName];
    const py =pinyin(orgName,{style:'normal'}).toString().replace(/,/g, '') //普通风格，即不带音标。 如：pin yin,
    addSheetsList.push([
      serialNumber,
      deviceName,
      py,
      orgName,
      deviceAliasName,
    ]);
  }
}

console.log(`实际一共修改的设备数量为${addSheetsList.length - 1}`);

if (updateSheetsArr.length != addSheetsList.length - 1) {
    console.error(`error 预估修改的设备和实际修改的设备不相等！！！！！！！`);
}

var xlsxData = [
  {
    name: "Sheet1",
    data: addSheetsList,
    options: {
      "!cols": [
        { wch: 25 },
        { wch: 60 },
        { wch: 20 },
        { wch: 20 },
        { wch: 60 },
      ],
    },
  },
];
const deviceInfo = `deviceInfo-${new Date().getTime()}.xlsx`;
var buffer = xlsx.build(xlsxData);
fs.writeFile(`./build/${deviceInfo}`, buffer, function (err) {
  if (err) throw err;
  console.log("Write to xls has finished");
});
