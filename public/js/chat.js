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
    //信息发送
    sendMsgListen : function(){    
        $('body').on('click','.chat-button',function(){
            if($(this).parent().attr('class')=='input-box'){
                //群发信息
                oChat.toUser = null ;
                oChat.sendMsg.call(this,0);
            }else{
                oChat.toUser = $(this).parents('.chat-window').find('.chat-name').text();
                oChat.sendMsg.call(this,1);
            }
        });
    },
    sendMsg : function(type){//type : 0为群发 1位单发
        //发送信息公用函数
        var $input = $(this).prev(),
            $chat = $(this).parent().prev(),
            msg = $input.val();
        oChat.socket.emit('msg',{'msg':msg,'name':oChat.name,'to':oChat.toUser});
        $input.val('');
        var $msg = '<section class="mymsg"><div>'+msg+'</div><span>'+oChat.name+'</span></section>';
        $chat.append($msg);
        oChat.scrollToBottom.call($chat[0],type);
    },
    toSomeOne:function(){
        $(".online-list").on('click','.online-link',function(){
            oChat.toUser = $(this).text();
            oChat.createDialog(oChat.toUser);
        })
    },
    createDialog:function(toUser,msg){
        //创建对话框
        var dialogName = toUser + '-dialog',
            $dialog = $('.'+dialogName);
        if($dialog.length>0){
            if(msg){
                var insert = '<section class="othermsg"><span>'+toUser+'</span><div>'+msg+'</div></section>',
                    $chat = $dialog.find('.window-content');
                    $chat.append(insert);
                    oChat.scrollToBottom.call($chat[0],1);
            }
            $dialog.show();
        }else{
            var dialog = '<div class="chat-window '+toUser+'-dialog">\
                            <div class="window-head">\
                                与<span class="chat-name">'+toUser+'</span>聊天中\
                                <span class="close">x</span>\
                            </div>\
                            <div class="window-content">';
            if(msg){
               dialog += '<section class="othermsg"><span>'+toUser+'</span><div>'+msg+'</div></section>'; 
            }
            dialog += '</div>\
                        <div class="window-foot">\
                            <input type="text" class="chat-input"/>\
                            <button class="chat-button">提交</button>\
                        </div>\
                    </div>';  
            $("body").append(dialog);                    
        }
    },
    closeDialog:function(){
        //关闭对话框
        $("body").on("click",".close",function(){
            $(this).parents('.chat-window').hide();
        })
    },
    scrollToBottom:function(type){
        if(type==0){
            //window窗体滚动条保持底部
            window.scrollTo(0,$('.chat')[0].clientHeight);
        }else{
            //普通元素滚动条保持底部
            this.scrollTop = this.scrollHeight;
        }
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
        oChat.scrollToBottom(0);
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
            var $msg = '<section class="othermsg"><span>'+obj.user+'</span><div>'+obj.msg+'</div></section>';
            $('.chat').append($msg);
            oChat.scrollToBottom(0);
        });

        this.socket.on("message",function(obj){
            //别人单独对你发信息
            oChat.createDialog(obj.user,obj.msg);
        });

        /*this.socket.on('message',function(obj){
            //当服务器使用socket.send时接收
            console.log(obj);
        });

        this.socket.on('other',function(obj){
            console.log('other person connect!');
        })*/
        this.sendMsgListen();
        this.toSomeOne();
        this.closeDialog();
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
})