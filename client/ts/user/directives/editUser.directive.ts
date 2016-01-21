/// <reference path="../../references.d.ts" />

module user {
    export class EditUserDirective {
        public templateUrl = 'views/edit-user.html';
        public restrict = 'E';
        public controller = EditUserDirectiveController;
        public controllerAs = 'ctrl';
        public bindToController = true;
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = [];

        constructor() {
            EditUserDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            }
        }

        static factory() {
            var directive = () => new EditUserDirective();
            directive.$inject = EditUserDirective.$inject;
            return directive;
        }
    }

    class EditUserDirectiveController {
        static $inject = ['$rootScope', 'UserService', 'NotificationService'];

        // Fields
        public user;
        public formUser: ng.IFormController;
        public formPassword: ng.IFormController;
        public passwordData = {};
        public profileMessages = [];
        public passwordMessages = [];
        public updatingProfile = false;
        public updatingPassword = false;

        constructor(private $rootScope: any, private UserService: services.UserService, private NotificationService: common.services.NotificationService) {
            this.user = angular.copy($rootScope.user);
        }

        public undoChanges() {
            this.user = angular.copy(this.$rootScope.user);
        }

        public updateProfile() {
            this.profileMessages = [];

            if (!this.formUser.$valid) {
                return;
            }
            this.updatingProfile = true;
            this.UserService.updateProfile(this.user).then(response=> {
                // this.NotificationService.showSuccess('Profile updated');
                this.updatingProfile = false;
                this.addMessage(this.profileMessages, { message: 'Profile updated', timeout: 2500 });
            }).catch(error=> {
                this.updatingProfile = false;
                this.addMessage(this.profileMessages, error, 'danger');
            });
        }

        public setOrUpdatePassword() {
            this.passwordMessages = [];

            if (!this.formPassword.$valid) {
                return;
            }
            this.updatingPassword = true;
            this.UserService.setPassword(this.passwordData).then(response=> {
                // this.NotificationService.showSuccess('Password updated');
                this.formPassword.$setPristine();
                this.updatingPassword = false;
                this.addMessage(this.passwordMessages, { message: 'Password updated', timeout: 2500 });
            }).catch(error=> {
                this.updatingPassword = false;
                this.addMessage(this.passwordMessages, error, 'danger');
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
    }
}

(() => {
    angular.module('user').directive('fsEditUser', user.EditUserDirective.factory());
})();