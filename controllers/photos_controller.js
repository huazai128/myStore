var mongoose = require("mongoose");               //结构化模型和验证
var Photos = mongoose.model("Photos");

//根据ID查找相应的相册
exports.getPhoto = function(req,res){             //定义一个获取当前ID的相片
	Photos.findOne({_id:req.query.photoId}).      //findOne():是查询单个文档对象;  req.query:是处理GET字符串的参数
	exec(function(err,photo){                     //返回查询对象
		if(!photo){
			res.json(404,{msg:"没有相册"});
		}else{
			res.json(photo);
		}
	})
}

//显示所有的相册
exports.getPhotos = function(req,res){            //当浏览器请求/photos地址时，会查询所有相片的信息
	Photos.find().                                //查询所有的信心
	exec(function(err,photos){                    //返回一个回调函数，接受一个Promise对象的返回的错误和查询的数据
		//console.log(photos);
		if(!photos){
			res.json(404,{msg:"目前相册没有相片"}); 
		}else{
			res.json(photos);
		}
	})
}