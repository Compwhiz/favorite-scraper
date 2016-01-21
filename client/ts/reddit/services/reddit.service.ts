/// <reference path="../../references.d.ts" />

module reddit {
    export class RedditService {
        static $inject: string[] = ['$http', '$q'];
        apiBase: string = '/api/reddit/';
        currentUser: any = null;

        constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

        static factory() {
            var factory = ($http: ng.IHttpService, $q: ng.IQService) => new RedditService($http, $q);
            factory.$inject = RedditService.$inject;
            return factory;
        }

        public getSavedPosts(after?) {
            var url = this.apiBase + 'saved';
            if (after) {
                url += '?after=' + after;
            }
            return this.$http.get<any>(url).then(response => response.data);
        }
    }
}

(() => {
    angular.module('reddit').factory('RedditService', reddit.RedditService.factory());
})();