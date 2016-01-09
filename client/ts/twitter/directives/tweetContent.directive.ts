/// <reference path="../twitter.d.ts" />

module twitter {
	interface TweetContentScope extends ng.IScope {
		text?: string;
		entities?: any;
		extendedEntities?: any;
		showPictures?: boolean;
	}

	export class TweetContentDirective {
		public templateUrl = 'client/views/tweet-content.html';
		public restrict = 'E';
		public scope = { text: '=', entities: '=', extendedEntities: '=', showPictures: '=' };
		public link: (scope: TweetContentScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

		constructor() {
			TweetContentDirective.prototype.link = (scope: TweetContentScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
				var text = scope.text;
				angular.forEach(scope.entities.urls, (url, idx) => {
					text = text.replace(url.url, '<a href="' + url.url + '" target="_blank">' + url.url + '</a>');
				});

				angular.forEach(scope.entities.media, (media) => {
					var replace = '';
					if (scope.showPictures) {
						replace = '<a href="' + media.media_url_https + '" target="_blank">' + media.url + '</a>';
					}
					text = text.replace(media.url, replace);
				});

				scope.text = text;
			}
		}

		static factory() {
			var directive = () => new TweetContentDirective();
			return directive;
		}
	}
}

(() => {
	angular.module('twitter').directive('fsTweetContent', twitter.TweetContentDirective.factory());
})();