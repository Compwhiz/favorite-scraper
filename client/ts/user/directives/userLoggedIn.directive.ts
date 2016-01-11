/// <reference path="../../references.d.ts" />

module user {
	export class UserLoggedInDirective {
		public restrict = 'A';
		public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
		static $inject = ['$rootScope', 'UserService'];

		constructor(private $rootScope: ng.IRootScopeService, private UserService: services.UserService) {
			UserLoggedInDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
				var switched = scope.$eval(attrs['fsUserLoggedIn']);

				checkLoggedIn();

				$rootScope.$on('USER_LOGOUT', (event: ng.IAngularEvent, ...args: any[]) => {
					checkLoggedIn();
				});

				function checkLoggedIn() {
					if (UserService.userLoggedIn()) {
						if (switched) {
							$(element).show();
						} else {
							$(element).hide();
						}
					} else {
						if (switched) {
							$(element).hide();
						}
						else {
							$(element).show();
						}
					}
				}
			}
		}

		static factory() {
			var directive = ($rootScope: ng.IRootScopeService, UserService: services.UserService) => new UserLoggedInDirective($rootScope, UserService);
			directive.$inject = UserLoggedInDirective.$inject;
			return directive;
		}
	}
}

(() => {
	angular.module('user').directive('fsUserLoggedIn', user.UserLoggedInDirective.factory());
})();