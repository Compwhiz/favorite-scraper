/// <reference path="../../references" />

module user {
    export class ResetPasswordController {
        static $inject = ['$state', 'UserService', 'token'];
        public password;
        public formPassword: ng.IFormController;

        constructor(private $state: ng.ui.IStateService, private UserService: services.UserService, private token: string) {

        }

        public resetPassword() {
            if (!this.formPassword.$valid) {
                return;
            }
            
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