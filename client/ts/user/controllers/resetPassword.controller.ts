/// <reference path="../../references" />

module user {
    export class ResetPasswordController {
        static $inject = ['$state','UserService', 'token'];
        public password;
        public token;
        
        constructor(private $state:ng.ui.IStateService, private UserService: services.UserService, token: string) {

        }

        public resetPassword(id, type) {
            this.UserService.resetPassword(this.password, this.token).then(response=> {
                this.$state.go('user');
            }).catch(error=> {
                console.log(error);
            });
        }
    }
}

(() => {
    angular.module('user').controller('ResetPasswordController', user.ResetPasswordController);
})();