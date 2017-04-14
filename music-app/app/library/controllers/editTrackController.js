var angular = require('angular')
angular.module('web-app').
controller('editTrackController',['$scope','$window','$location','$timeout',
	function($scope,$window,$location,$timeout) {
	
	$scope.disableTimer=true;
    $scope.timerWithTimeout = 0;
    $scope.count=0;
    $scope.trackCount=1;
    $scope.times=0;
    $scope.username=$window.localStorage.username;
    
    // Loads data..
    $scope.allAccounts = JSON.parse(localStorage.getItem("library"));
	if($scope.allAccounts!=null){
		for(i=0;i<$scope.allAccounts.length;i++){
			if($scope.allAccounts[i].name==$scope.username){
				$scope.tracks = $scope.allAccounts[i].tracks;
				$scope.totalItems=$scope.tracks.length;
				break;
			}
		}
	}		
    $scope.title=$scope.tracks[0].name;
	if($scope.tracks!=undefined){
		$scope.totalItems=$scope.tracks.length;
	}
	var duration = ($scope.tracks[0].end_time.split(":")[0]*60+parseInt($scope.tracks[0].end_time.split(":")[1]))-($scope.tracks[0].start_time.split(":")[0]*60+parseInt($scope.tracks[0].start_time.split(":")[1]));
	var quotient = Math.floor(duration/60);
	if(quotient<10){
		quotient="0"+quotient;
	}
	var remainder = duration % 60;
	if(remainder<10){
		remainder="0"+remainder;
	}
	$scope.totalTime=quotient+":"+remainder;
	
	
	//Loads videoplayer
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      //  This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      $scope.videoIDs=[];
      for(i=0;i<$scope.tracks.length;i++){
      	$scope.videoIDs.push($scope.tracks[i].url.split("/")[4]);
      }
      var player, currentVideoId = 0;
      
	window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
          	height: '390',
          	width: '640',
          	playerVars:{
          		autoplay:1,
          		controls: 0,
           		loop:1,
           		cc_load_policy:0,
           		disablekb:1,
           		rel:0,
           		showinfo:0     	
          	},
          	events: {
         		'onReady': function (event) {
         			event.target.loadVideoById({
         				'videoId': $scope.videoIDs[currentVideoId],
               			'startSeconds': ($scope.tracks[currentVideoId].start_time.split(":")[0]*60+parseInt($scope.tracks[currentVideoId].start_time.split(":")[1])),
               			'endSeconds': ($scope.tracks[currentVideoId].end_time.split(":")[0]*60+parseInt($scope.tracks[currentVideoId].end_time.split(":")[1])),
               			'suggestedQuality': 'large'});
               			
             		player.addEventListener('onStateChange', function(e) {
                 		console.log('State is:', e.data);
                 		if($scope.count<$scope.tracks.length){
                 			$scope.startTimerWithTimeout();
                 		}
             		});
         		},
         		'onStateChange': function (event) {
             		console.log('State Changed - ', event.data);
             		if(event.data==1 || event.data==3){
             			$scope.times=0;
             		}
             		if(event.data==YT.PlayerState.ENDED && $scope.trackCount<$scope.tracks.length && $scope.times==0){
              			currentVideoId++;
              			$scope.times=1;
            			if (currentVideoId < $scope.videoIDs.length) {
                			player.loadVideoById({'videoId': $scope.videoIDs[currentVideoId],
               					'startSeconds': ($scope.tracks[currentVideoId].start_time.split(":")[0]*60+parseInt($scope.tracks[currentVideoId].start_time.split(":")[1])),
               					'endSeconds': ($scope.tracks[currentVideoId].end_time.split(":")[0]*60+parseInt($scope.tracks[currentVideoId].end_time.split(":")[1])),
               					'suggestedQuality': 'large'});
                			$scope.title=$scope.tracks[currentVideoId].name;
	            			var duration = ($scope.tracks[currentVideoId].end_time.split(":")[0]*60+parseInt($scope.tracks[currentVideoId].end_time.split(":")[1]))-($scope.tracks[currentVideoId].start_time.split(":")[0]*60+parseInt($scope.tracks[currentVideoId].start_time.split(":")[1]));
							var quotient = Math.floor(duration/60);
							if(quotient<10){
								quotient="0"+quotient;
							}
							var remainder = duration % 60;
							if(remainder<10){
								remainder="0"+remainder;
							}
							$scope.totalTime=quotient+":"+remainder;
            			}
             		}
             		if(currentVideoId==$scope.tracks.length){
             			$scope.disableTimer=false;
             			player.stopVideo();
             		}
         		}
    		}
        });
      }
	
	// strats timer
	$scope.startTimerWithTimeout = function() {
	    $scope.timerWithTimeout = 1;
	    if($scope.myTimeout){
	      $timeout.cancel($scope.myTimeout);
	    }
	    $scope.onTimeout = function(){
	        $scope.timerWithTimeout++;
	        $scope.myTimeout = $timeout($scope.onTimeout,1000);
	    }
	    $scope.myTimeout = $timeout($scope.onTimeout,1000);
	};
	
	$scope.musicList = function(){
		$window.location.href="/library/"+$scope.username;
	}
	
	
	
	$scope.pageChanged = function(page){
		$scope.currentPage=page;
	}

}])

.filter('mmss', function () {
  return function (time) {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
  }
});