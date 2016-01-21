/// <reference path="../../references.d.ts" />

module common {
    interface NavPillsScope extends ng.IScope {
        currentState?;
        states?: string[];
    }

    export class NavPillsDirective {
        public templateUrl = 'views/nav-pills.html';
        public restrict = 'E';
        public scope = false;
        static $inject = ['$rootScope', '$state'];
        public link: (scope: NavPillsScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        public currentState: string = null;

        constructor($rootScope: ng.IRootScopeService, $stateParams: ng.ui.IStateParamsService) {
            NavPillsDirective.prototype.link = (scope: NavPillsScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                scope.states = [/*'home',*/'reddit','twitter'/*,'medium'*/,'imgur', 'user'];
                
                scope.currentState = $stateParams['current'];

                $rootScope.$on('$stateChangeSuccess', (event: ng.IAngularEvent, ...args: any[]) => {
                    // toState, toParams, fromState, fromParams
                    scope.currentState = args[0]['name'];
                });
            }
        }

        static factory() {
            var directive = ($rootScope: ng.IRootScopeService, $stateParams: ng.ui.IStateParamsService) => new NavPillsDirective($rootScope, $stateParams);
            directive.$inject = NavPillsDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsNavPills', common.NavPillsDirective.factory());
})();