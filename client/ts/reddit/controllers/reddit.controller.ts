/// <reference path="../reddit.d.ts" />


module reddit {
	export class RedditController {
		static $inject = ['RedditService'];

		public redditLoginUrl;

		constructor(private RedditService: RedditService) {
			this.getRedditLoginUrl();
		}

		getRedditLoginUrl() {
			this.RedditService.getLoginUrl().then((response) => {
				console.log(response);
				this.redditLoginUrl = response;
			});
		}

		userLoggedIn() {
			return this.RedditService.userLoggedIn();
		}

		getCurrentUser() {
			this.RedditService.getCurrentUser().then((user) => {
				console.log(user);
			}).catch((error) => {
				console.log(error);
			});
		}
	}
}

(() => {
	angular.module('reddit.controllers', []).controller('RedditController', reddit.RedditController);
})();