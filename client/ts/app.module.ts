/// <reference path="../../typings/tsd.d.ts" />

module favoriteScraper {
	export function Config($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $locationProvider: ng.ILocationProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: '/partials/home.html'
		}).state('reddit', {
			url: '/reddit',
			templateUrl: '/partials/reddit.html',
			controller: 'RedditController',
			controllerAs: 'ctrl'
		}).state('redditCallback', {
			url: '/reddit/auth/callback',
			controller: 'RedditAuthController'
		}).state('medium', {
			url: '/medium',
			templateUrl: '/partials/medium.html',
			controller: 'MediumController',
			controllerAs: 'ctrl'
		}).state('mediumCallback', {
			url: '/medium/auth/callback',
			controller: 'MediumAuthController'
		}).state('twitter', {
			url: '/twitter',
			templateUrl: '/partials/twitter.html',
			controller: 'TwitterController',
			controllerAs: 'ctrl'
		}).state('twitterCallback', {
			url: '/twitter/auth/callback',
			controller: 'TwitterAuthController'
		});
		
		// $locationProvider.html5Mode(true);
	}
}

(() => {
	let app = angular.module('favoriteScraper', [
		// Angular
		'ngSanitize',
		// 3rd party
		'ui.bootstrap',
		'ui.router',
		'angularMoment',
		// Project
		'reddit',
		'common',
		'medium',
		'twitter'
	]);

	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', favoriteScraper.Config]);
})();