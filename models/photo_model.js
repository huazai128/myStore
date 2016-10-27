//相册模型
var mongoose = require("mongoose");//结构化数据结构
var Schema = mongoose.Schema;      //定义结构化的模式集合中的文档

//添加Schema对象
var PhotoSchema = new Schema({     //创建一个PhotoSchema集合，在结合中添加字段
	title:String,                  //标题
	filename:String,               //文件名
	timestamp:{ type: Date , default: Date.now},//发布日期
	commentId:Schema.ObjectId      //在其他结构模型中可以添加评论
});

//model对象作为集合中所有文档的表示
mongoose.model("Photos",PhotoSchema);