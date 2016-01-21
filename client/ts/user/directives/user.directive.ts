/// <reference path="../../references.d.ts" />

module user {
    interface UserScope extends ng.IScope {
        user?: any;
    }

    export class UserDirective {
        public templateUrl = 'views/user.html';
        public restrict = 'E';
        public replace = true;
        public link: (scope: UserScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = ['$rootScope'];

        constructor(private $rootScope: any) {
            UserDirective.prototype.link = (scope: UserScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                scope.user = $rootScope.user;
            };
        }

        static factory() {
            var directive = ($rootScope: ng.IRootScopeService) => new UserDirective($rootScope);
            directive.$inject = UserDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('user').directive('fsCurrentUser', user.UserDirective.factory());
})();