/// <reference path="../../typings/tsd.d.ts" />

module favoriteScrapper {
	export function Config($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: '/partials/home.html'
		});
	}
}

(() => {
	let app = angular.module('favoriteScrapper', ['ui.router', 'reddit']);

	app.config(['$stateProvider', '$urlRouterProvider', favoriteScrapper.Config]);
})();