/// <reference path="../../references.d.ts" />


module twitter {
    export class TwitterController {
        static $inject = ['TwitterService', 'UserService'];

        public twitterLoginUrl;
        public savedPosts = [];
        public favorites: any = [];
        public bookmarked: any;
        public loadingFavorites = false;

        constructor(private TwitterService: TwitterService, private UserService: user.services.UserService) {
            this.getFavorites();
        }

        loadMoreFavorites() {
            this.loadingFavorites = true;

            var maxID = _.last<any>(this.favorites).id;

            this.TwitterService.getFavorites(maxID).then((tweets) => {
                this.loadingFavorites = false;
                if (Array.isArray(tweets)) {
                    this.favorites = this.favorites.concat(tweets);
                }
            }).catch((error) => {
                this.loadingFavorites = false;
                console.log(error);
            });
        }

        getFavorites() {
            this.loadingFavorites = true;
            this.TwitterService.getFavorites().then((tweets) => {
                this.loadingFavorites = false;
                if (Array.isArray(tweets)) {
                    this.favorites = tweets;
                }
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