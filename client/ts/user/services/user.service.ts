/// <reference path="../../references.d.ts" />

module user.services {
    export class UserService {
        private currentUser: any = null;
        private apiBase = '/api/';

        static $inject = ['$http', '$q'];

        constructor(private $http: ng.IHttpService, private $q: ng.IQService) {

        }

        static factory() {
            var factory = ($http: ng.IHttpService, $q: ng.IQService) => new UserService($http, $q);
            factory.$inject = UserService.$inject;
            return factory;
        }

        public userLoggedIn() {
            return angular.isDefined(this.currentUser) && this.currentUser !== null;
        }

        public getCurrentUser() {
            var defer = this.$q.defer();

            if (this.currentUser) {
                this.$q.when(this.currentUser);
            } else {
                this.$http.get(this.apiBase + 'user').then(response=> {
                    if (response.status === 200) {
                        this.currentUser = response.data;
                        defer.resolve(this.currentUser);
                    } else {
                        defer.reject(response.data);
                    }
                }).catch(error=> {
                    defer.reject(error);
                });
            }
            return defer.promise;
        }

        public logout() {
            this.currentUser = null;

            var defer = this.$q.defer();

            this.$http.get(this.apiBase + 'logout').then(response=> {
                if (response.status === 200) {
                    defer.resolve(response.data);
                } else {
                    defer.reject(response.data);
                }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }
    }
}

(() => {
    angular
        .module('user')
        .service('UserService', user.services.UserService.factory());
})();
    