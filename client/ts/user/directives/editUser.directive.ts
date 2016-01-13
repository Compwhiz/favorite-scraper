/// <reference path="../../references.d.ts" />

module user {
    export class EditUserDirective {
        public templateUrl = 'client/views/edit-user.html';
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
        static $inject = ['$rootScope', 'UserService'];
        public user;
        public formUser: ng.IFormController;

        constructor(private $rootScope: any, private UserService: services.UserService) {
            this.user = angular.copy($rootScope.user);
        }

        public undoChanges() {
            this.user = angular.copy(this.$rootScope.user);
        }

        public updateProfile() {
            if (!this.formUser.$valid) {
                return;
            }
            this.UserService.updateProfile(this.user).then(response=> {
                console.log('Updated profile');
                console.log(response);
            }).catch(error=> {
                console.log(error);
            });
        }
    }
}

(() => {
    angular.module('user').directive('fsEditUser', user.EditUserDirective.factory());
})();