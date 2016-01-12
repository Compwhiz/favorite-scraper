/// <reference path="../../references.d.ts" />

module user {
    interface LogoutButtonScope extends ng.IScope {
        logout?: () => void;
    }

    export class LogoutButtonDirective {
        public template = '<a href="javascript:void(0)" data-ng-click="logout()" data-fs-if-user>Logout</a>';
        public restrict = 'E';
        public replace = true;
        public scope = false;
        public link: (scope: LogoutButtonScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = ['$rootScope', 'UserService'];

        constructor(private $rootScope: ng.IRootScopeService, private UserService: services.UserService) {
            LogoutButtonDirective.prototype.link = (scope: LogoutButtonScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                scope.logout = () => {
                    UserService.logout();
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