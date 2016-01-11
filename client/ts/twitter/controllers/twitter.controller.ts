/// <reference path="../../references.d.ts" />


module twitter {
	export class TwitterController {
		static $inject = ['TwitterService','UserService'];

		public twitterLoginUrl;
		public savedPosts = [];
		public favorites: any;
		public bookmarked: any;
		public loadingFavorites = false;

		constructor(private TwitterService: TwitterService, private UserService:user.services.UserService) {
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
		
		getPassportTweets(){
			this.TwitterService.getPassportTweets();
		}

		getFavorites() {
			this.loadingFavorites = true;
			this.TwitterService.getFavorites().then((tweets) => {
				this.loadingFavorites = false;
				this.favorites = tweets;
			}).catch((error) => {
				this.loadingFavorites = false;
				console.log(error);
			});
		}
	}
}

(() => {
	angular.module('twitter').controller('TwitterController', twitter.TwitterController);
})();