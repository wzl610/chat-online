var mongodb = require('./db');

function Message(msg){
    this.from = msg.from;
    this.to = msg.to;
    this.content = msg.content;
}
module.exports = Message ;

Message.prototype.save = function(callback){
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date : date,
        year : date.getFullYear(),
        month : date.getFullYear() + '-' + (date.getMonth()+1),
        day : date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    //要存入数据库的信息
    var message = {
        from : this.from,
        time : time,
        to : this.to,
        content: this.content
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('msg',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(message,{
                safe : true
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}