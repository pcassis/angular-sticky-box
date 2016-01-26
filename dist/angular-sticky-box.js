/*!
 * angular-sticky-box
 * https://github.com/pcassis/angular-sticky-box
 * Version: 0.0.1 - 2016-01-26T13:41:37.031Z
 * License: MIT
 */


'use strict';

angular.module('angular-sticky-box', []).directive('stickyBox', function ($timeout) {
	var viewHeight;

	function setup(scope, el) {
		scope.innerHeight = el.children[0].offsetHeight;

		if (scope.innerHeight >= el.offsetHeight) {
			scope.enabled = false;
			return;
		}
		scope.enabled = true;

		var parent = el;
		scope.wrapTop = el.offsetTop;
		while (parent.offsetParent) {
			scope.wrapTop += parent.offsetParent.offsetTop;
			parent = parent.offsetParent;
		}
		scope.wrapBottom = el.offsetHeight + scope.wrapTop;
		viewHeight = (window.innerHeight || document.documentElement.clientHeight);

		if (scope.innerHeight > viewHeight) {
			scope.sizeClass = 'sticky-inner-big';
			el.children[0].className = scope.sizeClass+' '+scope.posClass;
		} else {
			scope.sizeClass = 'sticky-inner-small';
			el.children[0].className = scope.sizeClass+' '+scope.posClass;
		}
		el.children[0].style.width = (el.offsetWidth)+'px';

		scroll(scope, el);
	}

	function scroll(scope, el) {
		var bottom, scrollBottom;
		if (!scope.enabled) {
			return;
		}

		if (window.pageYOffset + scope.cfg.offset > scope.wrapTop) {
			if (-1 == el.className.indexOf('sticky-fix')) {
				el.className += ' sticky-fix';
			}
		} else if (-1 != el.className.indexOf(' sticky-fix')) {
			el.className = el.className.replace(' sticky-fix', '');
		}

		if (scope.sizeClass == 'sticky-inner-big') {
			scope.posClass = '';
			bottom = parseInt(el.children[0].style.bottom);
			if (window.pageYOffset + viewHeight > scope.wrapBottom) {
				scope.posClass = 'down';
				scrollBottom = window.pageYOffset + viewHeight - scope.wrapBottom;
				el.children[0].style.bottom = scrollBottom+'px';
			} else if (window.pageYOffset + scope.cfg.offset < scope.wrapTop) {
				el.children[0].style.bottom = 0;
			} else if (window.pageYOffset > scope.pageY) {
				// going down
				if (window.pageYOffset + viewHeight > scope.wrapTop + scope.innerHeight) {
					if (bottom < 0 && bottom - scope.pageY + window.pageYOffset < 0) {
						el.children[0].style.bottom = (bottom - scope.pageY + window.pageYOffset)+'px';
					} else {
						el.children[0].style.bottom = '0';
					}
					scope.posClass = 'down';
				}
			} else {
				// going up
				scope.posClass = 'up';
				if (window.pageYOffset > scope.wrapTop + scope.cfg.offset) {
					if (scope.innerHeight + bottom - viewHeight <= 0) {
						el.children[0].style.bottom = (viewHeight - scope.innerHeight - scope.cfg.offset)+'px';
					} else {
						el.children[0].style.bottom = (bottom - scope.pageY + window.pageYOffset)+'px';
					}
				}
			}

		} else {
			if (window.pageYOffset + scope.innerHeight + scope.cfg.offset > scope.wrapBottom) {
				scope.posClass = 'bottom';
				scrollBottom = window.pageYOffset + viewHeight - scope.wrapBottom;
				el.children[0].style.bottom = scrollBottom+'px';
				el.children[0].scrollTop = scrollBottom;
				el.children[0].style.top = 'auto';
			} else {
				el.children[0].style.top = scope.cfg.offset+'px';
				scope.posClass = '';
			}
		}
		el.children[0].className = scope.sizeClass+' '+scope.posClass;
		scope.pageY = window.pageYOffset;
	}


	return {
		restrict: 'A',
		scope:{
			offset:'@stickyBoxOffset'
		},
		link: function(scope, element) {
			function setupScope() {
				setup(scope, el);
			}
			var el = element[0];
			el.className += ' sticky-box';

			scope.cfg = {};
			if (!scope.offset) {
				scope.cfg.offset = 0;
			} else {
				scope.cfg.offset = parseInt(scope.offset);
			}

			angular.element(window).on('resize', function() {
				$timeout(function() {
					setup(scope, el);
				});
			});
			angular.element(window).on('scroll', function() {
				scroll(scope, el);
			});

			scope.$on('stickyBoxUpdate', function() {
				$timeout(setupScope, 100);
			});

			$timeout(setupScope, 100);
		}
	};
});
angular.module("angular-sticky-box").run(["$templateCache", function($templateCache) {$templateCache.put("angular-sticky-box.html","<div class=\"angular-sticky-box\"><div>The value is {{getValue()}}</div><button ng-click=\"increment()\">+</button></div>");}]);