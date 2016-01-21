/// <reference path="../../references.d.ts" />

module user.services {
    export class UserService {
        private apiBase = '/api/';

        static $inject = ['$http', '$q', '$rootScope'];

        // $rootScope is of type any so we can put a reference to the current user on their
        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $rootScope: any) {

        }

        static factory() {
            var factory = ($http: ng.IHttpService, $q: ng.IQService, $rootScope: any) => new UserService($http, $q, $rootScope);
            factory.$inject = UserService.$inject;
            return factory;
        }

        public getAllUsers() {
            var defer = this.$q.defer();

            this.$http.get(this.apiBase + 'user/all').then((response) => {
                if (response.status === 200)
                { defer.resolve(response.data); }
                else { defer.reject(response.data); }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public login(data) {
            var defer = this.$q.defer();

            this.$http.post(this.apiBase + 'user/login', data).then((response) => {
                if (response.status === 200) {
                    this.$rootScope.user = response.data;
                    this.$rootScope.$broadcast('USER_LOGGED_IN');
                    defer.resolve(this.$rootScope.user);
                }
                else { defer.reject(response.data); }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public createUser(data) {
            var defer = this.$q.defer();

            this.$http.post(this.apiBase + 'user/create', data).then((response) => {
                if (response.status === 200) {
                    this.$rootScope.user = response.data;
                    this.$rootScope.$broadcast('USER_CREATED');
                    defer.resolve(this.$rootScope.user);
                }
                else { defer.reject(response.data); }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        // public delete(id) {
        //     var defer = this.$q.defer();

        //     this.$http.post(this.apiBase + 'user/delete', { id: id }).then(response=> {
        //         if (response.status === 200)
        //         { defer.resolve(response.data); }
        //         else { defer.reject(response.data); }
        //     }).catch(error=> {
        //         defer.reject(error.data);
        //     });

        //     return defer.promise;
        // }

        public unlinkAccount(id, type) {
            var defer = this.$q.defer();

            this.$http.post(this.apiBase + 'user/account/unlink', { id: id, type: type }).then(response=> {
                if (response.status === 200)
                { defer.resolve(response.data); }
                else { defer.reject(response.data); }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public userLoggedIn() {
            return angular.isDefined(this.$rootScope.user) && this.$rootScope.user !== null;
        }

        public getCurrentUser() {
            var defer = this.$q.defer();

            if (this.$rootScope.user) {
                this.$q.when(this.$rootScope.user);
            } else {
                this.$http.get(this.apiBase + 'user').then(response=> {
                    if (response.status === 200) {
                        this.$rootScope.user = response.data;
                        defer.resolve(this.$rootScope.user);
                    } else {
                        defer.reject(response.data);
                    }
                }).catch(error=> {
                    defer.reject(error.data);
                });
            }
            return defer.promise;
        }

        public updateProfile(user) {
            var defer = this.$q.defer();

            var data = { id: user._id, user: user };

            this.$http.post(this.apiBase + 'user/update', data).then(response=> {
                if (response.status === 200) {
                    this.$rootScope.user = response.data;
                    this.$rootScope.$broadcast('USER_UPDATED');
                    defer.resolve(this.$rootScope.user);
                } else {
                    defer.reject(response.data);
                }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public setPassword(data) {
            var defer = this.$q.defer();

            this.$http.post(this.apiBase + 'user/password', data).then(response=> {
                if (response.status === 200) {
                    this.$rootScope.user = response.data;
                    this.$rootScope.$broadcast('USER_PASSWORD_UPDATED');
                    defer.resolve(this.$rootScope.user);
                } else {
                    defer.reject(response.data);
                }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public resetPassword(password, token) {
            var defer = this.$q.defer();

            this.$http.post(this.apiBase + 'user/password/reset', { token: token, password: password }).then(response=> {
                if (response.status === 200) {
                    this.$rootScope.user = response.data;
                    this.$rootScope.$broadcast('USER_PASSWORD_RESET');
                    defer.resolve(this.$rootScope.user);
                } else {
                    defer.reject(response.data);
                }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public logout() {

            var defer = this.$q.defer();

            this.$http.get(this.apiBase + 'logout').then(response=> {
                if (response.status === 200) {
                    this.$rootScope.user = null;
                    this.$rootScope.$broadcast('USER_LOGOUT');
                    defer.resolve(response.data);
                } else {
                    defer.reject(response.data);
                }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public sendForgotPasswordEmail(email) {
            var defer = this.$q.defer();

            this.$http.post(this.apiBase + 'user/forgotpassword', { email: email }).then(response=> {
                if (response.status === 200) {
                    this.$rootScope.$broadcast('USER_FORGOTPASSWORD_EMAIL_SENT');
                    defer.resolve(true);
                } else {
                    defer.reject(false);
                }
            }).catch(error=> {
                defer.reject(error.data);
            });

            return defer.promise;
        }

        public validateResetToken(token) {
            var defer = this.$q.defer();

            this.$http.post(this.apiBase + 'user/validateResetToken', { token: token }).then(response=> {
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
    