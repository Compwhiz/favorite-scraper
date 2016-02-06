/// <reference path="../../references" />

module tumblr {
    export class TumblrController {
        static $inject = ['TumblrService'];
        likedPosts: any;
        loadingLikedPosts: boolean = false;
        constructor(private TumblrService: TumblrService) {
            this.getLikes();
        }

        public getLikes() {
            this.loadingLikedPosts = true;
            this.TumblrService.getLikes().then(response => {
                this.likedPosts = response.liked_posts;
                this.loadingLikedPosts = false;
            }).catch(error => {
                console.log(error);
                this.loadingLikedPosts = false;
            });
        }
    }
}

(() => {
    angular.module('tumblr').controller('TumblrController', tumblr.TumblrController);
})();