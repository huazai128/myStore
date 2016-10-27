var express = require("express");
var passport = require("passport");                      //添加身份验证
var GoogleStrategy = require("passport-google").Strategy;//引用google身份登录；身份验证来源

var app = express();
//序列化用户
passport.serializeUser(function(user,done){
	done(null,user)
})

//反序列化用户
passport.deserializeUser(function(obj,done){
	done(null,obj)
})

//app.use(express.json()).use(express.urlencoded());

//GoogleStrategy的构造函数接受一个当身份验证信息从谷歌返回是执行的回调函数
passport.use(new GoogleStrategy({
	returnURL:"http://localhost/auth/google/return",//认证策略要求来自google网站的应用程序
	realm:"http://localhost"//登录领域
},function(identifier,profile,done){
	process.nextTick(function(){//返回身份验证配置文件，
		profile.identifier = identifier;
		return done(null,profile);//返回第一个参数是把错误返回，第二个是把用户信息返回并配置到req.user属性
	})
}))

//配置模版引擎
app.engine(".html",require("ejs").__express);
app.set("views",__dirname + "/views");
app.set("view engine","html");



app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",passport.authenticate("google"));
app.get("/auth/google/return",passport.authenticate("google",{
	successRedirect:"/",
	failureRedirect:"/login"
}));