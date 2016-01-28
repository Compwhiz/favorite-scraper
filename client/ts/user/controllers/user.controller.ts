/// <reference path="../../references" />

module user {
    export class UserController {
        static $inject = ['UserService'];

        constructor(private UserService: services.UserService) {
            
        }
    }
}

(() => {
    angular.module('user').controller('UserController', user.UserController);
})();