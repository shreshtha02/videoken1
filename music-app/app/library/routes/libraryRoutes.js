var angular = require('angular')
angular.module('web-app').
config(function($routeProvider,$locationProvider) {
	$routeProvider.when('/library/:key1', {
                templateUrl : 'partials/music/music.html',
                controller  : 'musicController'
           }).when('/addtrack', {
                templateUrl : 'partials/music/createTrack.html',
                controller  : 'musicController'
           }).when('/playvideo', {
                templateUrl : 'partials/music/playVideo.html',
                controller  : 'editTrackController'
           });
           $locationProvider.html5Mode(true);
})