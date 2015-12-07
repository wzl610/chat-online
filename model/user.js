var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
}

module.exports = User ;

User.prototype.operator = function(type,callback){
    var user = {
        name : this.name,
        password : this.password
    }
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取user的collection
        db.collection("users",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            if(type === "get"){
                //get操作
                collection.findOne({
                    name : user.name
                },function(err,user){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    callback(null,user);
                })
            }else{
                //save操作
                collection.insert(user,{
                    safe : true
                },function(err,user){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    callback(null,user.ops[0]);
                })
            }
        })
    })
};
