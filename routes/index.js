var User = require('../model/user.js');
module.exports = function(app) {
    //首页，登录页
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.post('/login',function(req,res){
        var newUser = new User({
            name : req.param('username'),
            password : req.parem('password')
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
            }else if(user.password!=password){
                return res.redirect('/login');//返回登录页
            }else{
                req.session.user = name;
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
        res.render('chat');
    })
};

//req.param('name')  