/// <reference path="../../references.d.ts" />

module twitter {
	export class TwitterService {
		static $inject: string[] = ['$http', '$q'];
		apiBase: string = '/api/twitter/';
		currentUser: any = null;

		constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

		static factory() {
			var factory = ($http: ng.IHttpService, $q: ng.IQService) => new TwitterService($http, $q);
			factory.$inject = TwitterService.$inject;
			return factory;
		}

		public getLoginUrl() {
			var url = this.apiBase + 'auth-url';
			return this.$http.get(url).then(response => response.data);
		}
		
		public getPassportTweets() {
			var url = this.apiBase + 'passport';
			return this.$http.get(url).then(response => {
				console.log(response);
				return response.data});
		}

		public getRequestToken() {
			var url = this.apiBase + 'request-token';
			return this.$http.get(url).then(response => response.data);
		}

		public userLoggedIn() {
			return this.currentUser !== null;
		}

		public login(oauthToken, oauthVerifier) {
			var data = { oauth_token: oauthToken, oauth_verifier: oauthVerifier };
			var url = this.apiBase + 'login';
			return this.$http.post(url, data);
		}

		public getFavorites() {
			var defer = this.$q.defer();
			var url = this.apiBase + 'favorites';
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
	angular.module('twitter').factory('TwitterService', twitter.TwitterService.factory());
})();