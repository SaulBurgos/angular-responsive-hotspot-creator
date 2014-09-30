'use strict';

/* Directives */


angular.module('hotspotModule', [])

.directive('hotspotCreator', function(){
		// Runs during compile
		return {
			scope: {
				imageSrc: '=imageSrc',
				hotspots: '=hotspots',
				options: '=options',
			},
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: 'partials/fragments/hotspotCreator.html',
			replace: true,
			
			link: function(scope, iElm, iAttrs, controller) {
				scope.creatorHtml;
				scope.hotspotJsonString = 'hello';

				scope.init = function () {
				   var jquiScript = document.createElement('script');
				   jquiScript.type = 'text/javascript';
				   jquiScript.async = true;
				   jquiScript.src = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js';
				   jquiScript.onload = function () {
				   	scope.createClickEvents();
				   };
				   var s = document.getElementsByTagName('script')[0];
				   s.parentNode.insertBefore(jquiScript, s);

				   var jquiStyle = document.createElement('link');
				   jquiStyle.rel = "stylesheet";
				   jquiStyle.href = "http://code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css";
				   var firstLink = document.getElementsByTagName('link')[0];
				   firstLink.parentNode.insertBefore(jquiStyle, firstLink);

					scope.$watchCollection('options', function (newValue) {
						scope.setHotspotDraggable(newValue.hotspotDraggable);
					}, true);

					var parent =  angular.element('#hotspotCreator .hotspotCreator-arrange');
				 	
				 	scope.$watch('imageSrc', function(newValue, oldValue) {
				 		parent.removeAttr('style');
	             	jQuery('.hotspotCreator-image').load(function() {
							parent.css('height',jQuery(this).css('height'));
							parent.css('width',jQuery(this).css('width'));
	             	});

	           	});

				};

				scope.createClickEvents = function() {
					scope.creatorHtml = angular.element('.hotspotCreator-arrange');
					scope.creatorHtml.on('mousedown', function(event){

					 	var coor = {X: 0,Y: 0};
					 	var gap = 10;//to locate the hotspot in center of cursor
				    	if (event.offsetX == undefined) {
					      coor = {X: event.pageX - jQuery(this).offset().left - gap, Y: event.pageY - jQuery(this).offset().top - gap};
				    	} else {
					      coor = {X: event.offsetX - gap, Y: event.offsetY - gap};
				    	}
						
						scope.$apply(function(){
							scope.addHotspot(coor);
							scope.getUnitInPercentages();
						});
						
						event.stopPropagation();
					});
				};

				scope.addHotspot = function(coord) {
					scope.hotspots.push({
						/*name: 'hotspot (' + coord.X + ',' + coord.Y + ')',*/ 
						name: 'hotspot added',
						position: {
							top: coord.Y,
							left: coord.X
						}
					});
				};

		      	scope.setUpHotspot = function() {
      	 			angular.element('#hotspotCreator .hotspotCreator-hotspot').each(function( index ) {
				 		jQuery(this).resizable({
				 			containment: "parent",
	        				stop: function(event) {
			         		scope.$apply(scope.getUnitInPercentages());
	        				}
				 		});

				 		if (scope.options.hotspotDraggable) {
				 			jQuery(this).draggable({
					         	containment: "parent",
					         	scroll: false,
					         	stop: function() {
					         		scope.$apply(scope.getUnitInPercentages());
			        			}
		        			});
		        			jQuery(this).css('cursor', 'move');
				 		}else {
				 			jQuery(this).css('cursor', 'default');
				 		}

				 		/*avoid propagation*/
	        			jQuery(this).mousedown(function() {
	        				return false
	        			});

	        			/*add random position to elements added to new elements to the array*/
	        			if(!_.isUndefined(scope.hotspots[index]) && !_.has(scope.hotspots[index], "position") ) {
	        				scope.hotspots[index].position = scope.getRandomPosition();
	        			};
					});
		     	};

				scope.reorganizeHotspotRandom = function() {
					for (var i = 0; i < scope.hotspots.length; i++) {
						/*add random position to elements added to new elements to the array*/
						if(_.has(scope.hotspots[i], "position") ) {
							scope.hotspots[i].position = scope.getRandomPosition();
						};
					};
				};

				scope.getRandomPosition = function() {
					var parent =  angular.element('#hotspotCreator .hotspotCreator-arrange');
					var parentHeight = parseFloat(parent.css('height'));
					var parentWidth = parseFloat(parent.css('width'));

					/* get top and left in percentages */
					var randomLeft = _.random(0, parentWidth);
					var leftPercentage = (randomLeft*100)/parentWidth;

					var randomTop = _.random(0, parentHeight);
					var topPercentage = (randomTop*100)/parentHeight;

					return {
						top: topPercentage + '%',
						left: leftPercentage + '%'
					};
				};

				scope.getUnitInPercentages = function() {
					var parent =  angular.element('#hotspotCreator .hotspotCreator-arrange');
					var parentHeight = parseFloat(parent.css('height'));
					var parentWidth = parseFloat(parent.css('width'));

					angular.element('#hotspotCreator .hotspotCreator-hotspot').each(function(index) {
						var currentElement = jQuery(this);
						var hotspotLeft = parseFloat(currentElement.css('left'));
						var hotspotTop = parseFloat(currentElement.css('top'));
						var hotspotWidth = parseFloat(currentElement.css('width'));
						var hotspotHeight = parseFloat(currentElement.css('height'));

						var leftPercentage = (hotspotLeft*100)/parentWidth;
						var topPercentage = (hotspotTop*100)/parentHeight;

						var widthPercentage = (hotspotWidth*100)/parentWidth;
						var heightPercentage = (hotspotHeight*100)/parentHeight;

						scope.hotspots[index].name = 'hotspot' + index;
						scope.hotspots[index].position = {
							'left': leftPercentage + '%',
							'top': topPercentage + '%',
							'width': widthPercentage + '%',
							'height': heightPercentage + '%'
						};

						currentElement.css({
							'left': leftPercentage + '%',
							'top': topPercentage + '%',
							'width': widthPercentage + '%',
							'height': heightPercentage + '%'
						});
					});
				};

				scope.setHotspotDraggable = function (isDraggable) {
					angular.element('#hotspotCreator .hotspotCreator-hotspot').each(function(index) {
						if(isDraggable) {
							/* if element has not been initializated as draggable object */
							if (typeof jQuery(this).data('ui-draggable') == 'undefined') {
								jQuery(this).draggable({
						         	containment: "parent",
						         	scroll: false,
						         	stop: function() {
						         		scope.getUnitInPercentages();
				        			}
			        			});
							}
							jQuery(this).draggable('enable');
							jQuery(this).css('cursor', 'move');
						}else {
							jQuery(this).draggable('disable');
							jQuery(this).css('cursor', 'default');
						}
					});
				};

		      scope.init();
			}
		};
	});