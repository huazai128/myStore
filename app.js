
/*
	创建服务连接数据库
*/
var express = require("express");             //引入express中间件
var bodyParser = require("body-parser");      //用户处理Post请求JSON参数解析成req.body属性
var cookieParser = require("cookie-parser");  //接受和发送cookie
var session = require("express-session");     //session会话
var mongoose = require("mongoose");           //利用mongoose来使用结构化模式和验证
var mongoStore = require("connect-mongo")(session);


//可以在任何地方调用User对象
require("./models/users_model.js");           //引用User模式，来确保他在Mongoose注册
require("./models/photo_model.js");           //引用Photos模式，来确保他在Mongoose注册
require("./models/page_model.js");            //引用Page模式
require("./models/comments_model.js");            //引用Page模式


mongoose.connect("mongodb://localhost/myapp");//链接数据库

var app = express();

app.engine(".html",require("ejs").__express);//设置模版引擎
app.set("views", __dirname + "/views");      //指定模版引擎用来查找视图模版的路径
app.set("view engine","html");               //指定模板时，可以省略文件扩展名；如html文件后缀


//在所有路由中可以使用以下中间件
app.use(bodyParser());                       //用来处理POST请求JSON数据解析成req.body属性
app.use(cookieParser());                     //cookie会话                 

//Mongodb连接作为已通过身份验证的会话的持久性存储来注册
app.use(session({
	secret:"Keke",                           //secret:是用来放置cookie被窃取
	cookie:{ maxAge: 180 * 60 * 1000 },      //保存会话3个小时
	store: new mongoStore({ mongooseConnection: mongoose.connection,collection:"session",db:mongoose.connection.db}) //连接数据，collection：集合名称；db：创建新的db对象
}));

require("./routes")(app);                    //引用路由

app.listen(8080);                          
