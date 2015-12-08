var oIndex = {
   /* socket:null,*/
    eventListener : function(){
        //登录、注册页面切换按钮事件监听
        $(".reg-link,.login-link").on("click",function(){
            $(this).attr("class")=="reg-link"?oIndex.showReg():oIndex.showLogin();
        })
    },
    login : function(){
        //登录按钮事件
        $("#submit-btn").on("click",function(){
            var name = $("#username").val(),
                password = $("#password").val();
            $.post("/login",{
                username : name,
                password : password
            },function(data){
                if(data.code==1){
                    location.href = "/chat";
                }else{
                    alert(data.msg);
                }
            },'json')
        })
    },
    reg : function(){
        //注册按钮事件
        $("#reg-btn").on("click",function(){
            var name = $("#re-username").val(),
                password = $("#re-password").val(),
                password2 = $("#re-password2").val();
            if(password!==password2){
                alert("两次密码不一致!");
                return ;
            }
            $.post("/reg",{
                username : name,
                password : password
            },function(data){
                if(data.code == 1){
                    alert("注册成功!");
                    location.href = "/chat";
                }else{
                    alert(data.msg);
                }
            },'json')
        })
    },
    showLogin : function(){
        //登录界面显示
        $("#login-form").show();
        $("#reg-form").hide();
    },
    showReg : function(){
        //注册页面显示
        $("#login-form").hide();
        $("#reg-form").show();
    },
    init : function(){
        this.eventListener();
        this.login();
        this.reg();
    }
}

$(function(){
    oIndex.init();
})