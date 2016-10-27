//评论模型 嵌套结构
var mongoose = require("mongoose");   //结构化的数据模式
var Schema = mongoose.Schema;         //定义结构化的数据模式集合文档，是用来存储数据


//回答评论
var ReplySchema = new Schema();       //创建一个ReplySchema集合文档
ReplySchema.add({                     //add()是在文档集合中添加字段
	username:String,                  //username:回答评论者字段
	subject:String,                   //评论文档字段
	timestamp:{type: Date,default: Date.now}, //时间
	body:String,                      //评论内容
	replies:[ReplySchema]             //reply模型数组，可以设置评论在内部相互嵌套；并在同一个层级上创建多个评论
})

var CommentThreadSchema = new Schema({  //
	title:String,
	replies:[ReplySchema]
});

mongoose.model("Reply",ReplySchema);
mongoose.model("CommentThread",CommentThreadSchema);