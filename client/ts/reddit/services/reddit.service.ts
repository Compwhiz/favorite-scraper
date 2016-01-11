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

		public getLoginUrl() {
			var url = this.apiBase + 'auth-url';
			return this.$http.get<any>(url).then(response => response.data);
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
					this.currentUser = response.data;
					defer.resolve(this.currentUser);
				}).catch((error) => {
					defer.reject(error);
				});
				return defer.promise;
			}
		}

		public getSavedPosts() {
			var url = this.apiBase + 'saved';
			return this.$http.get<any>(url).then(response => response.data);
		}

		public login(state, code) {
			var data = { state: state, code: code };
			var url = this.apiBase + 'login';
			return this.$http.post(url, data);
		}
	}
}

(() => {
	angular.module('reddit').factory('RedditService', reddit.RedditService.factory());
})();