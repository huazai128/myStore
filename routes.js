/*
	路由服务
*/

//crypto模块生成安全的密码来实现会话的验证；
var crypto = require("crypto");              //加密解密，node利用OpenSSl库莱实现它的加密技术
var express = require("express");            
var mongoose = require("mongoose");


//注册到app.js文件就可以使用app.js里面的方法
module.exports = function(app) {
	var users = require("./controllers/users_controller.js");
	var photos = require("./controllers/photos_controller.js");
	var page = require("./controllers/page_controller.js");
	var comments = require("./controllers/comments_controller.js");
	//静态文件服务
	app.use("/static",express.static("./static")).
		use("/images",express.static("../images")).
		use("/lib",express.static("../lib"));
	//路由配置
	app.get("/",function(req,res) {
		//判断用户释放登录
		if(req.session.username){
			res.render("index",{username:req.session.username,msg:req.session.msg});
		}else{
			//console.log(req.body.username)
			req.session.msg = "请登录用户";
			res.redirect("/login");//重定向到登录页面
		}
	});
	//路由get登录页面
	app.get("/login",function(req,res){
		if(req.session.username){
			res.redirect("/");
		}
		res.render("login",{msg:req.session.msg});
	});
	//路由登录POST请求
	app.post("/login",users.login);

	//路由get注册页面
	app.get("/signup",function(req,res){
		//如果用户已登录
		// console.log(req.session.id);//注册xi
		// if(req.session.id){
		// 	//重定向到首页
		// 	res.redirect("/");
		// }
		//否则发送错误信息
		res.render("signup",{msg:req.session.msg});
	});
	//POST注册页面
	app.post("/signup",users.signup);

	//退出登录
	app.get("/logout",function(req,res){
		//清楚session会话
		req.session.destroy(function(){
			res.redirect("/login");
		})
	})

	//user请求
	app.get("/user",function(req,res){
		if(req.session.username){
			res.render("user",{msg:req.session.msg,username:req.session.username});
		}else{
			req.session.msg = "请重新登录";
			res.redirect("/login");   
		}
	})
	//请求profile
	app.get("/user/profile",users.profile);

	//修改用户
	app.post("/user/update",users.updateUser);

	//删除用户
	app.post("/user/delete",users.deleteUser);

	//以下是photos请求
	app.get("/photos",photos.getPhotos);             //获取所有的相片
	app.get("/photo",photos.getPhoto);               //根据ID获取单个相片
	app.get("/page",page.getPage);                   //
	app.get("/comments/get",comments.getComment);    //根据ID获取所有的评论
	app.post("/comments/add",comments.addComment);   //增加评论
}
