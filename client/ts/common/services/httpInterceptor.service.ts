/// <reference path="../../references.d.ts" />

module common.services {
    export class HttpInterceptorService {

        static $inject = ['NotificationService'];

        constructor(private NotificationService: NotificationService) {
            
        }

        static factory() {
            var factory = (NotificationService: NotificationService) => new HttpInterceptorService(NotificationService);
            factory.$inject = HttpInterceptorService.$inject;
            return factory;
        }

        public responseError = (response) => {
            if (response.status === 400) {
                this.NotificationService.showError(response.data);
            }
            return response;
        }
    }
}

(() => {
    angular
        .module('common')
        .service('HttpInterceptorService', common.services.HttpInterceptorService.factory());
})();