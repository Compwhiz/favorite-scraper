/// <reference path="../../references.d.ts" />

// Inspiration for this directive came from the Stormpath Angular SDK 
// https://github.com/stormpath/stormpath-sdk-angularjs/blob/e012510/src/module.js#L489

module user {
    export class IfNotUserDirective {
        public restrict = 'A';
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = ['$rootScope'];

        constructor(private $rootScope: ng.IRootScopeService, private UserService: services.UserService) {
            IfNotUserDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

                $rootScope.$watch('user', (user) => {
                    if (user) {
                        element.addClass('ng-hide');
                    } else {
                        element.removeClass('ng-hide');
                    }
                });
            }
        }

        static factory() {
            var directive = ($rootScope: ng.IRootScopeService, UserService: services.UserService) => new IfNotUserDirective($rootScope, UserService);
            directive.$inject = IfNotUserDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('user').directive('fsIfNotUser', user.IfNotUserDirective.factory());
})();