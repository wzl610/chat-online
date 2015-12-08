var oChat = {
    socket : null,
    name : null,
    logout:function(){
        $("#logout").on("click",function(){
            //登出操作
            //oChat.socket.emit
        });
    },
    sendMsg : function(){
        //信息发送
        $('.chat-button').on('click',function(){
            var msg = $('.chat-input').val();
            oChat.socket.emit('message',{'msg':msg,'name':oChat.name});
            $('.chat-input').val('');
        })
    },
    scrollToBottom:function(){
        window.scrollTo(0,$('.chat')[0].clientHeight);
    },
    //用户登入登出渲染操作
    updateMsg : function(type,obj){
        //type中0为退出,1为加入
        $('.num').text(obj.onlineCount);
        var userList = '';
        for(var i in obj.onlineList){
            userList += ','+obj.onlineList[i];
        }
        userList = userList.slice(1);
        $('.online-list').text(userList);
        var $msg = '<div class="msg-system">'+obj.user+(type==1?'加入':'退出')+'了聊天室</div>';
        $('.chat').append($msg);
        oChat.scrollToBottom();
    },
    init:function(){
        //初始化IO
        this.socket = io.connect('ws://localhost:3000');//如果用socket = io.connect('ws://localhost:3000')的话无效，创建的socket不是对象的socket变量
        //获取用户名
        this.name = $('#username').val();
        //发布信息告诉大家我登录了！
        this.socket.emit('login',{"name":this.name});
        //新用户登录消息通知
        this.socket.on('login',function(obj){      
            oChat.updateMsg(1,obj);
        });
        //用户登出消息通知
        this.socket.on('logout',function(obj){
            oChat.updateMsg(0,obj);
        });
        //消息
        this.socket.on('message',function(obj){
            var $msg = '';
            if(oChat.name==obj.user){
                //自己发的信息
                $msg += '<section class="mymsg"><div>'+obj.msg+'</div><span>'+obj.user+'</span></section>';
            }else{
                //别人发的信息
                $msg += '<section class="othermsg"><span>'+obj.user+'</span><div>'+obj.msg+'</div></section>';
            }
            $('.chat').append($msg);
            oChat.scrollToBottom();
        })
    }
}

$(function(){
    oChat.init();
    oChat.sendMsg();
})