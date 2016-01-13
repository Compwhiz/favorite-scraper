/// <reference path="../../references" />

module common {
    export class RootController {
        static $inject = ['$rootScope', '$state', 'UserService'];

        constructor(private $rootScope: ng.IRootScopeService, private $state:ng.ui.IStateService, private UserService: user.services.UserService) {
            UserService.getCurrentUser();
            
            $rootScope.$on('USER_LOGOUT', ()=>{
                $state.go('home');
            });
        }
    }
}

(() => {
    angular.module('common').controller('RootController', common.RootController);
})();