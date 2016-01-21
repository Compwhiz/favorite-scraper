/// <reference path="../../references.d.ts" />

module reddit {
    interface RedditContentScope extends ng.IScope {
        post?: any;
    }

    export class RedditContentDirective {
        public templateUrl = 'views/reddit-post.html';
        public restrict = 'E';
        public scope = { post: '=' };
        public link: (scope: RedditContentScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        constructor() {
            RedditContentDirective.prototype.link = (scope: RedditContentScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                switch (scope.post.thumbnail.toUpperCase()) {
                    case 'SELF':
                    case 'DEFAULT':
                        scope.post.thumbnail = '';
                        break;
                    default:
                        break;
                }
            }
        }

        static factory() {
            var directive = () => new RedditContentDirective();
            return directive;
        }
    }
}

(() => {
    angular.module('reddit').directive('fsRedditPost', reddit.RedditContentDirective.factory());
})();