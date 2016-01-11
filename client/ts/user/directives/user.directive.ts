/// <reference path="../../references.d.ts" />

module user {
	interface UserScope extends ng.IScope {
		user?: any;
	}

	export class UserDirective {
		public templateUrl = 'client/views/user.html';
		public restrict = 'E';
		public link: (scope: UserScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
		static $inject = ['$rootScope', 'UserService'];

		constructor(private $rootScope: ng.IRootScopeService, private UserService: services.UserService) {
			UserDirective.prototype.link = (scope: UserScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
				getCurrentUser();

				$rootScope.$on('USER_LOGOUT', (event: ng.IAngularEvent, ...args: any[]) => {
					getCurrentUser();
				});

				function getCurrentUser() {
					UserService.getCurrentUser().then(user=> {
						scope.user = user;
					}).catch(error=> {
						scope.user = null;
						console.log('UserDirective - ', error);
					});
				}
			}
		}

		static factory() {
			var directive = ($rootScope: ng.IRootScopeService, UserService: services.UserService) => new UserDirective($rootScope, UserService);
			directive.$inject = UserDirective.$inject;
			return directive;
		}
	}
}

(() => {
	angular.module('user').directive('fsCurrentUser', user.UserDirective.factory());
})();