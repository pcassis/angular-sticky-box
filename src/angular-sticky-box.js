'use strict';

angular.module('angular-sticky-box', []).directive('stickyBox', ['$timeout', function ($timeout) {
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
			scope.breaks = [
				{
					top: scope.wrapBottom - viewHeight,
					className: 'bottom',
					style: [['top', (el.offsetHeight - scope.innerHeight)+'px']]
				},
				{
					top: scope.wrapTop - scope.cfg.offset,
					className: 'top',
					style: [['top', 'auto']],
					up:function(scope, el) {
						scope.pageYup = window.pageYOffset;
						var bottom = parseInt(el.children[0].style.bottom);
							if (scope.pageYdown - window.pageYOffset <= scope.innerHeight - viewHeight + scope.cfg.offset) {
								el.children[0].style.bottom = (bottom + window.pageYOffset - scope.pageY )+'px';
							} else {
								el.children[0].style.bottom = (viewHeight - scope.innerHeight - scope.cfg.offset)+'px';
							}
					},
					down:function(scope, el) {
						scope.pageYdown = window.pageYOffset;
						if (!scope.pageYup) {
							scope.pageYup = scope.pageY;
						}

						var bottom = parseInt(el.children[0].style.bottom);
						if (isNaN(bottom)) {
							bottom = viewHeight - scope.innerHeight - scope.cfg.offset;
						}
						if (bottom < 0) {
							el.children[0].style.bottom = (bottom + window.pageYOffset - scope.pageY )+'px';
						} else {
							el.children[0].style.bottom = '0px';
						}
					}
				}
			];
			el.children[0].className = scope.sizeClass+' '+scope.posClass;
		} else {
			scope.sizeClass = 'sticky-inner-small';
			scope.breaks = [
				{
					top: scope.wrapBottom - scope.innerHeight - scope.cfg.offset,
					className: 'bottom',
					style: [['top', (el.offsetHeight - scope.innerHeight)+'px']]
				},
				{
					top: scope.wrapTop - scope.cfg.offset,
					className: 'top',
					style: [['top', scope.cfg.offset+'px']]
				}
			];
			el.children[0].className = scope.sizeClass+' '+scope.posClass;
		}
		el.children[0].style.width = (el.offsetWidth)+'px';

		scroll(scope, el);
	}

	function scroll(scope, el) {
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

		var currentBreak = false;
		for (var i=0; i<scope.breaks.length; i++) {
			if (window.pageYOffset > scope.breaks[i].top) {
				if (scope.posClass != scope.breaks[i].className) {
					scope.posClass = scope.breaks[i].className;
					for (var j=0; j<scope.breaks[i].style.length; j++) {
						el.children[0].style[scope.breaks[i].style[j][0]] = scope.breaks[i].style[j][1];
					}
				}
				currentBreak = scope.breaks[i];
				break;
			}
		}
		if (!currentBreak) {
			scope.posClass = '';
		} else {
			if (window.pageYOffset > scope.pageY) {
				if (currentBreak.down) {
					currentBreak.down(scope, el);
				}
			} else {
				if (currentBreak.up) {
					currentBreak.up(scope, el);
				}
			}

		}
		scope.pageY = window.pageYOffset;

		el.children[0].className = scope.sizeClass+' '+scope.posClass;
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

			scope.pageY = scope.pageYup = scope.pageYdown = window.pageYOffset;

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
}]);