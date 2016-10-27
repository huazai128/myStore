var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/myapp");  //连接数据库

//引入model
require("./models/comments_model.js");                   //
require("./models/page_model.js");
require("./models/photo_model.js");

//创建model实例化对象
var CommentThread = mongoose.model("CommentThread");
var Reply = mongoose.model("Reply");
var Page = mongoose.model("Page");
var Photos = mongoose.model("Photos");


//添加相册
function addPhotos(title,filename){                      //是根据title标题和filename文件名
	var comment = new CommentThread({title:title + "Comments"});    //在CommnentThread集合中添加
	comment.save(function(err,comment){                  //保存
		var photo = new Photos({title:title,filename:filename});       //在Photos集合中保存单个photo文档对象
		photo.commentId = comment.id;                    //
		photo.save(function(){                           //单个文档对象保存
			console.log("相册保存成功");
		});
	})
}

//删除所有的评论和相片
CommentThread.remove().exec(function(){
	Photos.remove().exec(function(){
		Page.remove().exec(function(){
			//评论
			var comment = new CommentThread({title:"Comments Name"});
			comment.save(function(err,comment){               //保存评论
				var page = new Page({name:"Photos Page"});    //在Page集合文档中添加单个文档对象
				page.commentId = comment.id;                  //             
				page.save();
			});
			addPhotos("Page","index.jpg");	
			addPhotos("One","index01.jpg");	
			addPhotos("Two","index.jpg");	
			addPhotos("Sice","index01.jpg");	
			addPhotos("Three","index.jpg");	
			addPhotos("Six","index01.jpg");	
		})
	})
})

