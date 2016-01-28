/// <reference path="../../references" />

module tumblr {
    export class TumblrService {
        static $inject = ['$http', '$q'];
        constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

        static factory() {
            let factory = ($http, $q) => new TumblrService($http, $q);
            factory.$inject = TumblrService.$inject;
            return factory;
        }
    }
}

(() => {
    angular.module('tumblr').factory('TumblrService', tumblr.TumblrService.factory())
})();