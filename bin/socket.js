var Message = require('../model/message.js');
function Socket(server){
    var onlineCount = 0;//在线人数
    var socketList = [];//socket池,不能用对象，不然会超过最大存储上限！！！
    var onlineList = {};//不能用数组，不然无法传值....
    var io = require('socket.io').listen(server);
    //socket一般都是单页创建，如果出现跨页的话会出现问题
    io.on('connection',function(socket){
        //socket.send('hi');//message接收,对于当前用户
        //socket.emit('test',{'msg':"11"});//给当前用户发信息
        //socket.broadcast.emit('other');//给除了当前链接以外的所有人发信息
        socket.on('login',function(obj){
            if(!socketList[obj.name]){  
                //onlineList[obj.name] = obj.name;
                socketList[obj.name] = socket;
                onlineList[obj.name] = obj.name;
                socket.name = obj.name;
                onlineCount++;
                io.emit('login',{'onlineList':onlineList,'onlineCount':onlineCount,'user':obj.name});//通知所有的人，包括当前用户
            }
        });

        socket.on('msg',function(obj){
            var newMessage = new Message({
                from : obj.name,
                to : obj.to?obj.to:"all",
                content: obj.msg
            });
            newMessage.save(function(err){
              
            });
            if(obj.to){
              socketList[obj.to].send({'msg':obj.msg,'user':obj.name});
            }else{
              socket.broadcast.emit('msg',{'msg':obj.msg,'user':obj.name});
            }
        });

        socket.on('disconnect',function(){
            console.log(socket.name+'disconnect');
            if(onlineList[socket.name]){
                delete onlineList[socket.name];
                if(socketList[socket.name]){
                  delete socketList[socket.name];
                }
                onlineCount--;
                io.emit('logout',{'onlineList':onlineList,'onlineCount':onlineCount,'user':socket.name});
            }
        })
    });

    /*var chat = io
      .of('/chat')
      .on('connection', function (socket) {
        socket.emit('a message', {
            that: 'only'
          , '/chat': 'will get'
        }); 
        chat.emit('a message', {
            everyone: 'in'
          , '/chat': 'will get'
        }); //类似于io.emit，是针对所有的用户发送请求
      });

    var news = io
      .of('/news')
      .on('connection', function (socket) {
        socket.emit('item', { news: 'item' });
      });*/ //不同的命名空间，开启不同的通道，可以针对不同的客服
}

module.exports = Socket ;