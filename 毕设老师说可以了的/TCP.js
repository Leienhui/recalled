
/**
 * 发送和获取
 */

/* 引入net模块 */
var net = require("net");

// socketMap用于存储id与设备socket的对应关心
var socketMap = 
{};
/* 创建TCP服务器 */
// socket是wif芯片和后台tcp服务器建立连接的通信接口
var server = net.createServer(function(socket){
    // 获取远程地址(获取与我连接的客户端的地址)
    var address = socket.remoteAddress;
    // 获取远程端口(获取与我连接的端口)
    var port = socket.remotePort;
    var message = "the server address is"+address +':'+port;
    console.log(socket);

    /* 监听接收数据时候 */
    socket.on('data',function(data){
        var readSize = socket.bytesRead;
        console.log("the size of data is"+readSize);
        // register+22222
        if(data.startsWith('register')){
            // 将字符串与数字分割开
            var directir = data.split('+');
            var id = directir[2];
        //    
        /*  硬件来注册自己的id号， 我想要做得到的是  
            根据某个id,   去能够和指定设备通信， 通过Socket
            所以肯定要      id和Socket对象的对应关系
            {
                "22222": new Socket(),
                 "22222": Socket
            }

        */
            socketMap[id] = socket;
        }
    })
    socket.on('error', function(){

        // 加入这个socket报错
        for(let key in socketMap){
            if(socketMap[key] == socket){
                delete socketMap[key];
            }
        }
    })
})



// 下订单的时候
// 设备id, 用户id
var id = '3333';
socketMap[id].write("begin\0");
setTimeout(() => {
    socketMap[id].write("stop\0");
}, time);
console.log(socketMap);



/* 获取地址信息 */
server.listen(9999,function(){
    console.log("Creat server on http://127.0.0.1:9999/");
})