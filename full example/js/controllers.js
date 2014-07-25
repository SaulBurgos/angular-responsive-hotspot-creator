'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

.controller('MyCtrl1', function($scope) {

	$scope.data = {
		image: 'http://russiatrek.org/images/photo/novgorod-region-landscape.jpg',
		hotspots: [],
		options: {
			showList: true,
			showRandomButton: true,
			hotspotDraggable: true
		}
	}

	$scope.getJsonString = function(){
		return angular.toJson($scope.data.hotspots);
	}

	$scope.eventClick = function(index) {
		alert('Do somtething here  hotspot #' + index);
	};

	$scope.$on('$viewContentLoaded', function() {
   	
	});

})

.controller('MyCtrl2', function($scope) {

});
