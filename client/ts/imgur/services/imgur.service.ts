/// <reference path="../../references" />

module imgur.services {
    export class ImgurService {
        static $inject: string[] = ['$http', '$q'];
        apiBase: string = '/api/imgur/';
        currentUser: any = null;

        constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

        static factory() {
            let factory = ($http: ng.IHttpService, $q: ng.IQService) => new ImgurService($http, $q);
            factory.$inject = ImgurService.$inject;
            return factory;
        }

        /**
         * getAccount()
         */
        public getAccount() {
            let defer = this.$q.defer();

            this.$http.get(this.apiBase + 'account').then(response=> {
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

        /**
         * getFavorites()
         */
        public getFavorites() {
            let defer = this.$q.defer<any>();

            this.$http.get(this.apiBase + 'favorites').then(response=> {
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

        /**
         * getAlbumInfo(album)
         */
        public getAlbumInfo(album) {
            let defer = this.$q.defer<any>();

            if (!(album && album.id)) {
                defer.resolve(null);
            } else {
                let url = this.apiBase + 'album/' + album.id;
                this.$http.get(url).then(response=> {
                    if (response.status === 200) {
                        defer.resolve(response.data);
                    } else {
                        defer.reject(response.data);
                    }
                }).catch(error=> {
                    defer.reject(error.data);
                });
            }

            return defer.promise;
        }

        /**
         * getAlbumImages(album)
         */
        public getAlbumImages(album) {
            let defer = this.$q.defer<any>();

            if (!(album && album.id)) {
                defer.resolve(null);
            } else {
                let url = this.apiBase + 'album/' + album.id + '/images';
                this.$http.get(url).then(response=> {
                    if (response.status === 200) {
                        defer.resolve(response.data);
                    } else {
                        defer.reject(response.data);
                    }
                }).catch(error=> {
                    defer.reject(error.data);
                });
            }

            return defer.promise;
        }

        public refresh() {
            let defer = this.$q.defer();

            this.$http.get(this.apiBase + 'refresh').then(response=> {
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
    angular.module('imgur').factory('ImgurService', imgur.services.ImgurService.factory());
})();