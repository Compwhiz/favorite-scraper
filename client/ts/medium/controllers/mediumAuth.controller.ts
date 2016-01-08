/// <reference path="../medium.d.ts" />

module medium {
	export class MediumAuthController {
		static $inject = ['$state', 'MediumService', 'UrlService'];

		constructor(private $state: ng.ui.IStateService, private MediumService: MediumService, private UrlService: common.services.UrlService) {
			var qs = UrlService.getQueryString();
			MediumService.login(qs.state, qs.code).then((response) => {
				MediumService.getCurrentUser().then((response) => {
					console.log(response);
					$state.go('medium');
				}).catch((error) => {
					console.error(error);
				})
			}).catch((error) => {
				console.error(error);
			});
		}
	}
}

(() => {
	angular.module('medium').controller('MediumAuthController', medium.MediumAuthController);
})();