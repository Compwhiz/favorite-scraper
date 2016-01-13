/// <reference path="../../references.d.ts" />

// Inspiration for this directive came from the Stormpath Angular SDK 
// https://github.com/stormpath/stormpath-sdk-angularjs/blob/e012510/src/module.js#L489

module user {
    export class IfUserDirective {
        public restrict = 'A';
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = ['$rootScope'];

        constructor(private $rootScope: ng.IRootScopeService) {
            IfUserDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

                $rootScope.$watch('user', (user) => {
                    if (user) {
                        element.removeClass('ng-hide');
                    } else {
                        element.addClass('ng-hide');
                    }
                });
            }
        }

        static factory() {
            var directive = ($rootScope: ng.IRootScopeService) => new IfUserDirective($rootScope);
            directive.$inject = IfUserDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('user').directive('fsIfUser', user.IfUserDirective.factory());
})();