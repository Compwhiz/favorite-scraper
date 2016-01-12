/// <reference path="../../references.d.ts" />

module common {
    interface NavBarScope extends ng.IScope {

    }

    export class NavBarDirective {
        public templateUrl = 'client/views/nav-bar.html';
        public restrict = 'E';
        public scope = false;
        static $inject = [];
        public link: (scope: NavBarScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        public currentState: string = null;

        constructor() {
            NavBarDirective.prototype.link = (scope: NavBarScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            }
        }

        static factory() {
            var directive = () => new NavBarDirective();
            directive.$inject = NavBarDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsNavBar', common.NavBarDirective.factory());
})();