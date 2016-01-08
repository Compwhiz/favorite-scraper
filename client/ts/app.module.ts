/// <reference path="../../typings/tsd.d.ts" />

module favoriteScrapper {
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
		});
		
		// $locationProvider.html5Mode(true);
	}
}

(() => {
	let app = angular.module('favoriteScrapper', ['ui.bootstrap', 'ui.router', 'reddit', 'common', 'medium']);

	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', favoriteScrapper.Config]);
})();