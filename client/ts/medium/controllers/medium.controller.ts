/// <reference path="../../references.d.ts" />

module medium {
	export class MediumController {
		static $inject = ['MediumService'];

		public mediumLoginUrl;
		public savedPosts = [];
		public publications: any;
		public bookmarked: any;


		constructor(private MediumService: MediumService) {
			this.getMediumLoginUrl();
		}

		getMediumLoginUrl() {
			this.MediumService.getLoginUrl().then((response) => {
				this.mediumLoginUrl = response;
			});
		}

		userLoggedIn() {
			return this.MediumService.userLoggedIn();
		}

		getCurrentUser() {
			this.MediumService.getCurrentUser().then((user) => {
				console.log(user);
			}).catch((error) => {
				console.log(error);
			});
		}

		getPublications() {
			this.MediumService.getUserPublications().then((pubs) => {
				
				this.publications = pubs;
			}).catch((error)=>{
				console.error(error);
			});
		}
		
		getBookmarked() {
			this.MediumService.getUserBookmarked().then((response) => {
				this.bookmarked = response;
			}).catch((error)=>{
				console.error(error);
			});
		}
	}
}

(() => {
	angular.module('medium').controller('MediumController', medium.MediumController);
})();