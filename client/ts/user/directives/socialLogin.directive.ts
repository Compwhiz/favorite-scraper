/// <reference path="../../references" />

module user {
    interface SocialLoginDirectiveScope extends ng.IScope {
        options: any[]
    }
    export class SocialLoginDirective {
        static $inject = [];
        public templateUrl = 'views/social-login.html';
        public restrict = 'E';
        public link: (scope: SocialLoginDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        constructor() {
            SocialLoginDirective.prototype.link = (scope: SocialLoginDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                scope.options = ['reddit', 'twitter', 'imgur', 'tumblr'];
            }
        }

        static factory() {
            let factory = () => new SocialLoginDirective();
            factory.$inject = SocialLoginDirective.$inject;
            return factory;
        }
    }
}

(() => {
    angular.module('user').directive('fsSocialLogin', user.SocialLoginDirective.factory());
})();