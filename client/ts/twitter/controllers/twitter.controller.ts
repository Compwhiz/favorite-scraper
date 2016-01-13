/// <reference path="../../references.d.ts" />


module twitter {
    export class TwitterController {
        static $inject = ['$timeout', 'TwitterService', 'UserService'];

        public twitterLoginUrl;
        public savedPosts = [];
        public favorites: any;
        public bookmarked: any;
        public loadingFavorites = false;

        constructor(private $timeout: ng.ITimeoutService, private TwitterService: TwitterService, private UserService: user.services.UserService) {
            this.getFavorites();
        }

        getTwitterRequestToken() {
            this.TwitterService.getRequestToken().then((response) => {
                console.log(response);
            });
        }

        getCurrentUser() {
            // this.TwitterService.getCurrentUser().then((user) => {
            // 	console.log(user);
            // }).catch((error) => {
            // 	console.log(error);
            // });
        }

        getPassportTweets() {
            this.TwitterService.getPassportTweets();
        }

        loadMoreFavorites() {
            this.loadingFavorites = true;
            
            var maxID = _.last<any>(this.favorites).id;
            
            this.TwitterService.getFavorites(maxID).then((tweets) => {
                this.loadingFavorites = false;
                this.favorites = this.favorites.concat(tweets);
            }).catch((error) => {
                this.loadingFavorites = false;
                console.log(error);
            });
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