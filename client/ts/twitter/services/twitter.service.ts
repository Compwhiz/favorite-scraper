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

		public getFavorites(max_id?) {
			var defer = this.$q.defer();
			var url = this.apiBase + 'favorites';
            if(max_id){
                url += '?maxID=' + max_id;
            }
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