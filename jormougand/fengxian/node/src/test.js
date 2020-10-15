//websocket
var restream = JSON.stringify({
    "name": "StartStream",
    "param": { "devicetype": "pvgplus", "user": "gelin", "password": "123456", "ip": "10.232.75.89", "port": 2015, "channel": "b10df9d1-881d-4075-ad7c-e718ac1f2b7d", "title": "立新/周家弄HG", "pvgType": 1, "streamtype": "live", "isptz": true, "keeplastpicture": false, "extdecoder": 7, "fixiframe": false, "_enableAudio": 1 },
    "type": "command"
  });
  
  var restream = JSON.stringify({
    name: "StartStream",
    param: {
      channel: "e1543dac-f214-462f-b612-0f9a5172c36c",
      devicetype: "pvgplus",
      extdecoder: 7,
      fixiframe: false,
      ip: "10.232.75.91",
      isptz: true,
      keeplastpicture: false,
      password: "123456",
      port: 2015,
      pvgType: 2,
      streamtype: "live",
      title: "九川千千幼儿园校外全景",
      user: "gelin",
      _enableAudio: 1
    },
    type: "command"
  });
  var client = new WebSocketClient();
  text(restream);
  function text(restream) {
    client.connect('ws://127.0.0.1:9122', null, null, null, {});
    client.on('connect', function (connection) {
      console.log('WebSocket Client Connected');
      console.log(`send ${restream}`);
      connection.send(restream);
      connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
      });
      connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
      });
      connection.on('message', function (message) {
        if (message.type === "binary") {
          console.log("Received: '" + message.type + "'");
          //如果一旦收到二进制流，可以粗略认为连接成功；
          connection.close();
          text(restream);
        } else if (message.type === "utf8") {
          console.log("Received: '" + message.utf8Data + "'");
        }
      });
    });
  
  }
  
  // net
  var net = require("net");
  
  var client = new net.Socket();
  client.setEncoding("utf-8");
  var client2 = new net.Socket();
  client2.setEncoding("utf-8");
  
  
  client2.connect("9122", "127.0.0.1", () => {
    console.log("连接到服务器2！");
  
    console.log(`send:${aa}`);
    client2.write(aa, (err) => {
      // client2.end(); 
      if (!err) {
        console.log(`write success`);
      } else {
        console.log(`write fail`);
      }
    });
  });
  
  client2.on('data', function (data) {
    console.log('recv data2:' + data);
  });
  client2.on('drain', function () {
    console.log('client2 Connection drain');
  });
  
  client2.on('close', function () {
    console.log('client2 Connection closed!!!!');
  });
  client2.on('end', function () {
    console.log('client2 Connection end');
  });
  
  client2.on('error', function (error) {
    console.log('client2 error:' + error);
    //client.close();
  });
  client2.on('lookup', function () {
    console.log('client2 Connection lookup');
  });
  client2.on('timeout', function () {
    console.log('client2 Connection timeout');
  });
  // net end 
  
  
  
  
  
  
  
  
  
  
  
  
  
  //socket.io
  const soc = io('ws://127.0.0.1:9122',
    {
      query: {},
      //此处大坑，设置为true才会开启新的连接
      forceNew: true
    });
  
  soc.onopen = function (evt) {
    console.log("GetCpuMemory Connection open ...");
    console.log(`send ${aa}`);
    soc.send(aa);
  };
  
  
  soc.onmessage = function (evt) {
    console.log(" GetCpuMemory Received Message: " + evt.data);
  };
  
  soc.onclose = function (evt) {
    console.log("GetCpuMemory Connection closed.");
  };
  soc.on('connect_failed', (data) => {
    console.log(data);
  });
  soc.on('error', (data) => {
    console.log(data);
  });
  soc.on('reconnecting', (data) => {
    console.log(`reconnecting ${data}`);
  });
  
  soc.on('reconnect_failed', (data) => {
    console.log(`reconnect_failed ${data}`);
  });
  
  //socket.io end 