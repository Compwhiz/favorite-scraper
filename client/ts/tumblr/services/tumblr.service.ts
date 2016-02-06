/// <reference path="../../references" />

module tumblr {
    export class TumblrService {
        static $inject = ['$http', '$q'];
        apiBase: string = '/api/tumblr/';
        constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

        static factory() {
            let factory = ($http, $q) => new TumblrService($http, $q);
            factory.$inject = TumblrService.$inject;
            return factory;
        }

        public getLikes() {
            var defer = this.$q.defer<any>();
            var url = this.apiBase + 'likes';
            this.$http.get(url).then(response => {
                if (response.status === 200)
                    defer.resolve(response.data);
                else
                    defer.reject(response.data);
            }).catch(error=> {
                defer.reject(error.data);
            });
            return defer.promise;
        }
    }
}

(() => {
    angular.module('tumblr').factory('TumblrService', tumblr.TumblrService.factory())
})();