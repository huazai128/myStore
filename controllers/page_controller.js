var mongoose = require("mongoose")
var Page = mongoose.model("Page");//引用page模型

//
exports.getPage = function(req,res){
	Page.findOne({name:req.query.pageName})  //findOne():保存单个文档对象   req.query:是用于处理GET请求参数
	.exec(function(err,page){              
		if(!page){
			res.json(404,{msg:"页面不存在"});
		}else{
			res.json(page);                  //保存成功把数据返回到请求函数中
		}
	})
}
