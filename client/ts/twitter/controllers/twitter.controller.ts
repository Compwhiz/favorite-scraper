/// <reference path="../twitter.d.ts" />


module twitter {
	export class TwitterController {
		static $inject = ['TwitterService'];

		public twitterLoginUrl;
		public savedPosts = [];
		public favorites: any;
		public bookmarked: any;


		constructor(private TwitterService: TwitterService) {
		}

		getTwitterLoginUrl() {
			this.TwitterService.getLoginUrl().then((response) => {
				this.twitterLoginUrl = response;
			});
		}

		getTwitterRequestToken() {
			this.TwitterService.getRequestToken().then((response) => {
				console.log(response);
			});
		}

		userLoggedIn() {
			return this.TwitterService.userLoggedIn();
		}

		getCurrentUser() {
			// this.TwitterService.getCurrentUser().then((user) => {
			// 	console.log(user);
			// }).catch((error) => {
			// 	console.log(error);
			// });
		}

		getFavorites() {
			this.TwitterService.getFavorites().then((tweets) => {
				this.favorites = tweets;
			}).catch((error) => {
				console.error(error);
			});
		}
	}
}

(() => {
	angular.module('twitter').controller('TwitterController', twitter.TwitterController);
})();