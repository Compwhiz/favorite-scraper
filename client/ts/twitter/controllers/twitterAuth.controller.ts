/// <reference path="../../references.d.ts" />

module twitter {
	export class TwitterAuthController {
		static $inject = ['$state', 'TwitterService', 'UrlService'];

		constructor(private $state: ng.ui.IStateService, private TwitterService: TwitterService, private UrlService: common.services.UrlService) {
			var qs = UrlService.getQueryString();
			TwitterService.login(qs.oauth_token, qs.oauth_verifier).then((response) => {
				// TwitterService.getCurrentUser().then((response) => {
				console.log(response);
				$state.go('twitter');
				// }).catch((error) => {
				// 	console.error(error);
				// })
			}).catch((error) => {
				console.error(error);
			});
		}
	}
}

(() => {
	angular.module('twitter').controller('TwitterAuthController', twitter.TwitterAuthController);
})();