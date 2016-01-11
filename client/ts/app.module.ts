/// <reference path="./references.d.ts" />
	

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
		}).state('medium', {
			url: '/medium',
			templateUrl: '/partials/medium.html',
			controller: 'MediumController',
			controllerAs: 'ctrl'
		}).state('twitter', {
			url: '/twitter',
			templateUrl: '/partials/twitter.html',
			controller: 'TwitterController',
			controllerAs: 'ctrl'
		}).state('imgur', {
			url: '/imgur',
			templateUrl: '/partials/imgur.html',
			controller: 'ImgurController',
			controllerAs: 'ctrl'
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
		'imgur',
		'reddit',
		'common',
		'medium',
		'twitter',
		'user'
	]);

	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', favoriteScraper.Config]);
})();