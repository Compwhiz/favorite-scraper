/// <reference path="../../references.d.ts" />

module common.services {
    export class NotificationService {

        static $inject = ['toastr'];

        constructor(private toastr: Toastr) { }

        static factory() {
            var factory = (toastr: Toastr) => new NotificationService(toastr);
            factory.$inject = NotificationService.$inject;
            return factory;
        }

        public showSuccess(message, title = '', options?: ToastrOptions) {
            return this.toastr.success(message, title, options);
        }

        public showWarning(message, title = '', options?: ToastrOptions) {
            return this.toastr.warning(message, title, options);
        }

        public showError(message, title = '', options?: ToastrOptions) {
            return this.toastr.error(message, title, options);
        }

        public showInfo(message, title = '', options?: ToastrOptions) {
            return this.toastr.info(message, title, options);
        }

        public clearMessages() {
            this.toastr.clear();
        }
    }
}

(() => {
    angular
        .module('common')
        .service('NotificationService', common.services.NotificationService.factory());
})();
    