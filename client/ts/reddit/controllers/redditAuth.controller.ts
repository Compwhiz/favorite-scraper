/// <reference path="../reddit.d.ts" />

module reddit {
	export class RedditAuthController {
		static $inject = ['$state', 'RedditService', 'UrlService'];

		constructor(private $state: ng.ui.IStateService, private RedditService: RedditService, private UrlService: common.services.UrlService) {
			var qs = UrlService.getQueryString();
			RedditService.login(qs.state, qs.code).then((response) => {
				// RedditService.getCurrentUser().then((response) => {
					$state.go('reddit');
				// }).catch((error) => {
				// 	console.error(error);
				// });
			}).catch((error) => {
				console.error(error);
			});
		}
	}
}

(() => {
	angular.module('reddit').controller('RedditAuthController', reddit.RedditAuthController);
})();