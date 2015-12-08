var User = require('../model/user.js');
module.exports = function(app) {
    //首页，登录页
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.post('/login',function(req,res){
        var newUser = new User({
            name : req.param('username'),
            password : req.param('password')
        });
        newUser.operator('get',function(err,user){
            res.writeHead(200, { 'Content-Type': 'application/json' }); 
            if(err){
                res.end(JSON.stringify({
                    code : 0,
                    msg : err
                }));//返回错误
            }
            if(!user){
                res.end(JSON.stringify({
                    code : 0,
                    msg : "用户不存在!"
                }));//返回错误
            }else if(user.password!=newUser.password){
                res.end(JSON.stringify({
                    code : 0,
                    msg : "密码错误!"
                }));//返回错误
            }else{
                req.session.user = newUser.name;
                res.end(JSON.stringify({
                    code : 1,
                    msg : "登录成功!"
                }));//登录成功
            }
        })
    });

    app.post('/reg',function(req,res){
        var newUser = new User({
            name : req.param('username'),
            password : req.param('password')
        });
        newUser.operator('get',function(err,user){
            if(err){
                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({
                    code : 0,
                    msg : err
                })); //返回错误
            }else if(user){
                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({
                    code : 0,
                    msg : "用户已存在"
                })); //返回错误
            }else{
                newUser.operator('save',function(err,user){
                    if(err){
                        res.writeHead(200, { 'Content-Type': 'application/json' }); 
                        res.end(JSON.stringify({
                            code : 0,
                            msg : err
                        })); //返回错误
                    }
                    req.session.user = user.name;
                    res.writeHead(200, { 'Content-Type': 'application/json' }); 
                    res.end(JSON.stringify({
                        code : 1,
                        msg : "注册成功"
                    })); //注册成功
                })
            }
        })
    })

    //聊天页面
    app.get('/chat',function(req,res){
        if(req.session.user){
            res.render('chat',{"user":req.session.user});
        }else{
            res.redirect('/');
        }
    })

    //退出
    app.get('/logout',function(req,res){
        req.session.user = '';
        res.render('index');
    })

};
