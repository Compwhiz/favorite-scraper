/// <reference path="../../references.d.ts" />

module user {
    export class LoginDirective {
        public templateUrl = 'client/views/login.html';
        public restrict = 'E';
        public controller = LoginDirectiveController;
        public controllerAs = 'ctrl';
        public bindToController = true;
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = [];

        constructor() {
            LoginDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            }
        }

        static factory() {
            var directive = () => new LoginDirective();
            directive.$inject = LoginDirective.$inject;
            return directive;
        }
    }

    class LoginDirectiveController {
        static $inject = ['$rootScope', '$state', 'UserService', 'NotificationService'];

        // Fields
        public user: any = {};
        public formLogin: ng.IFormController;
        public loginMessages = [];
        public loggingIn = false;
        public sendForgotPasswordError = false;

        constructor(private $rootScope: any, private $state: ng.ui.IStateService, private UserService: services.UserService, private NotificationService: common.services.NotificationService) {

        }

        public login() {
            this.loginMessages = [];

            if (!this.formLogin.$valid) {
                return;
            }
            this.loggingIn = true;
            this.UserService.login(this.user).then(response=> {
                this.loggingIn = false;
                this.$state.go('user');
            }).catch(error=> {
                this.loggingIn = false;
                this.addMessage(this.loginMessages, error, 'danger');
            });
        }

        public forgotPassword() {
            this.loginMessages = [];

            this.sendForgotPasswordError = false;
            if (!this.user.email || (<any>this.formLogin).userEmail.$error.length) {
                this.sendForgotPasswordError = true;
                return;
            }

            this.UserService.sendForgotPasswordEmail(this.user.email).then(sent=> {
                if (sent) {
                    this.addMessage(this.loginMessages, 'An email has been sent to the email entered');
                }
                else {
                    this.addMessage(this.loginMessages, 'Something went wrong', 'danger');
                }
            }).catch(error=> {
                this.addMessage(this.loginMessages, 'Something went wrong', 'danger');
            });

        }

        private addMessage(list: any[], msg, type = 'success') {
            if (!Array.isArray(msg)) {
                msg = [msg];
            }

            angular.forEach(msg, m => {
                var obj: any = {};
                if (typeof m === 'string') {
                    obj.message = m;
                } else {
                    _.extend(obj, m);
                }
                obj.type = obj.type || type;
                list.push(obj);
            });
        }

        public resetForm() {
            this.user = {};
            this.formLogin.$setPristine();
        }
    }
}

(() => {
    angular.module('user').directive('fsLogin', user.LoginDirective.factory());
})();