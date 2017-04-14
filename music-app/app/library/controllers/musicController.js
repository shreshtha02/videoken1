var angular = require('angular')
angular.module('web-app').
controller('musicController',['$scope','sweet','$window','$location','$routeParams',
	function($scope,sweet,$window,$location,$routeParams) {
	
	$scope.searchText ="";
	$scope.currentPage=1;
	$scope.itemsPerPage=20;
	var url=window.location.href;
	if(url.split("/")[3]==""){
		$window.location.href="/login.html";
	}
	else if(url.split("/")[4]!=undefined){
		$window.localStorage.username=url.split("/")[4];
	}
	$scope.username =$window.localStorage.username;
	$scope.tracksVideo=[];
	$scope.track={};
	$scope.allAccounts=[];
	$scope.endTimeGreater =false;
	
	//Loads data...
	$scope.loadData = function(){
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
	}
	$scope.loadData();
	
	$scope.pageChanged = function(page){
		$scope.currentPage=page;
		$scope.loadData();
	}
	
	$scope.getRate = function(num,val) {
		if(val==0){
			num=Math.round(num/2);		
	    	return new Array(parseInt(num));
		} 
		else{
			num=Math.round(num/2);
			num=5-num;
			return new Array(parseInt(num));
		}  
	}
	
	$scope.addVideo = function(){
		$window.location.href="/addtrack";
	}
	
	$scope.playVideo = function(index){
		$window.location.href="/playvideo";
	}
	
	// Adds new video to the playlist...
	$scope.addNewVideo = function(){
		$scope.track['start_time']=document.getElementById("track_start_time").value;
		$scope.track['end_time']=document.getElementById("track_end_time").value;
		var video_url=$scope.track.url.split("=")[1];
		$scope.track.url="https://www.youtube.com/embed/"+video_url;
		if($scope.track['start_time']>$scope.track['end_time']){
			var $toastContent = $('<span>End time should be greater than start time.</span>');
  			Materialize.toast($toastContent, 5000, 'rounded');
		}
		else{
			if($scope.tracksVideo!=undefined){
				$scope.tracksVideo.push($scope.track);
			}
			else{
				$scope.tracksVideo=[];
				$scope.tracksVideo.push($scope.track);
			}
			var account={'name':$scope.username,'tracks':$scope.tracksVideo};
			if($scope.allAccounts==null){
				$scope.allAccounts=[];
			}
			if($scope.allAccounts.length==0){
				$scope.allAccounts.push(account);
			}
			else{
				for(i=0;i<$scope.allAccounts.length;i++){
					if($scope.allAccounts[i].name==$scope.username){
						$scope.allAccounts[i]=account;
						break;
					}
					else if(i==$scope.allAccounts.length-1){
						$scope.allAccounts.push(account);
						break;
					}
				}
			}
			localStorage.setItem("library", JSON.stringify($scope.allAccounts));
			sweet.show('success', 'New video is added successfully', 'success');
			$scope.track={};
			$scope.loadData();
		}
	}
	
	$scope.musicList = function(){
		$window.location.href="/library/"+$scope.username;
	}
	
	$scope.signout = function(){
		$window.location.href="/login.html";
	}
}])
