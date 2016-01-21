/// <reference path="../../references.d.ts" />


module reddit {
    export class RedditController {
        static $inject = ['RedditService'];

        public redditLoginUrl;
        public savedPosts;
        public loadingSavedPosts: boolean = false;

        constructor(private RedditService: RedditService) {
            this.getSavedPosts();
        }

        getCurrentUser() {
            // this.RedditService.getCurrentUser().then((user) => {
            // 	console.log(user);
            // }).catch((error) => {
            // 	console.log(error);
            // });
        }

        public getSavedPosts() {
            this.loadingSavedPosts = true;
            this.RedditService.getSavedPosts().then((response) => {
                this.savedPosts = _.pluck(response.data.children, 'data');
                this.loadingSavedPosts = false;
            }).catch((error) => {
                console.log(error);
                this.loadingSavedPosts = false;
            })
        }

        public loadMoreSavedPosts() {
            this.loadingSavedPosts = true;

            var after = _.last<any>(this.savedPosts).name;

            this.RedditService.getSavedPosts(after).then((response) => {
                this.loadingSavedPosts = false;
                this.savedPosts = this.savedPosts.concat(_.pluck(response.data.children, 'data'));
            }).catch((error) => {
                this.loadingSavedPosts = false;
                console.log(error);
            });
        }

    }
}

(() => {
    angular.module('reddit').controller('RedditController', reddit.RedditController);
})();