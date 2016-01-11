/// <reference path="../../references" />

module imgur.services {
	export class ImgurService {
		static $inject: string[] = ['$http', '$q'];
		apiBase: string = '/api/imgur/';
		currentUser: any = null;

		constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

		static factory() {
			var factory = ($http: ng.IHttpService, $q: ng.IQService) => new ImgurService($http, $q);
			factory.$inject = ImgurService.$inject;
			return factory;
		}

		public getAccount() {
			var defer = this.$q.defer();

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

		public getFavorites() {
			var defer = this.$q.defer();

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
		
		public refresh() {
			var defer = this.$q.defer();

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