/// <reference path="../../references.d.ts" />


module reddit {
	export class RedditController {
		static $inject = ['RedditService'];

		public redditLoginUrl;
		public savedPosts = [];
		public loadingSavedPosts: boolean = false;

		constructor(private RedditService: RedditService) {
			this.getRedditLoginUrl();
		}

		getRedditLoginUrl() {
			this.RedditService.getLoginUrl().then((response) => {
				if (response.auth) {
					this.getSavedPosts();
				}
				this.redditLoginUrl = response.url;
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

		getSavedPosts() {
			this.loadingSavedPosts = true;
			this.RedditService.getSavedPosts().then((response) => {
				this.savedPosts = _.pluck(response.data.children, 'data');
				this.loadingSavedPosts = false;
			}).catch((error) => {
				console.log(error);
				this.loadingSavedPosts = false;
			})
		}
	}
}

(() => {
	angular.module('reddit').controller('RedditController', reddit.RedditController);
})();