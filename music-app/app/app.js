require('angular')
require('lodash')
var app = angular.module('web-app',[require('angular-route'), 
											require('angular-materialize'),
											require('angular-bootstrap-npm'),
                      						require('angular-h-sweetalert'),
                      						require('angular-paging'),
]);

require('./library')

var mainapp = angular.module('livesport-main',[require('angular-route')
]);
mainapp.controller('MainController',['$scope','$location','$window',function($scope,$location,$window) {
	
	$scope.user = {username:"",password:""};
	
	$scope.login = function() {
		console.log("login")
		$window.location.href = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/library/" +$scope.user.username;
		
	}
}])

