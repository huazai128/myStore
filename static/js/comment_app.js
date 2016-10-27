var myApp = angular.module("myApp",[]);
function CommentObj($http){
	this.getComment = function(commentId,callback){                //获取commentId根据ID查询数据
		$http.get("/comments/get",{params:{commentId:commentId}})  //根据参数请求获取数据
		.success(function(data,status,headers,config){             //请求成功返回一个回调函数
			callback(null,data);
		})
		.error(function(data,status,headers,config){               //请求错误也返回一个回调函数
			callback(data,{});
		})
	}
	this.addComment = function(rootCommentId,parentId,newComment,callback){ //保存评论;
		$http.post("/comments/add",{rootCommentId:rootCommentId,parentCommentId:parentId,newComment:newComment}) //获取评论内容参数，保存数据POST根据保存参数，req.body来获取POST请求参数
		.success(function(data,status,headers,config){             //保存成功返回一个回调函数
			callback(null,data);                                   //使用回调函数来接受请求返回的数据
		})
		.error(function(data,status,headers,config){
		})
	}
}
myApp.service("commentStr",["$http",CommentObj]);                 //数据服务
myApp.controller("myCtrl",["$scope","$http","commentStr",function($scope,$http,commentStr){ //注入commentStr服务
	$http.get("/photos").                          //http请求／photos地址
	success(function(data,status,headers,config){  //请求成功接受回调函数，函数传递四个参数，data:请求数据，status:请求状态,headers:请求头，config:配置文件
		$scope.photos = data,                      //把数据赋值给photos
		$scope.photo = $scope.photos[0];           //获取数据第一个值
		$scope.loadComments();     
	}).
	error(function(data,status,headers,config){    //请求错误时，也接受一个回调函数
		$scope.photos = [];
	});
	$scope.setPhoto = function(photoId){           //点击图片的时候，获取当前图片的ID;并获取当前id所有的信息
		$http.get("/photo",{params:{photoId :photoId}}) //get请求，并携带参数；后台参数的获取是是用req.query.photoId;
		.success(function(data,status,headers,config){
			$scope.photo = data;                  
			$scope.loadComments();
		})
		.error(function(data,status,headers,config){
			$scope.photo = {};
		})
	}
	//回答评论
	$scope.addReply = function(paramsCommentId,subject,body){           //获取页面表单提交的数据
		var newComment = {subject:subject,body:body};                   //
		commentStr.addComment($scope.commentThread._id,paramsCommentId,newComment,function(err,comment){
			$scope.loadComments();
		})
	}
	//获取评论
	$scope.loadComments = function(){
		commentStr.getComment($scope.photo.commentId,function(err,comment){
			if(err){
				$scope.commentThread = {};
			}else{
				$scope.commentThread = comment;
			}
		})
	}
}]);
myApp.controller("pageContrl",["$scope","$http","commentStr",function($scope,$http,commentStr){
	$http.get("/page",{params:{pageName:"Photos Page"}})              //根据参数获取数据
	.success(function(data,status,headers,config){                    //请求成功返回请求参数
		$scope.page = data;
		$scope.loadComments();                                        //重新请求所有评论数据
	}).error(function(data,status,headers,config){
		$scope.page = {};
	});
	$scope.addReply = function(paramsCommentId,subject,body){
		var newComment = {subject:subject,body:body};
		commentStr.addComment($scope.commentThread._id,paramsCommentId,newComment,function(err,comment){
			$scope.loadComments();
		})
	}
	$scope.loadComments = function(){
		commentStr.getComment($scope.page.commentId,function(err,comment){  //根据当前相册ID获取当前相册所有评论
			if(err){
				$scope.commentThread = {};
			}else{
				$scope.commentThread = comment;                             //把数据绑定到页面展示
			}
		})
	}
}])