/// <reference path="../medium.d.ts" />

module medium {
	export class MediumService {
		static $inject: string[] = ['$http', '$q'];
		apiBase: string = '/api/medium/';
		currentUser: User = null;

		constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

		static factory() {
			var factory = ($http: ng.IHttpService, $q: ng.IQService) => new MediumService($http, $q);
			factory.$inject = MediumService.$inject;
			return factory;
		}

		public getLoginUrl() {
			var url = this.apiBase + 'auth-url';
			return this.$http.get(url).then(response => response.data);
		}

		public userLoggedIn() {
			return this.currentUser !== null;
		}

		public getCurrentUser() {
			if (this.currentUser !== null) {
				return this.$q.when(this.currentUser);
			} else {
				var defer = this.$q.defer();
				var url = this.apiBase + 'me';
				this.$http.get(url).then((response) => {
					this.currentUser = response.data as User;
					defer.resolve(this.currentUser);
				}).catch((error) => {
					defer.reject(error);
				});
				return defer.promise;
			}
		}

		public login(state, code) {
			var data = { state: state, code: code };
			var url = this.apiBase + 'login';
			return this.$http.post(url, data);
		}

		public getUserPublications() {
			var defer = this.$q.defer();
			var url = this.apiBase + 'publications';
			this.$http.get(url).then(response => {
				if (response.status === 200)
					defer.resolve(response.data);
				else
					defer.reject(response.data);
			}).catch(error=> error.data);
			return defer.promise;
		}

		public getUserBookmarked() {
			var defer = this.$q.defer();
			var url = this.apiBase + 'bookmarked';
			this.$http.get(url).then(response => {
				if (response.status === 200)
					defer.resolve(response.data);
				else
					defer.reject(response.data);
			}).catch(error=> error.data);
			return defer.promise;
		}
	}
}

(() => {
	angular.module('medium').factory('MediumService', medium.MediumService.factory());
})();