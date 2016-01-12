/// <reference path="../../references" />

module user {
    export class UserController {
        static $inject = ['UserService'];
        public users: any;

        constructor(private UserService: services.UserService) {
            this.getAllUsers();
        }

        public getAllUsers() {
            this.UserService.getAllUsers().then(users=> {
                this.users = users;
            }).catch(error=> {
                console.log(error);
            })
        }

        public delete(id) {
            this.UserService.delete(id).then(response=> {
                console.log(response);
                this.getAllUsers();
            }).catch(error=> {
                console.log(error);
            });
        }

        public unlinkAccount(id, type) {
            this.UserService.unlinkAccount(id, type).then(response=> {
                console.log(response);
                this.getAllUsers();
            }).catch(error=> {
                console.log(error);
            });
        }
    }
}

(() => {
    angular.module('user').controller('UserController', user.UserController);
})();