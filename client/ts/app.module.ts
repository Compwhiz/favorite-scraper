/// <reference path="./references.d.ts" />
	

module favoriteScraper {
    export function Config($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $httpProvider: ng.IHttpProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'partials/home.html'
        }).state('reddit', {
            url: '/reddit',
            templateUrl: 'partials/reddit.html',
            controller: 'RedditController',
            controllerAs: 'ctrl'
        }).state('medium', {
            url: '/medium',
            templateUrl: 'partials/medium.html',
            controller: 'MediumController',
            controllerAs: 'ctrl'
        }).state('twitter', {
            url: '/twitter',
            templateUrl: 'partials/twitter.html',
            controller: 'TwitterController',
            controllerAs: 'ctrl'
        }).state('imgur', {
            url: '/imgur',
            templateUrl: 'partials/imgur.html',
            controller: 'ImgurController',
            controllerAs: 'ctrl'
        }).state('user', {
            url: '/user',
            templateUrl: 'partials/user.html',
            controller: 'UserController',
            controllerAs: 'ctrl'
        }).state('login', {
            url: '/login',
            templateUrl: 'partials/login.html'
        }).state('signup', {
            url: '/signup',
            templateUrl: 'partials/signup.html'
        }).state('reset', {
            url: '/reset?token', //:[a-z,A-Z,0-9]{32}
            templateUrl: 'partials/reset.html',
            controller: 'ResetPasswordController',
            controllerAs: 'ctrl',
            resolve: {
                token: ['$stateParams', '$state', 'UserService', ($stateParams: ng.ui.IStateParamsService, $state: ng.ui.IStateService, UserService: user.services.UserService) => {
                    return UserService.validateResetToken($stateParams['token']).then(response=> {
                        return $stateParams['token'];
                    }).catch(error=> {
                        $state.go('home');
                    });
                }]
            }
        });
        
        // $httpProvider.interceptors.push('HttpInterceptorService');
    }
}

(() => {
    angular.module('templates', []);

    let app = angular.module('favoriteScraper', [
        // Angular
        'ngSanitize',
        'ngMessages',
        // 3rd party
        'ui.bootstrap',
        'ui.router',
        'angularMoment',
        'angular-loading-bar',
        // Project
        'imgur',
        'reddit',
        'common',
        'medium',
        'twitter',
        'user',
        'templates'
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', favoriteScraper.Config]);

    app.constant('toastr', window['toastr']);
})();