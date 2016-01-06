/// <reference path="../reddit.d.ts" />

module reddit {
	export class RedditAuthController {
		static $inject = ['RedditService'];

		constructor(private RedditService: RedditService) {
			
		}
	}
}

(() => {
	angular.module('reddit.controllers', []).controller('RedditAuthController', reddit.RedditAuthController);
})();