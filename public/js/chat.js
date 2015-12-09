var oChat = {
    socket : null,
    name : null,
    toUser : null,
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
            oChat.socket.emit('msg',{'msg':msg,'name':oChat.name,'to':oChat.toUser});
            $('.chat-input').val('');
            var $msg = '<section class="mymsg"><div>'+msg+'</div><span>'+oChat.name+'</span></section>';
            $('.chat').append($msg);
            oChat.scrollToBottom();
            toUser = null ; 
        })
    },
    toSomeOne:function(){
        $(".online-list").on('click','.online-link',function(){
            oChat.toUser = $(this).text();
        })
    },
    scrollToBottom:function(){
        window.scrollTo(0,$('.chat')[0].clientHeight);
    },
    //用户登入登出渲染操作
    updateMsg : function(type,obj){
        //type中0为退出,1为加入
        $('.num span').text(obj.onlineCount);
        var userList = '';
        for(var i in obj.onlineList){
            userList += '<li><a href="javascript:void(0);" class="online-link">'+obj.onlineList[i]+'</a></li>';
        }
        $('.online-list').empty().append(userList);
        var $msg = '<div class="msg-system">'+obj.user+(type==1?'加入':'退出')+'了聊天室</div>';
        $('.chat').append($msg);
        oChat.scrollToBottom();
    },
    receiveMsg:function(obj){
        var $msg = '<section class="othermsg"><span>'+obj.user+'</span><div>'+obj.msg+'</div></section>';
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
         this.socket.on('msg',function(obj){
            //别人群发信息
            oChat.receiveMsg(obj);
        });

        this.socket.on("message",function(obj){
            //别人单独对你发信息
            oChat.receiveMsg(obj);
        });

        /*this.socket.on('message',function(obj){
            //当服务器使用socket.send时接收
            console.log(obj);
        });

        this.socket.on('other',function(obj){
            console.log('other person connect!');
        })*/
    }/*,
    init : function(){
            var chat = io.connect('http://localhost:3000/chat'),
            news = io.connect('http://localhost:3000/news');

            chat.on('connect', function () {
                chat.emit('hi!');
            });

            chat.on('a message',function(obj){
                console.dir(obj);
            })

            news.on('item', function (obj) {
                console.log(obj);
            });

    }*/
}

$(function(){
    oChat.init();
    oChat.sendMsg();
    oChat.toSomeOne();
})