/// <reference path="../../references.d.ts" />

module twitter {
	interface TweetScope extends ng.IScope {
		tweet?: any;
	}

	export class TweetDirective {
		public templateUrl = 'views/tweet.html';
		public restrict = 'E';
		public scope = { tweet: '=' };
		public link: (scope: TweetScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

		constructor() {
			TweetDirective.prototype.link = (scope: TweetScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

			}
		}

		static factory() {
			var directive = () => new TweetDirective();
			return directive;
		}
	}
}

(() => {
	angular.module('twitter').directive('fsTweet', twitter.TweetDirective.factory());
})();