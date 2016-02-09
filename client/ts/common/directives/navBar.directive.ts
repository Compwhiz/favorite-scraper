/// <reference path="../../references.d.ts" />

module common {
    interface NavBarScope extends ng.IScope {
        navbarCollapsed: boolean;
        navigateToState: any;
    }

    export class NavBarDirective {
        public templateUrl = 'views/nav-bar.html';
        public restrict = 'E';
        public scope = false;
        static $inject = ['$state'];
        public link: (scope: NavBarScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        constructor($state:ng.ui.IStateService) {
            NavBarDirective.prototype.link = (scope: NavBarScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                scope.navbarCollapsed = true;

                scope.navigateToState = function navigateToState(state) {
                    scope.navbarCollapsed=true;
                    $state.transitionTo(state);
                }
            }
        }

        static factory() {
            var directive = ($state) => new NavBarDirective($state);
            directive.$inject = NavBarDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsNavBar', common.NavBarDirective.factory());
})();