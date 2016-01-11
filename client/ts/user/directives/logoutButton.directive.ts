/// <reference path="../../references.d.ts" />

module user {
	interface LogoutButtonScope extends ng.IScope {
		logout?: () => void;
	}

	export class LogoutButtonDirective {
		public template = '<button data-ng-click="logout()">Logout</button>';
		public restrict = 'E';
		public scope = false;
		public link: (scope: LogoutButtonScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
		static $inject = ['$rootScope', 'UserService'];

		constructor(private $rootScope: ng.IRootScopeService, private UserService: services.UserService) {
			LogoutButtonDirective.prototype.link = (scope: LogoutButtonScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
				scope.logout = () => {
					UserService.logout().then(response=> {
						console.log('User logged out.');
						this.$rootScope.$broadcast('USER_LOGOUT');
					}).catch(error=> {
						console.log('LogoutButtonDirective - ', error);
					})
				}
			}
		}

		static factory() {
			var directive = ($rootScope: ng.IRootScopeService, UserService: services.UserService) => new LogoutButtonDirective($rootScope, UserService);
			directive.$inject = LogoutButtonDirective.$inject;
			return directive;
		}
	}
}

(() => {
	angular.module('user').directive('fsLogoutButton', user.LogoutButtonDirective.factory());
})();