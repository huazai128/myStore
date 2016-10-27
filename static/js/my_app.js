angular.module("myApp",[]).
controller("myCtrl",["$scope","$http",function($scope,$http){
	//
	$http.get("/user/profile")
	.success(function(data,status,headers,config) {
		//console.log(data + "kekek")
		$scope.user = data;
		$scope.error = "";
	})
	.error(function (err) {
		$scope.user = {};
		$scope.error = data
	})
}])