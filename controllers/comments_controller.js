var mongoose = require("mongoose");
var CommentThread = mongoose.model("CommentThread");   //引用CommnentThread集合模型，时对数据库进行增删查改操作；评论
var Reply = mongoose.model("Reply");                   //引用Reply集合模型，时对数据库进行增删查改操作；回答用户的评论

//获取评论
exports.getComment = function(req,res){                //获取评论；根据评论的ID
	CommentThread.findOne({_id:req.query.commentId}).  //根据用户评论者的ID进行查询； findOne()：查找单个文档对象
	exec(function(err,comment){                        //回调函数
		if(!comment){
			res.json(404,{msg:"目前没有评论"});          //
		}else{
			res.json(comment);                         //以json的形势转发到页面上
		}
	});
}
//增加评论,是根据评论者
exports.addComment = function(req,res){
	CommentThread.findOne({_id: req.body.rootCommentId}).  //req.body:时获取POST请求上的参数;ID是当前点击相片的
	exec(function(err,commentThread){                      //
		if(!commentThread){
			res.json(404,{msg:"目前还没有评论"});
		}else{
			var newComment = Reply(req.body.newComment);    //req.body:用于处理POST请求JSON数据并解析成req.body属性
			newComment.username = generateUse();            //评论用户获取
			addComments(req,res,commentThread,commentThread,req.body.parentCommentId,newComment);//
		}
	})
}


function addComments(req,res,commentThread,currentComment,parentId,newComment){
	if(commentThread.id == parentId){                       //
		commentThread.replies.push(newComment);             //
		updateCommentThread(req,res,commentThread);         //
	}else{
		for(var i = 0; i < currentComment.replies.length; i++){      //遍历当前ID的所有评论
			var c = currentComment.replies[i];              //获取当前评论ID
			if(c._id == parentId){                          //如果评论ID与当前遍历中的某个ID存在相等
				c.replies.push(newComment);
				var replyTheard = commentThread.replies.toObject();   //toObject():把数据库查询的对象转换成POJO对象
				updateCommentThread(req,res,commentThread); //
				break;
			}else{
				addComments(req,res,commentThread,c,parentId,newComment);
			}
		}
	}
}

function updateCommentThread(req,res,commentThread){
	commentThread.update({_id:commentThread.id},            //根据ID修改数据
		{$set:{replies:commentThread.replies}})             //$set：修改文档中该字段已存在的值
	.exec(function(err,savedComment){                       //修改成功返回修改后的文档对像
		if(err){
			res.json(404,{msg:"更新评论失败"});              //
		}else{
			res.json(savedComment);
		}
	})
}

//随机评论用户
function generateUse(){
	var users = ["keke","huazai","Mini","vicky"];
	return users[Math.floor(Math.random()* 5)];
}