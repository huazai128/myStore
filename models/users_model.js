
//定义用户对象的模型
var mongoose = require("mongoose");

var Schema = mongoose.Schema;                       //创建一个模式对象文档；也就是数据模型
//在User对象中添加字段
var UserSchema = new Schema({                       //定义字段
  username:{type:String,required:true,unique:true}, //定义字段的类型，unique；表示字段唯一性
  email:{type:String,required:true},                //email字段类型;required:必填字段
  color:String,
  hash_password:{type:String,required:true}         //密码字段
},{collection:"session"});                          //collecction:连接数据库的集合

mongoose.model("User",UserSchema);                  //创建model模型
