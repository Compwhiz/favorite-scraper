/// <reference path="../../references.d.ts" />

module user {
    export class CreateUserDirective {
        public templateUrl = 'client/views/create-user.html';
        public restrict = 'E';
        public controller = CreateUserDirectiveController;
        public controllerAs = 'ctrl';
        public bindToController = true;
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = [];

        constructor() {
            CreateUserDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            }
        }

        static factory() {
            var directive = () => new CreateUserDirective();
            directive.$inject = CreateUserDirective.$inject;
            return directive;
        }
    }

    class CreateUserDirectiveController {
        static $inject = ['$rootScope', '$state', 'UserService', 'NotificationService'];

        // Fields
        public user;
        public formUser: ng.IFormController;
        public profileMessages = [];
        public creatingUser = false;

        constructor(private $rootScope: any, private $state: ng.ui.IStateService, private UserService: services.UserService, private NotificationService: common.services.NotificationService) {

        }

        public createUser() {
            if (!this.formUser.$valid) {
                return;
            }
            this.creatingUser = true;
            this.UserService.createUser(this.user).then(response=> {
                this.creatingUser = false;
                this.$state.go('user');
            }).catch(error=> {
                this.creatingUser = false;
                this.addMessage(this.profileMessages, error, 'danger');
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
    angular.module('user').directive('fsCreateUser', user.CreateUserDirective.factory());
})();