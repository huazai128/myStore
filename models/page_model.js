
var mongoose = require("mongoose");//提供结构化的数据模型
var Schema = mongoose.Schema;

var PageSchema = new Schema({      //创建一个PageSchema集合，在这个集合中添加字段
	name:{type:String,unique:true},//表示字段是唯一性
	commentId:Schema.ObjectId      //id字段
});
mongoose.model("Page",PageSchema); //创建model模型，可以提供操作数据库的方法
 