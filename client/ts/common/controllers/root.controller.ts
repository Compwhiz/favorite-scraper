/// <reference path="../../references" />

module common {
    export class RootController {
        static $inject = ['$rootScope', 'UserService'];

        constructor(private $rootScope: ng.IRootScopeService, private UserService: user.services.UserService) {
            UserService.getCurrentUser();
        }
    }
}

(() => {
    angular.module('common').controller('RootController', common.RootController);
})();