var angular = require('angular')
angular.module('web-app').factory('musicService',['$cacheFactory',function($cacheFactory) {
	

	return $cacheFactory('tracks');

}])