var crypto = require("crypto");//密码加密
var mongoose = require("mongoose");//利用mongoose来使用结构化模式和验证
var User = mongoose.model("User");//引入User模块

function hashPW(pwd){//密码加密
	return crypto.createHash("sha256").update(pwd).digest("base64").toString();
}

//POST 请求登录；
//1、查询数据库判断登录的用户是否存在，
//2、判断用户登录密码是否正确；
//3、不管登录失败还是登录成功都要设置session
exports.login = function(req,res){
	//findOne():查找单个文档对象,根据username查找
	User.findOne({username:req.body.username})
	//exce:是查找结果后返回的一个回调函数
	.exec(function(err,user){
		if(!user){//如果用户不存在
			err = "你输入的用户不存在";
		}else if(user.hash_password === hashPW(req.body.password.toString())){
			//重置会话;删除之前的会话，在重新创建一个会话
			req.session.regenerate(function(){
				req.session.id = user.id;//保存到会话中
				req.session.username = user.username;
				req.session.msg = "Authenticated as "+ user.username;
				res.redirect("/");//重定向到首页
			})
		}else{
			err = "登录失败";
		}
		if(err){
			//重置会话
			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect("/login");
			})
		}
	})
}

// POST 请求注册信息所有的POST请求都是重定向
exports.signup = function(req,res){
	var user = new User({
		username:req.body.username,
		email:req.body.email,
		hash_password:hashPW(req.body.password),
		color:"rgb("+Math.floor(Math.random() * 256)+","+Math.floor(Math.random() * 256)+","+Math.floor(Math.random() * 256)+")"
	});
	//保存数据
	user.save(function(err){
		if(err){
			req.session.msg = "注册失败，请重新注册";
			res.redirect("/signup");//重定向到get注册页面
		}else{
			req.session.id = user._id
			req.session.username = user.username,
			req.session.msg = "你好," +user.username
			res.redirect("/");//重定向到首页
		}

	})
}

//profile文件请求
exports.profile = function(req,res){                  //
	User.findOne({username:req.session.username}).    //根据登录时用户名来查询当前用户的所有信息
	exec(function(err,user){                          //回调函数：返回两个参数err：Promise对象出现错误是无法被捕获，只能通过回调函数传递出来，
		if(!user){ 
			res.json(404,{err:"用户没有找到"});
		}else{
			res.json(user);                           //以json的形式把数据发送到页面
		}

	})
}

//修改用户
exports.updateUser = function(req,res){
	User.findOne({username:req.session.username}).
	exec(function(err,user){
		//获取表单值
		user.set("username",req.body.username);
		user.set("email",req.body.email);
		user.set("color",req.body.color);
		user.save(function(err){
			if(err){
				req.session.msg = "保存失败"
			}else{
				req.session.msg = "更新成功";
			}
			res.redirect("/user");                    //重定向到user
		})
	})
}

//删除用户
exports.deleteUser = function(req,res){
	User.findOne({username:req.session.username})
	.exec(function(err,user){
		console.log(user)
		if(user){
			user.remove(function(err){
				if(err){
					req.session.msg = "删除失败";
					res.redirect("/user");
				}else{
					//删除session
					req.session.destroy(function(){
						res.redirect("/login");
					})
				}
			})
		}else{
			req.session.msg = "用户不存在";
			//删除用户
			req.session.destroy(function(){
				res.redirect("/login");
			})
		}
	})
}
