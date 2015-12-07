var oIndex = {
    eventListener : function(){
        $(".reg-link,.login-link").on("click",function(){
            $(this).attr("class")=="reg-link"?oIndex.showReg():oIndex.showLogin();
        })
    },
    login : function(){
        $("#")
    },
    reg : function(){
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
                    alert("注册成功!")
                    location.href = "/chat";
                }else{
                    alert(data.msg);
                }
            },'json')
        })
    },
    showLogin : function(){
        $("#login-form").show();
        $("#reg-form").hide();
    },
    showReg : function(){
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