/// <reference path="../../references.d.ts" />

module tumblr {
    interface TumblrPostScope extends ng.IScope {
        post?: any;
    }

    export class TumblrPostDirective {
        public templateUrl = 'views/tumblr-post.html';
        public restrict = 'E';
        public scope = { post: '=' };
        public link: (scope: TumblrPostScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        constructor() {
            TumblrPostDirective.prototype.link = (scope: TumblrPostScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            }
        }

        static factory() {
            var directive = () => new TumblrPostDirective();
            return directive;
        }
    }
}

(() => {
    angular.module('tumblr').directive('fsTumblrPost', tumblr.TumblrPostDirective.factory());
})();